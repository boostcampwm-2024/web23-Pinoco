export default function ChatSection() {
  return (
    <div className="flex-grow p-4 bg-black rounded-lg opacity-80">
      <div className="text-lg font-bold">채팅</div>
      <div className="mt-2 space-y-2">
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 피노코 이신가요?
        </div>
      </div>
      <input className="w-full p-2 mt-4 bg-gray-600 rounded-lg" placeholder="Send a message..." />
    </div>
  );
}
