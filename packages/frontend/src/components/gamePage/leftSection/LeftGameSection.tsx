import VideoFeed from './VideoFeed';
import MainDisplay from './MainDisplay';

export default function LeftGameSection() {
  return (
    <div className="flex flex-col w-2/3 p-4 space-y-4 bg-transparent">
      <div className="grid grid-cols-3 gap-4">
        <VideoFeed />
      </div>
      <MainDisplay />
    </div>
  );
}
