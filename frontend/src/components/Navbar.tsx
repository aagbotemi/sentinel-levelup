"use client";

import React, { useEffect, useState } from "react";
import { navItems } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex justify-between items-center gap-2">
      <div className="flex text-3xl font-black">
        <div className="text-[#B18FEE]">Sen</div>
        <div className="text-white">tinel</div>
      </div>

      <div className="flex gap-x-6">
        {navItems.map((navItem) => {
          const active = pathname.split("/")[1] === navItem.href.split("/")[1];

          if (navItem.name === "Transactions") {
            return (
              <div key={navItem.name} className="relative">
                {(!active || !isMobile) && (
                  <button
                    type="button"
                    onClick={toggleDropdown}
                    className={`text-white font-bold text-md leading-[21px] ${
                      active ? "opacity-1" : "opacity-60"
                    }`}
                  >
                    {navItem.name}
                  </button>
                )}
                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-gray-800 z-50 rounded shadow-lg">
                    <Link href="/transactions/completed">
                      <div className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
                        Completed
                      </div>
                    </Link>
                    <Link href="/transactions/pending">
                      <div className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer">
                        Pending
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          return (
            (!active || !isMobile) && (
              <Link
                href={navItem.href}
                key={navItem.name}
                className={`text-white font-bold text-md leading-[21px] ${
                  active ? "opacity-1" : "opacity-60"
                }`}
              >
                {navItem.name}
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;
