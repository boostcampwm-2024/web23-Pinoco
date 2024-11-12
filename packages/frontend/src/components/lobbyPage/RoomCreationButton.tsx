import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import generateUUID from '@/utils/generateUUID';

export default function RoomCreationButton() {
  const navigate = useNavigate();

  function handleClick() {
    const gameId = generateUUID();
    navigate(`/game/${gameId}`);
  }

  return (
    <Button
      className="w-4/5 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="게임 생성하기"
    />
  );
}
