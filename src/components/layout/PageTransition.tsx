"use client";

import dynamic from "next/dynamic";

interface Props {
  children: React.ReactNode;
}

// Lazy-load framer-motion so the library is excluded from the initial JS
// bundle. ssr: false is correct here — PageTransition is only meaningful
// after hydration anyway (it animates a page mount event).
//
// The loading fallback is null: during the brief chunk-download window the
// page content will appear without the fade-in animation, which is acceptable
// because the transition is enhancement-only and the duration is < 300ms.
const MotionWrapper = dynamic(
  () =>
    import("framer-motion").then((mod) => {
      const { motion } = mod;
      function MotionWrapperInner({ children }: Props) {
        return (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        );
      }
      return MotionWrapperInner;
    }),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function PageTransition({ children }: Props) {
  return <MotionWrapper>{children}</MotionWrapper>;
}
