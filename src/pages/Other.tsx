import ChatBox from "@/components/Chat";
//import ChatModel from "@/components/ChatModel";

export default function OtherPage() {
  return (
    <div className="relative w-full h-screen">
      {/* Container for responsive layout */}
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left column for ChatModel - hidden on mobile */}
       
        
        {/* Right column for ChatBox - full width on mobile, 3/5 on desktop */}
        <div className="w-full flex items-start pt-4 lg:pt-50">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
