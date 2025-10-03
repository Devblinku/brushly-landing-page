"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";
import { BorderBeam } from "./border-beam";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.95] : [1.05, 1];
  };

  // Create separate rotation transforms for mobile and desktop
  const rotateDesktop = useTransform(scrollYProgress, [0, 0.3], [35, 0]);
  // For mobile, use EXACTLY the same values as desktop
  const rotateMobile = useTransform(scrollYProgress, [0, 0.3], [35, 0]);
  
  
  const rotate = isMobile ? rotateMobile : rotateDesktop;
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);


  return (
    <div
      className="h-[35rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="py-4 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: any) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        translateY: translate,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-8xl mt-4 md:-mt-12 mx-auto h-[12rem] md:h-[45rem] w-full max-w-[90vw] md:max-w-none border-4 border-slate-700 p-2 md:p-6 bg-slate-800 rounded-[30px] shadow-2xl relative"
    >
      {/* 4 BorderBeams positioned on all 4 sides */}
      <div className="absolute -inset-1 rounded-[32px]">
        {/* Top beam - with gaps at corners */}
        <div className="absolute top-0 left-8 right-8 h-1">
          <BorderBeam 
            colorFrom="#06b6d4" 
            colorTo="#14b8a6" 
            size={80}
            duration={12}
            borderThickness={7}
            glowIntensity={45}
            beamBorderRadius={32}
          />
        </div>
        
        {/* Right beam - with gaps at corners */}
        <div className="absolute top-8 bottom-8 right-0 w-1">
          <BorderBeam 
            colorFrom="#06b6d4" 
            colorTo="#14b8a6" 
            size={80}
            duration={12}
            borderThickness={20}
            glowIntensity={20}
            beamBorderRadius={32}
          />
        </div>
        
        {/* Bottom beam - with gaps at corners */}
        <div className="absolute bottom-0 left-8 right-8 h-1">
          <BorderBeam 
            colorFrom="#06b6d4" 
            colorTo="#14b8a6" 
            size={80}
            duration={12}
            borderThickness={20}
            glowIntensity={20}
            beamBorderRadius={32}
          />
        </div>
        
        {/* Left beam - with gaps at corners */}
        <div className="absolute top-8 bottom-8 left-0 w-1">
          <BorderBeam 
            colorFrom="#06b6d4" 
            colorTo="#14b8a6" 
            size={80}
            duration={12}
            borderThickness={20}
            glowIntensity={20}
            beamBorderRadius={32}
          />
        </div>
      </div>
      <div className="h-full w-full overflow-hidden rounded-2xl bg-transparent md:rounded-2xl md:p-4 relative z-10">
        {children}
      </div>
    </motion.div>
  );
}; 