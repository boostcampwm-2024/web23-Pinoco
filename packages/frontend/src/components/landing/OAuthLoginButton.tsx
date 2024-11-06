import Button from '@/components/common/Button';
function OAuthLoginButton() {
  function handleClick() {}
  return (
    <>
      <Button
        className="bg-surface-brand-default text-white-default"
        onClick={handleClick}
        buttonText="소셜 로그인(구글 로그인)"
      />
    </>
  );
}
export default OAuthLoginButton;
