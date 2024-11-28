import CameraSettingButton from '@/components/gamePage/rightSection/CameraSettingButton';
import MikeSettingButton from '@/components/gamePage/rightSection/MikeSettingButton';
import LeaveButton from '@/components/gamePage/rightSection/LeaveButton';

export default function SettingSection() {
  return (
    <div className="flex justify-around p-4 bg-black rounded-lg opacity-80">
      <MikeSettingButton />
      <CameraSettingButton />
      <LeaveButton />
    </div>
  );
}
