import Button from '@/components/common/Button';
import VideoAudioTestModal from '@/components/lobbyPage/VideoAudioTestModal';
import { useState } from 'react';

export default function VideoAudioTestButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const title = '비디오 및 오디오 테스트';
  function handleClick() {
    setIsModalOpen(true);
  }
  return (
    <>
      <Button
        className="w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
        onClick={handleClick}
        buttonText={title}
      />
      {isModalOpen && <VideoAudioTestModal title={title} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
