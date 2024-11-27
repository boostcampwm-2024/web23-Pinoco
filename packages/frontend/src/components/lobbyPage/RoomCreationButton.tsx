import { useEffect, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import Button from '@/components/common/Button';
import useCreateRoom from '@/hooks/useCreateRoom';

export default function RoomCreationButton() {
  const { handleCreateRoom } = useCreateRoom();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('roomCreateTooltipShown');
    if (isFirstVisit) {
      setShowTooltip(true);
      localStorage.setItem('roomCreateTooltipShown', 'true');
    }
  }, []);

  return (
    <>
      <Button
        id="room-create-tooltip"
        className="relative w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
        onClick={handleCreateRoom}
        buttonText="게임 생성하기"
      />
      {showTooltip && (
        <Tooltip
          anchorSelect="#room-create-tooltip"
          place="bottom"
          content="새로운 게임방을 생성하세요"
          isOpen
          style={{
            backgroundColor: '#B4C25D',
            color: '#000000',
            borderRadius: '0.5rem',
          }}
        />
      )}
    </>
  );
}
