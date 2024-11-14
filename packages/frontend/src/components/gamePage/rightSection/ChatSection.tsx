export default function ChatSection() {
  return (
    <div className="flex flex-col flex-grow p-4 bg-black rounded-lg opacity-80 text-white-default">
      <div className="text-lg font-bold">채팅</div>
      <div className="h-56 mt-2 space-y-2 overflow-y-auto grow">
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 피노코 이신가요?
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 피노코 이신가요?
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 피노코 이신가요?
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 피노코 이신가요?
        </div>
        <div className="text-sm">
          <span className="font-semibold">J072</span>: 채팅 영역...
        </div>
      </div>
      <input
        className="w-full p-2 mt-4 bg-gray-600 rounded-lg outline-none"
        placeholder="Send a message..."
      />
    </div>
  );
}
