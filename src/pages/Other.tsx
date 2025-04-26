import ChatBox from "@/components/Chat";
import ChatModel from "@/components/ChatModel";

export default function OtherPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Container for the two-column layout */}
      <div className="flex flex-row w-full">
        {/* Left column for ChatModel */}
        <div className="w-2/5 h-full">
          <ChatModel />
        </div>
        
        {/* Right column for ChatBox - removed h-full to prevent stretching */}
        <div className="w-3/5 flex items-start pt-50">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
