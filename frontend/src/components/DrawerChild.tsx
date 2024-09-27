"use client";

import { useScreenSize } from "@/hooks";
import { FC } from "react";

const DrawerChild: FC<Readonly<IDrawerChild>> = ({ children, show }) => {
  const screenWidth: any = useScreenSize();

  return (
    <div>
      {screenWidth.width < 758 ? (
        <div
          className={`fixed sm:hidden top-0 bottom-0 right-0 z-50 ease-in-out h-[85vh] duration-300  ${
            show ? "translate-y-0" : "translate-y-[120%]"
          }`}
          data-testid="mobile-drawer"
          id="1"
        >
          {children}
        </div>
      ) : (
        <div
          data-testid="desktop-drawer"
          className={`fixed hidden md:block top-0 bottom-0 right-0 z-50 ease-in-out h-[100vh] duration-300 ${
            show ? "translate-x-0" : "translate-x-full"
          }`}
          id="2"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DrawerChild;
