import Background from '@/assets/images/BackgroundImage.svg';

interface IBackgroundImageProps {
  className?: string;
}

export default function BackgroundImage({
  className,
  ...props
}: IBackgroundImageProps & React.HTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={Background}
      className={`object-cover absolute w-full h-full ${className}`}
      {...props}
      alt="Background"
    />
  );
}
