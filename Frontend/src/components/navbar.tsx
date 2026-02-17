import { useEffect, useState } from "react";

export default function Navbar() {
  const [orgId, setOrgId] = useState("ADMIN");

  useEffect(() => {
    const token = localStorage.getItem("prism_token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setOrgId(payload.org ? payload.org.toUpperCase() : "ADMIN");
      } catch (e) {
        console.error("Token decode failed", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("prism_token");
    window.location.href = "/";
  };

  return (
    // Pure container, no background colors here
    <div className="w-full px-6 py-4 flex items-center justify-between">
      
      {/* LEFT: BRANDING */}
      <div className="flex flex-col select-none cursor-pointer" onClick={() => window.location.hash = "#dashboard"}>
        <span className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-none drop-shadow-sm">
          Prism
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 uppercase mt-0.5 ml-0.5">
          BY SRMTECH
        </span>
      </div>

      {/* RIGHT: USER PROFILE */}
      <div className="flex items-center gap-6">
        
        <div className="relative group py-2">
            {/* Name */}
            <span className="cursor-pointer text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                {orgId}
            </span>

            {/* Logout Dropdown (Appears on Hover) */}
            <div className="absolute right-0 top-full pt-2 opacity-0 invisible transform -translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-50">
                <button 
                    onClick={handleLogout}
                    className="whitespace-nowrap rounded-lg bg-white/90 backdrop-blur-xl px-4 py-2 text-xs font-bold text-red-500 shadow-xl ring-1 ring-gray-100 hover:bg-red-50 hover:text-red-600 dark:bg-gray-800/90 dark:ring-gray-700 dark:hover:bg-gray-700 transition-colors"
                >
                    LOG OUT
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}