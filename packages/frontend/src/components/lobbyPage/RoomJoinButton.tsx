import useModal from '@/hooks/useModal';
import GameEntryModal from '@/components/lobbyPage/GameEntryModal';
import Button from '@/components/common/Button';
import useJoinRoom from '@/hooks/useJoinRoom';

export default function RoomJoinButton() {
  const { isOpen, openModal, closeModal } = useModal();
  const { handleJoinRoom } = useJoinRoom();

  return (
    <>
      <Button
        onClick={openModal}
        className="w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
        buttonText="게임 참가하기"
      />
      {isOpen && (
        <GameEntryModal
          title="게임 참가하기"
          subtitle="게임코드를 입력해주세요"
          textForm="게임 코드 입력"
          onClose={closeModal}
          onConfirm={handleJoinRoom}
        />
      )}
    </>
  );
}
