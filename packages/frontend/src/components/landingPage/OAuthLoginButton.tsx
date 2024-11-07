import Button from '@/components/common/Button';
import GoogleLogo from '@/assets/images/GoogleLogo.svg?react';

function OAuthLoginButton() {
  function handleClick() {}
  return (
    <div className="relative flex items-center w-4/5 ">
      <GoogleLogo className="absolute size-6 ml-36" />
      <Button
        className="text-xl font-semibold text-black bg-white hover:bg-gray-300"
        onClick={handleClick}
        buttonText="구글 로그인"
      />
    </div>
  );
}
export default OAuthLoginButton;
