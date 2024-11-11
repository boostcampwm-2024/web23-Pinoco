import BackgroundImage from '@/components/layout/BackgroundImage';
import MainLogo from '@/assets/images/MainLogo.svg?react';
import RoomCreationButton from '@/components/lobbyPage/RoomCreationButton';
import RoomJoinButton from '@/components/lobbyPage/RoomJoinButton';
import VideoAudioTestButton from '@/components/lobbyPage/VideoAudioTestButton';
import LobbyHeader from '@/components/lobbyPage/LobbyHeader';
import Modal from '@/components/common/Modal';
import useModal from '@/hooks/useModal';

export default function LobbyPage() {
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();

  return (
    <>
      <LobbyHeader />
      <BackgroundImage gradientClass="bg-gradient-to-t from-black/90" />
      <div className="text-white-default relative mx-auto flex h-screen w-4/5 flex-col items-center justify-center">
        <MainLogo className="-mt-52" />
        <div className="my-4 flex w-full items-center justify-center">
          <span className="flex-grow border-t border-white"></span>
          <span className="mx-2 size-2 rounded-full bg-white"></span>
          <span className="mx-2 size-4 rounded-full border-2 border-white"></span>
          <span className="mx-2 size-2 rounded-full bg-white"></span>
          <span className="flex-grow border-t border-white"></span>
        </div>

        <p className="mb-24 mt-2 text-center text-2xl">실시간 화상 통화로 진행하는 라이어 게임</p>
        <div className="flex w-full items-center gap-2">
          <VideoAudioTestButton onClick={openModal} />
          <RoomCreationButton />
          <RoomJoinButton onClick={openModal} />
        </div>
      </div>
      {isModalOpen && (
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
