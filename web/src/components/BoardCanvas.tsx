import { useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { updateItem } from '../api';
import { useStore } from '../store';
import { ItemCard } from './ItemCard';

export function BoardCanvas() {
  const { items, activeBoardId, updateItemLocal } = useStore();

  const handleDragEnd = useCallback(
    async (id: string, x: number, y: number) => {
      updateItemLocal(id, { pos_x: x, pos_y: y });
      if (!activeBoardId) return;
      try {
        await updateItem(activeBoardId, id, { pos_x: x, pos_y: y });
      } catch (err) {
        console.error(err);
      }
    },
    [activeBoardId, updateItemLocal]
  );

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-950">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.25),transparent_25%),radial-gradient(circle_at_80%_30%,rgba(34,211,238,0.25),transparent_22%),radial-gradient(circle_at_40%_80%,rgba(16,185,129,0.18),transparent_20%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 p-10">
        <AnimatePresence>
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onDragEnd={handleDragEnd} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

