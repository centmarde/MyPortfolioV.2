
import ChatBox from "@/components/Chat";
import ChatModel from "@/components/ChatModel";

export default function OtherPage() {
  return (
    <div className="container mx-auto py-12">
      
      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* 3D Model Canvas */}
        <div className="w-full lg:w-2/5 h-[500px] overflow-hidden">
          <ChatModel />
        </div>
        
        {/* ChatBox */}
        <div className="w-full lg:w-3/5">
          <ChatBox />
        </div>
      </div>
      
     
    </div>
  );
}
