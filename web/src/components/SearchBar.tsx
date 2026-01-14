import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { search } from '../api';
import { useStore } from '../store';
import { BoardItem } from '../types';

export function SearchBar() {
  const { activeBoardId, updateItemLocal } = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      setLoading(true);
      search(activeBoardId, debouncedQuery)
        .then((data) => setResults(data.results))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, 220);
    return () => clearTimeout(t);
  }, [debouncedQuery, activeBoardId]);

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 shadow-inner shadow-black/30">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the vibe (colors, notes, titles)..."
          className="w-full bg-transparent outline-none text-sm placeholder:text-white/50"
        />
        {loading ? <div className="h-2 w-2 rounded-full bg-accent animate-ping" /> : null}
      </div>
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute mt-2 w-full z-20 rounded-2xl bg-card border border-white/10 shadow-2xl"
          >
            <div className="p-3 text-xs uppercase tracking-[0.2em] text-white/60">Suggestions</div>
            <ul className="max-h-64 overflow-auto">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    updateItemLocal(item.id, { pos_x: 40, pos_y: 40 });
                    setQuery(item.title ?? '');
                    setResults([]);
                  }}
                >
                  <div>
                    <div className="text-sm font-semibold">{item.title ?? item.kind}</div>
                    <div className="text-xs text-white/60 line-clamp-1">{item.description ?? item.content_url}</div>
                  </div>
                  <span className="text-[10px] uppercase px-2 py-1 rounded-full bg-white/10 border border-white/10">
                    {item.kind}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

