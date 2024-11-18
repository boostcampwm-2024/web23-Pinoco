import Timer from './Timer';

export default function MainDisplay() {
  return (
    <div className="flex flex-col flex-grow w-full p-4 mt-4 bg-transparent border-2 rounded-lg">
      <div className="flex-grow">
        <p className="text-lg text-white">메인 디스플레이 영역</p>
      </div>
      <div className="w-full mt-auto">
        <Timer
          initialTime={30}
          onTimeEnd={() => {
            console.log('timer end');
          }}
        />
      </div>
    </div>
  );
}
