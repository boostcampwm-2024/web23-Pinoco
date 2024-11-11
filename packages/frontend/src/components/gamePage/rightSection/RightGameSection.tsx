import ChatSection from './ChatSection';
import SettingSection from './SettingSection';

export default function RightSection() {
  return (
    <div className="flex flex-col w-1/3 p-4 space-y-4 bg-transparent">
      <ChatSection />
      <SettingSection />
    </div>
  );
}
