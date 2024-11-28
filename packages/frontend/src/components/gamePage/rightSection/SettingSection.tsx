import CameraSettingButton from '@/components/gamePage/stream/CameraSettingButton';
import MikeSettingButton from '@/components/gamePage/stream/MikeSettingButton';
import LeaveButton from '@/components/gamePage/rightSection/LeaveButton';

export default function SettingSection() {
  return (
    <div className="flex justify-around p-4 bg-black rounded-lg opacity-80">
      <MikeSettingButton iconColor="text-white-default" />
      <CameraSettingButton iconColor="text-white-default" />
      <LeaveButton />
    </div>
  );
}
