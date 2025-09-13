import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

interface UseAnimatedCounterProps {
  to: number;
  duration?: number;
}

const useAnimatedCounter = <T extends HTMLElement>({
  to,
  duration = 1,
}: UseAnimatedCounterProps) => {
  const nodeRef = useRef<T>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const controls = animate(0, to, {
      duration,
      onUpdate(value) {
        node.textContent = Math.round(value).toLocaleString();
      },
    });

    return () => controls.stop();
  }, [to, duration]);

  return nodeRef;
};

export default useAnimatedCounter;
