import Button from '@/components/common/Button';

export default function RoomJoinButton() {
  function handleClick() {}
  return (
    <Button
      className="w-4/5 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="게임 참가하기"
    />
  );
}

