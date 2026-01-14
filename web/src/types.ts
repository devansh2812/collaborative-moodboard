export type ItemKind = 'image' | 'link' | 'color' | 'note';

export interface Board {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  created_at: string;
}

export interface BoardItem {
  id: string;
  board_id: string;
  created_by: string | null;
  kind: ItemKind;
  title: string | null;
  description: string | null;
  content_url: string | null;
  color_hex: string | null;
  meta: Record<string, unknown>;
  pos_x: number;
  pos_y: number;
  rotation: number;
  z_index: number;
  created_at: string;
  updated_at: string;
}

