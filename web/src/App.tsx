import { useMemo } from 'react';
import { useStore } from './store';
import { Header } from './components/Header';
import { BoardCanvas } from './components/BoardCanvas';
import { QuickAddBar } from './components/QuickAddBar';

export default function App() {
  const { boards, activeBoardId } = useStore();
  const activeBoard = useMemo(() => boards.find((b) => b.id === activeBoardId), [boards, activeBoardId]);

  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <Header />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">Currently viewing</div>
            <div className="text-xl font-semibold">{activeBoard?.title ?? 'Select a board'}</div>
            <p className="text-white/60 text-sm max-w-xl">{activeBoard?.description}</p>
          </div>
          <QuickAddBar />
        </div>
        <div className="h-[640px]">
          <BoardCanvas />
        </div>
      </div>
    </div>
  );
}

