interface MarqueeProps {
  speed?: number;
}

const Marquee = ({ speed = 30 }: MarqueeProps) => {
  const tools = [
    "After Effects", "Premiere Pro", "CapCut", "DaVinci Resolve", 
    "Slack", "Blender", "Sapphire", "Continuum BCC", "Magic Bullet", "Universe"
  ];

  return (
    <div className="w-full overflow-hidden bg-primary/5 border-y border-primary/10 py-4 backdrop-blur-sm">
      <div className="relative">
        <div 
          className="flex items-center gap-8 whitespace-nowrap"
          style={{
            animation: `marqueeScroll ${speed}s linear infinite`,
          }}
        >
          {/* Duplicate the tools array for seamless loop */}
          {[...tools, ...tools, ...tools].map((tool, index) => (
            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="font-semibold text-sm text-primary/90 tracking-wide">
                {tool}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;