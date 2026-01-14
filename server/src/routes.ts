import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { query } from './db.js';
import { textToVector, vectorToPg } from './embedding.js';
import { Board, BoardItem, ItemKind } from './types.js';

const uuid = z.string().uuid();

export async function registerRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({ ok: true }));

  app.get('/boards', async () => {
    const boards = await query<Board>('SELECT * FROM board ORDER BY created_at DESC LIMIT 12');
    return { boards };
  });

  app.post('/boards', async (req, res) => {
    const schema = z.object({
      title: z.string().min(1).max(120),
      description: z.string().max(400).optional(),
      ownerId: uuid.optional()
    });
    const body = schema.parse(req.body);
    const rows = await query<Board>(
      `INSERT INTO board (title, description, owner_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.title, body.description ?? null, body.ownerId ?? null]
    );
    res.code(201);
    return rows[0];
  });

  app.get('/boards/:id', async (req, res) => {
    const paramsSchema = z.object({ id: uuid });
    const { id } = paramsSchema.parse(req.params);

    const boards = await query<Board>('SELECT * FROM board WHERE id = $1', [id]);
    if (!boards.length) {
      res.code(404);
      return { error: 'Not found' };
    }
    const items = await query<BoardItem>('SELECT * FROM board_item WHERE board_id = $1 ORDER BY z_index ASC', [id]);
    return { board: boards[0], items };
  });

  app.post('/boards/:id/items', async (req, res) => {
    const paramsSchema = z.object({ id: uuid });
    const { id: boardId } = paramsSchema.parse(req.params);
    const schema = z.object({
      kind: z.enum(['image', 'link', 'color', 'note']),
      title: z.string().max(120).nullable().optional(),
      description: z.string().max(400).nullable().optional(),
      contentUrl: z.string().url().max(500).nullable().optional(),
      colorHex: z.string().regex(/^#?[0-9a-fA-F]{6}$/).nullable().optional(),
      meta: z.record(z.any()).optional(),
      posX: z.number().optional().default(0),
      posY: z.number().optional().default(0),
      rotation: z.number().optional().default(0),
      zIndex: z.number().int().optional().default(0),
      createdBy: uuid.optional()
    });
    const body = schema.parse(req.body);
    const textForEmbedding = [body.title ?? '', body.description ?? ''].join(' ').trim();
    const embed = textForEmbedding ? textToVector(textForEmbedding) : textToVector(body.kind);

    const rows = await query<BoardItem>(
      `INSERT INTO board_item
        (board_id, created_by, kind, title, description, content_url, color_hex, meta, pos_x, pos_y, rotation, z_index, embedding)
       VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::vector)
       RETURNING *`,
      [
        boardId,
        body.createdBy ?? null,
        body.kind,
        body.title ?? null,
        body.description ?? null,
        body.contentUrl ?? null,
        body.colorHex ? normalizeHex(body.colorHex) : null,
        JSON.stringify(body.meta ?? {}),
        body.posX ?? 0,
        body.posY ?? 0,
        body.rotation ?? 0,
        body.zIndex ?? 0,
        vectorToPg(embed)
      ]
    );
    res.code(201);
    return rows[0];
  });

  app.patch('/boards/:id/items/:itemId', async (req, res) => {
    const paramsSchema = z.object({ id: uuid, itemId: uuid });
    const { id: boardId, itemId } = paramsSchema.parse(req.params);
    const schema = z.object({
      title: z.string().max(120).nullable().optional(),
      description: z.string().max(400).nullable().optional(),
      posX: z.number().optional(),
      posY: z.number().optional(),
      rotation: z.number().optional(),
      zIndex: z.number().int().optional()
    });
    const body = schema.parse(req.body);

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const [key, val] of Object.entries(body)) {
      if (val === undefined) continue;
      updates.push(`${toColumn(key)} = $${idx++}`);
      values.push(val);
    }

    if (!updates.length) {
      return { ok: true };
    }

    const textForEmbedding = [body.title ?? '', body.description ?? ''].join(' ').trim();
    if (textForEmbedding) {
      updates.push(`embedding = $${idx++}::vector`);
      values.push(vectorToPg(textToVector(textForEmbedding)));
    }

    values.push(boardId, itemId);

    const sql = `
      UPDATE board_item
      SET ${updates.join(', ')}, updated_at = now()
      WHERE board_id = $${idx++} AND id = $${idx}
      RETURNING *`;

    const rows = await query<BoardItem>(sql, values);
    if (!rows.length) {
      res.code(404);
      return { error: 'Item not found' };
    }
    return rows[0];
  });

  app.get('/search', async (req, res) => {
    const schema = z.object({
      q: z.string().min(1),
      boardId: uuid.optional()
    });
    const { q, boardId } = schema.parse(req.query);
    const vector = vectorToPg(textToVector(q));

    const rows = await query<BoardItem & { rank: number; distance: number }>(
      `
      SELECT bi.*,
        ts_rank(bi.search_tsv, plainto_tsquery($2)) AS rank,
        bi.embedding <=> $3::vector AS distance
      FROM board_item bi
      WHERE ($1::uuid IS NULL OR bi.board_id = $1)
        AND (bi.search_tsv @@ plainto_tsquery($2) OR bi.embedding IS NOT NULL)
      ORDER BY (bi.search_tsv @@ plainto_tsquery($2)) DESC, rank DESC NULLS LAST, distance ASC NULLS LAST
      LIMIT 12
      `,
      [boardId ?? null, q, vector]
    );
    return { results: rows };
  });
}

function normalizeHex(hex: string): string {
  if (!hex.startsWith('#')) return `#${hex}`;
  return hex;
}

function toColumn(key: string): string {
  switch (key) {
    case 'posX':
      return 'pos_x';
    case 'posY':
      return 'pos_y';
    case 'zIndex':
      return 'z_index';
    default:
      return key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
  }
}

