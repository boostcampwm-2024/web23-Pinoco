import Button from '@/components/common/Button';
import useCreateRoom from '@/hooks/useCreateRoom';

export default function RoomCreationButton() {
  const { createRoom } = useCreateRoom();

  return (
    <Button
      className="w-4/5 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={createRoom}
      buttonText="게임 생성하기"
    />
  );
}
