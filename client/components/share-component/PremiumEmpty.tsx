import { HiSparkles } from "react-icons/hi";

export default function PremiumEmpty({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-transparent hover:border-global-primary transition-all duration-300 max-w-md mx-auto">
      <HiSparkles className="text-4xl text-global-primary mb-4 animate-pulse" />
      <p className="text-center text-gray-700">{description}</p>
    </div>
  );
}
