import Button from '@/components/common/Button';
function GuestLoginButton() {
  function handleClick() {}
  return (
    <Button
      className="bg-surface-default text-default ring-1 ring-grayscale-400"
      onClick={handleClick}
      buttonText="비회원으로 시작하기"
    />
  );
}
export default GuestLoginButton;
