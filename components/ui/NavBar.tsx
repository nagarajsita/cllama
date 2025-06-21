'use client';
import { Playfair_Display } from "next/font/google";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { getSession, signIn, signOut } from "next-auth/react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
});

const NavBar = () => {
  const [image, setImage] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session) {
        setIsLoggedIn(true);
        setImage(session.user?.image || "/default-user-image.png");
      } else {
        setIsLoggedIn(false);
        setImage(null);
      }
    };
    fetchSession();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center relative px-4 py-2">
      <span
        className={`${playfair.className} text-3xl text-white`}
        style={{ fontStyle: "italic" }}
      >
        <span className="text-green-500">A</span>chat
      </span>

      {isLoggedIn ? (
        <div className="relative" ref={dropdownRef}>
          <Image
            src={image || "/default-user-image.png"}
            alt="user"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
            onClick={() => setShowDropdown((prev) => !prev)}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-28 bg-white rounded shadow-lg z-10">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => signIn(undefined, { callbackUrl: "/" })}
          className="px-4 py-1 text-sm rounded bg-white text-gray-900 hover:bg-gray-200"
        >
          Sign In
        </button>
      )}
    </div>
  );
};

export default NavBar;
