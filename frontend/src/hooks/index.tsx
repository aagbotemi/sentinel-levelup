import { NftContext } from "@/contexts/NFTContext";
import { useCallback, useContext, useEffect, useState } from "react";

export const collapseHash = (value: string) => {
  if (value) {
    return value.slice(0, 6) + "..." + value.slice(-6);
  } else {
    return "";
  }
};

const useCommaFormatter = () => {
  const formatWithCommas = useCallback((value: string | number): string => {
    const stringValue = typeof value === "number" ? value?.toString() : value;

    const cleanedValue = stringValue?.replace(/[^\d.-]/g, "");

    return cleanedValue?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  return { formatWithCommas };
};

export default useCommaFormatter;

type Handler = (event: MouseEvent | TouchEvent) => void;

export const HandleOnClickOutside = (ref: any, handler: Handler) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('[data-testid="ellipsis-icon"]')
      ) {
        handler(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler, ref]);
};

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1,
    height: typeof window !== "undefined" ? window.innerHeight : 1,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export const useNftContext = () => {
  const context = useContext(NftContext);
  if (!context) {
    throw new Error("useNftContext must be used within an NftProvider");
  }
  return context;
};
