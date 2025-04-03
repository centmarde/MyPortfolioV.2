import { BackgroundLines } from "@/components/ui/background-lines";

export default function Apex() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-8 md:py-12">
      <h1 className="metal-mania-regular bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl md:text-5xl lg:text-8xl font-sans py-4 md:py-10 relative z-20 font-bold tracking-tight leading-tight">
        THE STRONGEST ALGORITHM<br />
      </h1>
      <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center px-4 md:px-0 leading-relaxed">
      Calculated and efficient, I dominate challenges with precision and control. Armed with expertise in modern development stacks, I create solutions that are sharp, decisive, and built to lead.
      </p>
    </BackgroundLines>
  );
}
