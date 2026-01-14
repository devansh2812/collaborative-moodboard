import { create } from 'zustand';
import { Board, BoardItem } from './types';

interface State {
  boards: Board[];
  activeBoardId: string | null;
  items: BoardItem[];
  setBoards: (boards: Board[]) => void;
  setActiveBoard: (id: string | null) => void;
  setItems: (items: BoardItem[]) => void;
  updateItemLocal: (id: string, patch: Partial<BoardItem>) => void;
  addItemLocal: (item: BoardItem) => void;
}

export const useStore = create<State>((set) => ({
  boards: [],
  activeBoardId: null,
  items: [],
  setBoards: (boards) => set({ boards, activeBoardId: boards[0]?.id ?? null }),
  setActiveBoard: (id) => set({ activeBoardId: id }),
  setItems: (items) => set({ items }),
  updateItemLocal: (id, patch) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    })),
  addItemLocal: (item) =>
    set((state) => ({
      items: [...state.items, item]
    }))
}));

