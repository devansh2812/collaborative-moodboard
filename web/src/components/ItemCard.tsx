import { motion } from 'framer-motion';
import { BoardItem } from '../types';

interface Props {
  item: BoardItem;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export function ItemCard({ item, onDragEnd }: Props) {
  const style = {
    x: item.pos_x,
    y: item.pos_y,
    rotate: item.rotation,
    zIndex: item.z_index
  };

  const base =
    'rounded-2xl backdrop-blur bg-white/5 border border-white/10 shadow-lg hover:shadow-glow transition-all overflow-hidden';

  const content = () => {
    switch (item.kind) {
      case 'image':
        return (
          <div className="relative">
            <img src={item.content_url ?? ''} alt={item.title ?? ''} className="w-64 h-40 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-sm font-semibold drop-shadow">
              {item.title ?? 'Image'}
            </div>
          </div>
        );
      case 'color':
        return (
          <div className="w-48 h-32 flex items-end justify-between p-3" style={{ background: item.color_hex ?? '#888' }}>
            <span className="text-sm font-semibold drop-shadow">{item.title ?? 'Color'}</span>
            <span className="text-xs bg-black/50 rounded px-2 py-1">{item.color_hex}</span>
          </div>
        );
      case 'note':
        return (
          <div className="w-56 min-h-[120px] bg-amber-100 text-amber-950 p-4">
            <div className="text-sm font-semibold">{item.title ?? 'Note'}</div>
            <p className="text-sm opacity-80 mt-2">{item.description}</p>
          </div>
        );
      case 'link':
      default:
        return (
          <div className="w-60 bg-slate-900 p-4">
            <div className="text-sm font-semibold mb-1">{item.title ?? 'Link'}</div>
            <p className="text-xs opacity-80 line-clamp-2">{item.description ?? item.content_url}</p>
          </div>
        );
    }
  };

  return (
    <motion.div
      className={base}
      style={style}
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onDragEnd={(_, info) => onDragEnd(item.id, info.point.x, info.point.y)}
    >
      {content()}
    </motion.div>
  );
}

