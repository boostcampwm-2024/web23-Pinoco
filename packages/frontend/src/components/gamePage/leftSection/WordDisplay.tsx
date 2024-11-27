import { motion } from 'framer-motion';
import { GamePhase, GAME_PHASE } from '@/constants';

interface IWordDisplayProps {
  gamePhase: GamePhase;
  currentWord: string;
  theme: string;
  isPinoco: boolean;
}

const springTransition = {
  duration: 0.6,
  type: 'spring',
  stiffness: 200,
  damping: 30,
} as const;

export default function WordDisplay({
  gamePhase,
  currentWord,
  theme,
  isPinoco,
}: IWordDisplayProps) {
  const isVisible = gamePhase === GAME_PHASE.SPEAKING || gamePhase === GAME_PHASE.WORD_REVEAL;

  if (!isVisible) return null;

  const displayText = isPinoco ? `테마: ${theme}` : `제시어: ${currentWord}`;

  return (
    <motion.div
      layoutId="word-container"
      transition={springTransition}
      className={`${
        gamePhase === GAME_PHASE.WORD_REVEAL
          ? 'fixed inset-0 flex items-center justify-center bg-black/50 z-50'
          : 'absolute left-4 top-4 p-2 bg-green-default/60 rounded-lg'
      }`}
    >
      <motion.div
        layoutId="word-content"
        transition={springTransition}
        className={`${
          gamePhase === GAME_PHASE.WORD_REVEAL ? 'bg-green-default/90 p-8 rounded-xl shadow-lg' : ''
        }`}
      >
        <motion.p
          layoutId="word-text"
          transition={springTransition}
          className={`text-white-default ${
            gamePhase === GAME_PHASE.WORD_REVEAL ? 'text-3xl font-bold' : 'text-lg'
          }`}
        >
          {displayText}
        </motion.p>
        {gamePhase === GAME_PHASE.WORD_REVEAL && isPinoco && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 text-xl font-semibold text-center text-red-500"
          >
            당신은 피노코입니다! 🤥
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
}
