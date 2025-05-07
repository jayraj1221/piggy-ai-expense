import { useState, useEffect } from 'react';

export default function Tag({ tag }) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Trigger animation on mount and periodically
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);
  
  const getTagDetails = (tag) => {
    switch(tag) {
      case 'Top Saver':
        return { 
          emoji: "🦸",
          color: "text-emerald-600",
          bgColor: "bg-emerald-100",
          borderColor: "border-emerald-500",
          animationClass: isAnimating ? "animate-bounce" : "",
          description: "Saving superhero"
        };
      case 'Average Saver':
        return { 
          emoji: "🚶",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          borderColor: "border-blue-500",
          animationClass: isAnimating ? "animate-pulse" : "",
          description: "Steady saver"
        };
      case 'Balanced':
        return { 
          emoji: "🧘",
          color: "text-purple-600",
          bgColor: "bg-purple-100",
          borderColor: "border-purple-500",
          animationClass: isAnimating ? "animate-pulse" : "",
          description: "Zen with money"
        };
      case 'Big Spender':
        return { 
          emoji: "🤑",
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          borderColor: "border-orange-500",
          animationClass: isAnimating ? "animate-ping" : "",
          description: "Money flows"
        };
      case 'Overspender':
        return { 
          emoji: "😱",
          color: "text-red-600",
          bgColor: "bg-red-100",
          borderColor: "border-red-500",
          animationClass: isAnimating ? "animate-spin" : "",
          description: "Spending alert"
        };
      default:
        return { 
          emoji: "🤔",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
          borderColor: "border-gray-500",
          animationClass: isAnimating ? "animate-pulse" : "",
          description: "Unknown status"
        };
    }
  };
  
  const tagDetails = getTagDetails(tag);
  
  return (
    <div 
      className={`flex items-center gap-3 px-4 py-2 rounded-full ${tagDetails.bgColor} border-2 ${tagDetails.borderColor} transition-all duration-300 hover:shadow-lg cursor-pointer`}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
    >
      <div className={`text-4xl ${tagDetails.animationClass}`}>
        {tagDetails.emoji}
      </div>
      <div className="flex flex-col">
        <span className={`text-sm font-bold ${tagDetails.color}`}>
          {tag}
        </span>
        <span className={`text-xs ${tagDetails.color} opacity-75`}>
          {tagDetails.description}
        </span>
      </div>
    </div>
  );
}

// Demo of all tags for preview
export function TagDemo() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Tag tag="Top Saver" />
      <Tag tag="Average Saver" />
      <Tag tag="Balanced" />
      <Tag tag="Big Spender" />
      <Tag tag="Overspender" />
    </div>
  );
}