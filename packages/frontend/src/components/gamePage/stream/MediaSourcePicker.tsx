import DropBox from '@/components/lobbyPage/DropBox';
import { useLocalStreamStore } from '@/store/localStreamStore';

function MediaSourcePicker() {
  return (
    <div className="flex flex-col gap-4 text-black left-0 w-full">
      <DropBox title={'카메라 설정'} type="video" />
      <DropBox title={'마이크 설정'} type="audio" />
    </div>
  );
}

export default MediaSourcePicker;
