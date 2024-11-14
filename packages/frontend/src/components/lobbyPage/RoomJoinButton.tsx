import useModal from '@/hooks/useModal';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

export default function RoomJoinButton() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <Button
        onClick={openModal}
        className="w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
        buttonText="게임 참가하기"
      />
      {isOpen && (
        <Modal
          title="게임 참가하기"
          subtitle="게임코드 입력"
          textForm="코드 입력"
          onClose={closeModal}
          onConfirm={closeModal}
        />
      )}
    </>
  );
}
