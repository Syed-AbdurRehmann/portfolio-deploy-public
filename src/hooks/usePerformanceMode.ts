import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

type NavigatorPerformanceLike = Navigator & {
  deviceMemory?: number;
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

export const usePerformanceMode = () => {
  const isMobile = useIsMobile();
  const [isLowPerformance, setIsLowPerformance] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorPerformanceLike;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    const updatePerformanceMode = () => {
      const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2;
      const lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2;
      const dataSaver = Boolean(connection?.saveData);
      const slowNetwork = /(^|-)2g|3g/.test(connection?.effectiveType || "");
      const reducedMotion = mediaQuery.matches;

      setIsLowPerformance(lowMemory || lowCpu || dataSaver || slowNetwork || reducedMotion);
    };

    updatePerformanceMode();

    mediaQuery.addEventListener("change", updatePerformanceMode);
    connection?.addEventListener?.("change", updatePerformanceMode);

    return () => {
      mediaQuery.removeEventListener("change", updatePerformanceMode);
      connection?.removeEventListener?.("change", updatePerformanceMode);
    };
  }, []);

  return {
    isMobile,
    isLowPerformance,
    shouldReduceEffects: isLowPerformance,
  };
};
