import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const manualImg1 = '/images/gameManual/manu1.png';
const manualImg2 = '/images/gameManual/manu2.png';
const manualImg3 = '/images/gameManual/manu3.png';
const manualImg4 = '/images/gameManual/manu4.png';
const manualImg5 = '/images/gameManual/manu5.png';
const manualImg6 = '/images/gameManual/manu6.png';

const howToPlay = '/images/gameManual/HowToPlayLogo.png';

interface IGameManualProps {
  onClose: () => void;
}

const images = [
  {
    src: manualImg1,
    description: (
      <p className="text-center text-gray-700 text-lg">
        <span className="font-bold">모든 플레이어가 준비 상태</span>를 완료하면 게임이 시작됩니다.{' '}
        <br />
        방장은 준비된 플레이어를 확인하고 <span className="font-bold">"게임 시작"</span> 버튼을
        눌러주세요.
      </p>
    ),
  },
  {
    src: manualImg2,
    description: (
      <p className="text-center text-gray-700 text-lg">
        게임이 시작되면 <span className="font-bold">각 플레이어의 역할</span>과{' '}
        <span className="font-bold">제시어</span>가 공개됩니다. <br />
        <span className="font-bold">피노코</span>에게는 제시어 대신 제시어의 테마가 공개됩니다.
      </p>
    ),
  },
  {
    src: manualImg3,
    description: (
      <p className="text-center text-gray-700 text-lg">
        <span className="font-bold">발언 시간</span> 동안 플레이어들은 돌아가며 제시어에 대해
        설명해야합니다.
        <br />
        피노코는 <span className="font-bold">정체를 숨기며</span> 제페토처럼 행동해야 해요. <br />
        다른 플레이어들의 <span className="font-bold">반응</span>을 관찰하며 제시어를 유추하세요.
      </p>
    ),
  },
  {
    src: manualImg4,
    description: (
      <p className="text-center text-gray-700 text-lg">
        모든 플레이어가 발언을 마치면 <span className="font-bold">투표</span>가 시작됩니다. <br />
        대화 내용을 바탕으로 <span className="font-bold">누가 피노코인지 추리</span>하여 투표를
        진행하세요.
      </p>
    ),
  },
  {
    src: manualImg5,
    description: (
      <p className="text-center text-gray-700 text-lg">
        투표 결과로 <span className="font-bold">피노코가 지목</span>되었다면, 피노코는{' '}
        <span className="font-bold">제시어를 추측</span>할 마지막 기회를 얻습니다. <br />
        제시어를 정확히 맞추면 <span className="font-bold">피노코가 승리</span>합니다.
      </p>
    ),
  },
  {
    src: manualImg6,
    description: (
      <p className="text-center text-gray-700 text-lg">
        <span className="font-bold">게임 결과</span>가 공개됩니다. <br />
        피노코가 제시어를 맞추거나, 투표로 2명이 남을 때까지 정체를 숨기면{' '}
        <span className="font-bold">피노코가 승리</span>, <br />
        그렇지 않으면 <span className="font-bold">제페토가 승리</span>합니다. <br />
        결과 화면에서 각 플레이어의 역할과 최종 승패를 확인하세요.
      </p>
    ),
  },
];

export default function GameManual({ onClose }: IGameManualProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isFirstVisit = !localStorage.getItem('gamePageVisited');
    if (isFirstVisit) {
      setShowModal(true);
      localStorage.setItem('gamePageVisited', 'true');
    }
  }, []);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  if (!showModal) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-w-[850px] w-full h-[650px] p-4 bg-white rounded-2xl shadow-lg flex flex-col">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-xl text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <div className="w-[25%] mb-1 mx-auto">
          <img
            src={howToPlay}
            alt="How to play"
            className="w-full h-[120px] object-contain rounded-lg"
          />
        </div>

        <div className="relative flex-grow flex flex-col items-center justify-between overflow-hidden">
          <div className="relative w-[90%] max-w-[600px] h-[300px] mx-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute w-full h-full transition-opacity duration-500 ease-in-out flex justify-center items-center ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={image.src}
                  alt={`Game Instruction ${index + 1}`}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-700 text-lg font-medium leading-relaxed">
              {images[currentIndex].description}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? 'bg-black' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
        <div className="mt-6 flex justify-between px-6">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-8 py-3 text-lg font-semibold text-white-default bg-gray-600 rounded-lg"
            >
              이전
            </button>
          )}
          {currentIndex < images.length - 1 ? (
            <button
              onClick={handleNext}
              className="ml-auto px-8 py-3 text-lg font-semibold text-white-default bg-gray-600 rounded-lg"
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="ml-auto px-8 py-3 text-lg font-semibold text-white-default bg-green-default rounded-lg"
            >
              완료
            </button>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('portal-root') as HTMLElement,
  );
}
