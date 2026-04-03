import { type ReactNode, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";

interface Interactive3DCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  onClick?: () => void;
}

interface SharedCardProps {
  children: ReactNode;
  className: string;
  onClick?: () => void;
}

interface FullCardProps extends SharedCardProps {
  glowColor: string;
}

const LiteInteractiveCard = ({ children, className, onClick }: SharedCardProps) => {
  return (
    <motion.div
      className={`interactive-card relative ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-950/90"
        style={{ boxShadow: "0 7px 20px -8px rgba(0, 0, 0, 0.55)" }}
      >
        {children}
      </div>
    </motion.div>
  );
};

const FullInteractiveCard = ({ children, className, glowColor, onClick }: FullCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXTransform = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateYTransform = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const rotateXSpring = useSpring(rotateXTransform, springConfig);
  const rotateYSpring = useSpring(rotateYTransform, springConfig);

  const glareXTransform = useTransform(mouseX, [-0.5, 0.5], [0, 100]);
  const glareYTransform = useTransform(mouseY, [-0.5, 0.5], [0, 100]);
  const glareX = useSpring(glareXTransform, springConfig);
  const glareY = useSpring(glareYTransform, springConfig);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) {
      return;
    }

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`interactive-card relative ${className}`}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          className="absolute -inset-2 rounded-2xl blur-xl"
          style={{ background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)` }}
          animate={{ opacity: isHovered ? 0.8 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-neutral-900/95 to-neutral-950/90"
          style={{
            transformStyle: "preserve-3d",
            boxShadow: isHovered
              ? `0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 40px ${glowColor}`
              : "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
            filter: isHovered ? "grayscale(0%)" : "grayscale(85%)",
            transition: "filter 0.35s ease, box-shadow 0.25s ease",
          }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: glareBackground,
              opacity: isHovered ? 1 : 0,
            }}
          />

          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const Interactive3DCard = ({ children, className = "", glowColor = "rgba(66, 164, 245, 0.4)", onClick }: Interactive3DCardProps) => {
  const { shouldReduceEffects } = usePerformanceMode();

  if (shouldReduceEffects) {
    return <LiteInteractiveCard className={className} onClick={onClick}>{children}</LiteInteractiveCard>;
  }

  return (
    <FullInteractiveCard className={className} glowColor={glowColor} onClick={onClick}>
      {children}
    </FullInteractiveCard>
  );
};

export default Interactive3DCard;
