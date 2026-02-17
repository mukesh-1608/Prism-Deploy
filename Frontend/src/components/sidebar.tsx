import type { FC } from "react";
import { useEffect, useState } from "react";
import { DarkThemeToggle } from "flowbite-react";
import {
  HiChartPie,
  HiCloud,
  HiTerminal,
  HiViewBoards,
  HiCog,
  HiLightningBolt,
} from "react-icons/hi";

interface SidebarProps {
    onHoverChange?: (isHovered: boolean) => void;
}

const Sidebar: FC<SidebarProps> = function ({ onHoverChange }) {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash || "#dashboard";
        setCurrentPage(hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    // UPDATED WIDTH: hover:w-56 (Was w-64)
    <aside 
        onMouseEnter={() => onHoverChange && onHoverChange(true)}
        onMouseLeave={() => onHoverChange && onHoverChange(false)}
        className="h-full w-16 hover:w-56 group transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] bg-transparent hover:bg-white/5 dark:hover:bg-gray-900/20 backdrop-blur-none border-none shadow-none overflow-hidden flex flex-col justify-between pt-4"
    >
      
      {/* MENU ITEMS */}
      <div className="space-y-2 flex flex-col items-start w-full px-2">
        <SidebarItem href="#dashboard" icon={HiChartPie} label="Dashboard" active={currentPage === "#dashboard" || currentPage === ""} />
        <SidebarItem href="#deployments" icon={HiCloud} label="Deployments" active={currentPage === "#deployments"} />
        <SidebarItem href="#infrastructure" icon={HiLightningBolt} label="System Health" active={currentPage === "#infrastructure"} />
        <SidebarItem href="#logs" icon={HiTerminal} label="Server Logs" active={currentPage === "#logs"} />
        <SidebarItem href="#kanban" icon={HiViewBoards} label="Task Board" active={currentPage === "#kanban"} />
      </div>

      {/* BOTTOM SECTION */}
      <div className="py-4 w-full px-2 space-y-2">
        
        {/* Settings */}
        <SidebarItem href="#settings" icon={HiCog} label="Settings" active={currentPage === "#settings"} />
        
        {/* THEME TOGGLE */}
        <div className="relative flex items-center h-12 w-full px-3 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200 cursor-pointer">
            <div className="flex-shrink-0 w-6 flex justify-center pointer-events-auto">
                <DarkThemeToggle className="p-0 border-0 ring-0 focus:ring-0 bg-transparent hover:bg-transparent text-current shadow-none" />
            </div>
            
            <span className="ml-4 text-sm font-bold whitespace-nowrap tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 transform translate-x-[-10px] group-hover:translate-x-0">
                Switch Theme
            </span>
        </div>

      </div>
    </aside>
  );
};

function SidebarItem({ href, icon: Icon, label, active }: any) {
    return (
        <a 
            href={href}
            className={`
                relative flex items-center h-12 w-full px-3 rounded-xl
                transition-all duration-200
                ${active 
                    ? "text-indigo-600 bg-white/10 shadow-none dark:text-indigo-400 dark:bg-white/5" 
                    : "text-gray-500 hover:text-indigo-600 hover:bg-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/5"
                }
            `}
        >
            <div className="flex-shrink-0 w-6 flex justify-center">
                <Icon className={`w-6 h-6 ${active ? 'filter drop-shadow-sm' : ''}`} />
            </div>

            <span className={`
                ml-4 text-sm font-bold whitespace-nowrap tracking-wide
                opacity-0 group-hover:opacity-100 
                transition-all duration-300 delay-75
                transform translate-x-[-10px] group-hover:translate-x-0
            `}>
                {label}
            </span>
            
            {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-indigo-600 rounded-full"></div>
            )}
        </a>
    )
}

export default Sidebar;