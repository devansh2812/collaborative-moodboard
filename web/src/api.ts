import { Board, BoardItem, ItemKind } from './types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json() as Promise<T>;
}

export function fetchBoards() {
  return http<{ boards: Board[] }>('/boards');
}

export function fetchBoard(id: string) {
  return http<{ board: Board; items: BoardItem[] }>(`/boards/${id}`);
}

export function createItem(boardId: string, payload: Partial<BoardItem> & { kind: ItemKind }) {
  return http<BoardItem>(`/boards/${boardId}/items`, {
    method: 'POST',
    body: JSON.stringify({
      kind: payload.kind,
      title: payload.title,
      description: payload.description,
      contentUrl: payload.content_url,
      colorHex: payload.color_hex,
      meta: payload.meta,
      posX: payload.pos_x,
      posY: payload.pos_y,
      rotation: payload.rotation,
      zIndex: payload.z_index
    })
  });
}

export function updateItem(boardId: string, itemId: string, payload: Partial<BoardItem>) {
  return http<BoardItem>(`/boards/${boardId}/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      posX: payload.pos_x,
      posY: payload.pos_y,
      rotation: payload.rotation,
      zIndex: payload.z_index
    })
  });
}

export function search(boardId: string | null, q: string) {
  const params = new URLSearchParams({ q });
  if (boardId) params.set('boardId', boardId);
  return http<{ results: BoardItem[] }>(`/search?${params.toString()}`);
}

