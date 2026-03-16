"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => {
    const Component = mod.motion.div;
    return { default: Component };
  }),
  { ssr: false }
);

interface Props {
  children: React.ReactNode;
}

export default function PageTransition({ children }: Props) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </MotionDiv>
  );
}
