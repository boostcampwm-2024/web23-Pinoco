import Button from '@/components/common/Button';
import useCreateRoom from '@/hooks/useCreateRoom';

export default function RoomCreationButton() {
  const { handleCreateRoom } = useCreateRoom();

  return (
    <Button
      className="relative w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleCreateRoom}
      buttonText="게임 생성하기"
    />
  );
}
