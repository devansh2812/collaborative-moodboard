import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchBoards, fetchBoard } from '../api';
import { useStore } from '../store';
import { SearchBar } from './SearchBar';

export function Header() {
  const { boards, activeBoardId, setBoards, setActiveBoard, setItems } = useStore();

  useEffect(() => {
    fetchBoards()
      .then((data) => setBoards(data.boards))
      .catch(console.error);
  }, [setBoards]);

  useEffect(() => {
    if (!activeBoardId) return;
    fetchBoard(activeBoardId)
      .then((data) => setItems(data.items))
      .catch(console.error);
  }, [activeBoardId, setItems]);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-[1px] bg-gradient-to-r from-accent via-accent2 to-emerald-400 shadow-glow">
        <div className="rounded-3xl bg-card/90 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Collaborative Moodboard
            </div>
            <div className="text-2xl font-semibold mt-1">Craft the vibe. Drag, search, remix.</div>
            <p className="text-white/70 text-sm mt-1">
              Postgres full-text + vector similarity power instant inspiration.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <select
              value={activeBoardId ?? ''}
              onChange={(e) => setActiveBoard(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none"
            >
              {boards.map((b) => (
                <option value={b.id} key={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
            <span className="text-xs text-white/60 hidden md:inline">Select a board</span>
          </motion.div>
        </div>
      </div>
      <SearchBar />
    </div>
  );
}

