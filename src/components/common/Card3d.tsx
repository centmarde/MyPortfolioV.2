import { CardBody, CardContainer, CardItem } from "../ui/3d-card";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  images?: string[];
  demoLink?: string;
  codeLink?: string;
  onClick?: () => void;
}

export function ThreeDCardDemo({ title, description, image, onClick }: ProjectCardProps) {
  return (
    <CardContainer className="inter-var h-auto w-full sm:w-[500px] sm:h-[490px] mx-auto z-50">
      <CardBody 
        className="bg-gray-20 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] 
                  dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto 
                  sm:w-[490px] sm:h-[500px] rounded-xl p-4 sm:p-6 border flex flex-col" 
        onClick={onClick}
      >
        {/* The entire card is now clickable */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {title}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300 line-clamp-2"
        >
          {description}
        </CardItem>
        <CardItem
          translateZ="100"
          rotateX={20}
          rotateZ={-10}
          className="w-full mt-4 flex-grow"
        >
          <img
            src={image}
            className="h-40 sm:h-52 w-full object-cover rounded-xl group-hover/card:shadow-xl"
            alt={title}
          />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
