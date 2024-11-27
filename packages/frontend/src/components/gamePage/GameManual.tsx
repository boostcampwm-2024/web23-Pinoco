import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import testImg1 from '@/assets/images/manual/1.png';
import testImg2 from '@/assets/images/manual/2.png';
import testImg3 from '@/assets/images/manual/3.png';
import howToPlay from '@/assets/images/manual/HowToPlayLogo.png';

interface IGameManualProps {
  onClose: () => void;
}

const images = [
  {
    src: testImg1,
    description: (
      <p className="text-center text-gray-700 text-lg">
        게임 시작 전, <span className="font-bold">모든 플레이어가 준비 상태를 완료</span>해야 게임이
        시작돼요. <br />
        방장은 준비가 완료된 플레이어를 확인하고 <span className="font-bold">"게임 시작"</span>{' '}
        버튼을 눌러주세요.
      </p>
    ),
  },
  {
    src: testImg2,
    description: (
      <p className="text-center text-gray-700 text-lg">
        게임이 시작되면 각 플레이어는 <span className="font-bold">제시어</span>를 확인하거나 자신의
        역할(피노코인지 제페토인지)을 알게 돼요. <br />
        피노코는 <span className="font-bold">제시어를 알지 못하니</span> 주의 깊게 대화를 듣고
        유추하세요.
      </p>
    ),
  },
  {
    src: testImg3,
    description: (
      <p className="text-center text-gray-700 text-lg">
        게임이 종료되면 <span className="font-bold">승패 결과</span>가 화면에 표시돼요. <br />
        피노코가 제시어를 맞추거나 자신의 정체를 숨긴다면{' '}
        <span className="font-bold">피노코가 승리</span>하고, 그렇지 않으면 제페토가 승리해요.
      </p>
    ),
  },
  {
    src: testImg1,
    description: (
      <p className="text-center text-gray-700 text-lg">
        피노코는 <span className="font-bold">정체를 숨기며</span> 제페토처럼 행동해야 해요. <br />
        대화 중 다른 플레이어들의 <span className="font-bold">반응을 유심히 관찰</span>하며 제시어를
        유추하는 것이 중요해요.
      </p>
    ),
  },
  {
    src: testImg2,
    description: (
      <p className="text-center text-gray-700 text-lg">
        모든 플레이어가 발언을 완료하면 <span className="font-bold">투표</span>가 시작돼요. <br />
        대화를 통해 <span className="font-bold">누가 피노코인지 추리</span>한 뒤 투표를 진행하세요.
      </p>
    ),
  },
  {
    src: testImg3,
    description: (
      <p className="text-center text-gray-700 text-lg">
        투표 결과에 따라 피노코가 지목돼요. <br />
        만약 피노코가 지목된다면, 피노코는 마지막으로{' '}
        <span className="font-bold">제시어를 추측</span>할 기회를 얻어요. <br />
        성공 여부에 따라 <span className="font-bold">승패가 결정</span>돼요.
      </p>
    ),
  },
  {
    src: testImg1,
    description: (
      <p className="text-center text-gray-700 text-lg">
        피노코는 <span className="font-bold">최종적으로 제시어</span>를 추측해요. <br />
        제시어를 정확히 맞추면 <span className="font-bold">피노코가 승리</span>하고, 그렇지 않으면
        제페토가 승리해요.
      </p>
    ),
  },
  {
    src: testImg2,
    description: (
      <p className="text-center text-gray-700 text-lg">
        결과 화면에서는 <span className="font-bold">게임의 최종 승패</span>와 함께 피노코와 제페토의
        역할이 공개돼요. <br />
        승패를 확인하고 <span className="font-bold">다음 게임을 준비</span>하세요!
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
