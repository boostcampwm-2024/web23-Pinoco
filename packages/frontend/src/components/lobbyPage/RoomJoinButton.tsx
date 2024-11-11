import Button from '@/components/common/Button';

interface IRoomJoinButtonProps {
  onClick: () => void;
}

export default function RoomJoinButton({ onClick }: IRoomJoinButtonProps) {
  return (
    <Button
      className="w-4/5 bg-white text-xl font-semibold text-black hover:bg-gray-300"
      onClick={onClick}
      buttonText="게임 참가하기"
    />
  );
}
