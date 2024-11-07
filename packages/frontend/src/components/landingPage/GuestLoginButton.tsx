import Button from '@/components/common/Button';

function GuestLoginButton() {
  function handleClick() {}
  return (
    <Button
      className="w-4/5 text-xl font-semibold text-black bg-white hover:bg-gray-300"
      onClick={handleClick}
      buttonText="비회원으로 시작하기"
    />
  );
}
export default GuestLoginButton;
