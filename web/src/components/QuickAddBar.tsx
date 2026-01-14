import { useState } from 'react';
import { motion } from 'framer-motion';
import { createItem } from '../api';
import { useStore } from '../store';

const presets = [
  {
    kind: 'image' as const,
    title: 'Glass Canyon',
    description: 'Amber haze with teal glints',
    content_url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee'
  },
  { kind: 'color' as const, title: 'Iridescent Lilac', color_hex: '#c6b2f5' },
  { kind: 'note' as const, title: 'Anchor motifs', description: 'Add chrome edges; keep typography bold condensed' }
];

export function QuickAddBar() {
  const { activeBoardId, addItemLocal } = useStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const add = async (idx: number) => {
    if (!activeBoardId) return;
    const preset = presets[idx];
    setLoadingId(preset.title);
    try {
      const item = await createItem(activeBoardId, { ...preset, pos_x: 40 + idx * 30, pos_y: 40 + idx * 20, rotation: 0 });
      addItemLocal(item);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {presets.map((p, idx) => (
        <motion.button
          key={p.title}
          onClick={() => add(idx)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm flex items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wide bg-white/10 px-2 py-1 rounded-lg">{p.kind}</span>
          <span>{loadingId === p.title ? 'Adding...' : p.title}</span>
        </motion.button>
      ))}
    </div>
  );
}

