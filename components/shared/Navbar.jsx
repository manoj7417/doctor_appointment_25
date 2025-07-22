"use client";

import {
  BriefcaseMedicalIcon,
  DumbbellIcon,
  HomeIcon,
  MenuIcon,
  UserIcon,
  XIcon,
  LogOutIcon,
  Users,
  FlaskConicalIcon,
  FileTextIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useUserStore } from "@/store/userStore";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { user, clearUser } = useUserStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // ⬇️ Temporary paid flag for testing
  const isPaid = true;

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleLogout = () => {
    clearUser();
    router.push("/login");
  };

  const handleProtectedRoute = (href) => {
    if (!isPaid) {
      router.push("/pricing");
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3 px-5">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="p-1 bg-blue-500/10 rounded">
            <BriefcaseMedicalIcon className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-xl font-bold font-sans">
            Doctor<span className="text-blue-500">App</span>
          </span>
        </Link>

        {/* Hamburger Menu (mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-primary"
        >
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>

        {/* NAVIGATION (desktop) */}
        <nav className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <NavItem href="/" icon={<HomeIcon size={16} />} label="Home" />
              <button
                onClick={() => handleProtectedRoute("/find-doctor")}
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                <Users size={16} />
                <span>More Doctors</span>
              </button>
              <button
                onClick={() => handleProtectedRoute("/medicine")}
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                <UserIcon size={16} />
                <span>Medicine</span>
              </button>
              <button
                onClick={() => handleProtectedRoute("/labs")}
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                <FlaskConicalIcon size={16} />
                <span>Labs</span>
              </button>
              <button
                onClick={() => handleProtectedRoute("/prescription")}
                className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
              >
                <FileTextIcon size={16} />
                <span>Prescription</span>
              </button>

              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="ghost"
                  onClick={toggleDropdown}
                  className="text-sm font-medium cursor-pointer"
                >
                  {user.name}
                </Button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOutIcon size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10 cursor-pointer"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* NAVIGATION (mobile) */}
      {menuOpen && (
        <div className="md:hidden px-5 pb-4 mt-2 border-t border-border bg-background animate-fade-in-down">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <MobileNavItem href="/" label="Home" />
                <MobileButtonItem
                  label="Find Doctors"
                  onClick={() => handleProtectedRoute("/find-doctor")}
                />
                <MobileButtonItem
                  label="Medicine"
                  onClick={() => handleProtectedRoute("/medicine")}
                />
                <MobileButtonItem
                  label="Labs"
                  onClick={() => handleProtectedRoute("/labs")}
                />
                <MobileButtonItem
                  label="Prescription"
                  onClick={() => handleProtectedRoute("/prescription")}
                />
                <div className="text-sm font-semibold">{user.name}</div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10 flex items-center justify-center gap-2"
                >
                  <LogOutIcon size={16} /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

const NavItem = ({ href, icon, label }) => (
  <Link
    href={href}
    className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors cursor-pointer"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ href, label }) => (
  <Link
    href={href}
    className="text-sm text-gray-700 hover:text-primary transition-colors cursor-pointer"
  >
    {label}
  </Link>
);

const MobileButtonItem = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="text-sm text-left text-gray-700 hover:text-primary transition-colors"
  >
    {label}
  </button>
);

export default Navbar;
