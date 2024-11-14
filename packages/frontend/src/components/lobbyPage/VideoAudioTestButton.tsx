import Button from '@/components/common/Button';

export default function VideoAudioTestButton() {
  function handleClick() {}
  return (
    <Button
      className="w-full h-20 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="비디오 및 오디오 테스트"
    />
  );
}
