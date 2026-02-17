import type { FC, PropsWithChildren } from "react";
import { useState } from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const NavbarSidebarLayout: FC<PropsWithChildren> = function ({ children }) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* --- 1. FIXED BACKGROUND (Dotted Grid & Atmosphere) --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Ambient Blobs */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/10 blur-[120px] dark:bg-indigo-900/20"></div>
          <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[800px] h-[800px] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-900/20"></div>
          
          {/* DOTTED GRID - Optimized for sharp transparency */}
          <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]" 
               style={{ 
                   backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`, 
                   backgroundSize: '32px 32px' 
               }}>
          </div>
      </div>

      {/* --- 2. LAYOUT CONTENT --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
          
          {/* STATIC GHOST NAVBAR */}
          <div className="w-full z-50 bg-transparent">
            <Navbar />
          </div>
          
          <div className="flex flex-1 relative">
            
            {/* SIDEBAR (Ghost Mode) */}
            <div className="fixed left-0 top-0 bottom-0 z-40 pt-20"> 
               <Sidebar onHoverChange={setIsSidebarHovered} />
            </div>
            
            {/* MAIN CONTENT (Smooth Push & Scale Effect) */}
            <main 
                className={`
                    flex-1 pl-20 relative w-full p-6
                    transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                    origin-left
                `}
                style={{
                    transform: isSidebarHovered ? "translateX(9rem) scale(0.99)" : "translateX(0) scale(1)",
                    opacity: isSidebarHovered ? 0.9 : 1
                }}
            >
              {children}
            </main>
          </div>
      </div>

    </div>
  );
};

export default NavbarSidebarLayout;