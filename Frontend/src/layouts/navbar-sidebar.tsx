import { Sidebar } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import Navbar from "../components/navbar";
import ExampleSidebar from "../components/sidebar";

interface NavbarSidebarLayoutProps {
  isFooter?: boolean;
}

const NavbarSidebarLayout: FC<PropsWithChildren<NavbarSidebarLayoutProps>> =
  function ({ children }) {
    return (
      <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-900 font-sans selection:bg-indigo-500/30">
        
        {/* --- 1. AMBIENT BACKGROUND BLOBS (The Atmosphere) --- */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-500/20 blur-[120px] dark:bg-purple-900/40"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] rounded-full bg-indigo-500/20 blur-[120px] dark:bg-indigo-900/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-[100px] dark:bg-pink-900/20"></div>
        </div>

        {/* --- 2. TECH GRID OVERLAY (The Structure) --- */}
        {/* This creates the professional "Graph Paper" look */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]" 
             style={{ 
                 backgroundImage: `radial-gradient(#6366f1 1px, transparent 1px)`, 
                 backgroundSize: '24px 24px' 
             }}>
        </div>

        {/* --- 3. MAIN CONTENT WRAPPER --- */}
        <div className="relative z-10">
            <Navbar />
            
            <div className="flex items-start pt-16">
              <ExampleSidebar />
              
              {/* Main content area - Transparent to let background show through */}
              <main className="relative h-full w-full overflow-y-auto lg:ml-64 bg-transparent p-2">
                {children}
              </main>
            </div>
        </div>

      </div>
    );
  };

export default NavbarSidebarLayout;