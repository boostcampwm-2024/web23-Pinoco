import { useEffect } from 'react';
import { useSocketStore } from '@/store/socketStore';
import BackgroundImage from '@/components/layout/BackgroundImage';
import MainLogo from '@/assets/images/MainLogo.svg?react';
import RoomCreationButton from '@/components/lobbyPage/RoomCreationButton';
import RoomJoinButton from '@/components/lobbyPage/RoomJoinButton';
import VideoAudioTestButton from '@/components/lobbyPage/VideoAudioTestButton';
import Header from '@/components/layout/Header';
import { useRoomStore } from '@/store/roomStore';
import { useChatStore } from '@/store/chatStore';
import { useLocalStreamStore } from '@/store/localStreamStore';
import { getVideoStream } from '@/utils/videoStreamUtils';

export default function LobbyPage() {
  const { gsid, setRoomData } = useRoomStore();
  const { socket } = useSocketStore();
  const { setChatHistory } = useChatStore();
  const localStream = useLocalStreamStore((state) => state.localStream);
  if (!localStream) getVideoStream();

  useEffect(() => {
    if (gsid) {
      socket?.emit('leave_room');
      setChatHistory([]);
      setRoomData(null, false, false, '');
    }
  }, []);

  return (
    <>
      <BackgroundImage gradientClass="bg-gradient-to-t from-black/90" />
      <Header />
      <div className="relative flex flex-col items-center justify-center w-full h-screen mx-auto text-white-default">
        <MainLogo className="-mt-52" />
        <div className="flex items-center justify-center w-3/5 my-4">
          <span className="flex-grow border-t border-white"></span>
          <span className="mx-2 bg-white rounded-full size-2"></span>
          <span className="mx-2 border-2 border-white rounded-full size-4"></span>
          <span className="mx-2 bg-white rounded-full size-2"></span>
          <span className="flex-grow border-t border-white"></span>
        </div>

        <p className="mt-2 mb-10 text-2xl text-center">실시간 화상 통화로 진행하는 라이어 게임</p>
        <div className="flex items-center w-3/5 gap-2 *:p-5">
          <VideoAudioTestButton />
          <RoomCreationButton />
          <RoomJoinButton />
        </div>
      </div>
    </>
  );
}
