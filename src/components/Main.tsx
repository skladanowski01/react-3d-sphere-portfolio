import { useState } from 'react';
import SphereCanvas from './SphereCanvas';
import Modal from './Modal';
import { type WordItem } from '../data/words';

export default function Main() {
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [visitedIds, setVisitedIds] = useState<number[]>([]);
  const [isModalHovered, setIsModalHovered] = useState(false);

  const handleSelectWord = (item: WordItem) => {
    setSelectedWord(item);
    setVisitedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
  };

  const handleCloseModal = () => {
    setSelectedWord(null);
    setIsModalHovered(false);
  };

  return (
    <main className="relative flex items-center justify-center flex-1 w-full overflow-hidden">
      {/* Kula zatrzymuje się, gdy modal jest otwarty lub kursor znajduje się na modalu */}
      <SphereCanvas
        onSelectWord={handleSelectWord}
        isPaused={selectedWord !== null || isModalHovered}
        visitedIds={visitedIds}
      />

      <Modal
        key={selectedWord?.id ?? 'none'}
        item={selectedWord}
        onClose={handleCloseModal}
        onModalMouseEnter={() => setIsModalHovered(true)}
        onModalMouseLeave={() => setIsModalHovered(false)}
      />
    </main>
  );
}