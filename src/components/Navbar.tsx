"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const [menubarActive, setMenubarActive] = useState<Boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const onActive = () => {
    setMenubarActive(!menubarActive);
  };
  const routes = [
    {
      route: "#features",
      name: "Features",
    },
    {
      route: "#pricing",
      name: "Pricing",
    },
    {
      route: "#faq",
      name: "FAQ",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setMenubarActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`w-full fixed z-10  px-16 max-sm:px-10 flex justify-between gap-4 items-center bg-brand`}
    >
      {/* logo */}
      <div>
        <Image src={"/screen.png"} alt="TradeMind" width={200} height={200} />
      </div>
      {/* menu */}
      <div className="hidden md:block">
        <ul className="flex gap-4 justify-center items-center text-base">
          {/* route */}
          {routes.map((item, index) => (
            <li
              key={index + 1}
              className="text-text-primary hover:border-b-2 hover:border-brand-second"
            >
              <a href={`${item.route}`}>{item.name}</a>
            </li>
          ))}
        </ul>
      </div>
      {/* login button */}
      <div className="hidden md:flex gap-6 justify-center items-center">
        <Link
          href={"/login"}
          className="text-base text-text-primary hover:border-b-2 hover:border-brand-second"
        >
          Login
        </Link>
        <Link
          href={"/register"}
          className="bg-black text-base font-medium text-white py-2 px-4 rounded-full"
        >
          Start Journaling
        </Link>
      </div>
      {/* mobile menubar */}
      <div ref={containerRef} className="md:hidden">
        <Menu onClick={onActive} className="cursor-pointer" />
        <div
          className={`absolute z-10 bg-brand/50 shadow-lg shadow-brand-second rounded-b-xl backdrop-blur-sm ${menubarActive ? "top-0" : "-top-52"}  right-0 left-0 transition-all duration-500`}
        >
          <ul className="flex p-4 flex-col  gap-4 justify-center items-center text-base">
            {/* route */}
            {routes.map((item, index) => (
              <li
                key={index + 1}
                onClick={() => setMenubarActive(false)}
                className="text-text-primary w-full text-center  p-2 rounded-md hover:bg-brand-second transition-all duration-150"
              >
                <a href={`${item.route}`}>{item.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
