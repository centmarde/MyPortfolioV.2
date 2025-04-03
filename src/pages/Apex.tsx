import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";

export default function Apex() {
  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4 py-8 md:py-12">
      <h1 className="metal-mania-regular bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-4xl md:text-5xl lg:text-8xl font-sans py-4 md:py-10 relative z-20 font-bold tracking-tight leading-tight">
        THE APEX PREDATOR <br />
      </h1>
      <p className="max-w-xl mx-auto text-lg md:text-xl text-neutral-700 dark:text-neutral-400 text-center px-4 md:px-0 leading-relaxed">
        Driven by passion and precision, I transform complex challenges into elegant solutions. With expertise in modern development stacks and a relentless pursuit of excellence, I craft digital experiences that stand at the pinnacle of innovation.
      </p>
    </BackgroundLines>
  );
}
