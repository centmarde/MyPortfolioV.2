import ChatBox from "@/components/Chat";
import ChatModel from "@/components/ChatModel";

export default function OtherPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Container for responsive layout */}
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left column for ChatModel - hidden on mobile */}
        <div className="hidden lg:block lg:w-2/5 h-full">
          <ChatModel />
        </div>
        
        {/* Right column for ChatBox - full width on mobile, 3/5 on desktop */}
        <div className="w-full lg:w-3/5 flex items-start pt-4 lg:pt-50 px-4 lg:px-0">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
