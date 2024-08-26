"use client";
import React, { useState } from "react";
import LogoLink from "./LogoLink";
import NavLinks from "./NavLink";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button for mobile, using LogoLink */}
      <button
        onClick={toggleNavbar}
        className="md:hidden fixed top-4 left-4 z-50 focus:outline-none"
      >
        <LogoLink />
      </button>

      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-gradient-to-b from-[#0081A7] to-[#00AFB9] p-6 flex flex-col items-center z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Logo at the top, always visible on larger screens */}
        <div className="w-full justify-center hidden md:flex">
          <LogoLink />
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col flex-grow w-full justify-center space-y-6 mt-4">
          <NavLinks />
        </nav>
      </div>
    </>
  );
};

export default Navbar;
