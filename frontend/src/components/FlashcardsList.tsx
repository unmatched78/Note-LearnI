import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsListProps {
  cards: Flashcard[];
  cardsPerPage?: number;
  // Animation props
  tiltAngle?: number;
  tiltScale?: number;
  flipDuration?: number;
  springStiffness?: number;
  springDamping?: number;
}

export default function FlashcardsList({
  cards,
  cardsPerPage = 6,
  tiltAngle = 15,
  tiltScale = 1.03,
  flipDuration = 0.6,
  springStiffness = 300,
  springDamping = 20,
}: FlashcardsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  const [flipped, setFlipped] = useState<boolean[]>(cards.map(() => false));

  const toggleCard = (index: number) => {
    setFlipped(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const start = (currentPage - 1) * cardsPerPage;
  const pageCards = cards.slice(start, start + cardsPerPage);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageCards.map((card, idx) => {
          const index = start + idx;
          return (
            <div key={index} style={{ perspective: 1000 }}>
              <motion.div
                onClick={() => toggleCard(index)}
                initial={false}
                animate={{ rotateY: flipped[index] ? 180 : 0 }}
                whileHover={{
                  rotateY: flipped[index] ? 180 : tiltAngle,
                  scale: tiltScale,
                }}
                transition={{
                  rotateY: {
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                    duration: flipDuration,
                  },
                  scale: { type: "spring", stiffness: springStiffness, damping: springDamping },
                }}
                style={{ transformStyle: 'preserve-3d', cursor: 'pointer' }}
                className="relative w-full h-64 shadow-lg shadow-indigo-500/50 rounded-lg ring-1 ring-transparent hover:ring-indigo-400 hover:shadow-indigo-500/75 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {/* Front Face */}
                <Card className="absolute w-full h-full backface-hidden border-0 p-4 flex items-center justify-center rounded-lg bg-white">
                  <p className="text-lg font-semibold text-gray-900 text-center drop-shadow-md">
                    {card.front}
                  </p>
                </Card>

                {/* Back Face */}
                <Card
                  className="absolute w-full h-full backface-hidden border-0 p-4 rounded-lg bg-indigo-50"
                  style={{ transform: 'rotateY(180deg)' }}
                >
                  <div className="overflow-auto max-h-full">
                    <Badge variant="outline" className="mb-2 animate-pulse">
                      Answer
                    </Badge>
                    <p className="text-sm text-gray-800 break-words">
                      {card.back}
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-600 transition-all"
        >
          Previous
        </button>
        <span className="text-gray-700 font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-600 transition-all"
        >
          Next
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-2">
        Hover to tilt, click to flip—front is white, back is soft indigo.
      </p>
    </div>
  );
}
