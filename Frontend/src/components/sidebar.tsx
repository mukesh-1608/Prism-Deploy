import { DarkThemeToggle } from "flowbite-react";
import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  HiChartPie,
  HiCloud,
  HiTerminal,
  HiCog,
  HiServer,
  HiViewBoards,
} from "react-icons/hi";

const ExampleSidebar: FC = function () {
  const [isHovered, setIsHovered] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const handleNav = (hash: string) => { 
      window.location.hash = hash; 
      setActiveHash(hash);
  };

  useEffect(() => {
      setActiveHash(window.location.hash.replace("#", ""));
  }, []);

  // Standard item style
  const getItemClass = (hash: string) => `
      flex items-center p-3 rounded-xl transition-all duration-200 cursor-pointer group
      ${activeHash === hash 
          ? 'bg-indigo-50/80 text-indigo-700 shadow-sm dark:bg-indigo-900/30 dark:text-indigo-300' 
          : 'hover:bg-white/40 text-gray-500 hover:text-gray-900 dark:hover:bg-gray-800/30 dark:hover:text-white dark:text-gray-400'}
  `;

  // Icon style
  const getIconClass = (hash: string) => `
      w-6 h-6 transition duration-75 
      ${activeHash === hash ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-white'}
  `;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-0 z-40 h-screen pt-20 transition-all duration-300 ease-in-out ${
        isHovered ? "w-64" : "w-20"
      }`}
      aria-label="Sidebar"
    >
      {/* NATIVE DIV instead of Flowbite Sidebar to force transparency */}
      <div className="h-full px-3 py-4 overflow-y-auto bg-transparent">
        <ul className="space-y-2 font-medium">
            
            {/* 1. Dashboard */}
            <li>
                <div onClick={() => handleNav("")} className={getItemClass("")}>
                    <HiChartPie className={getIconClass("")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Dashboard</span>
                </div>
            </li>

            {/* 2. Deployments */}
            <li>
                <div onClick={() => handleNav("deployments")} className={getItemClass("deployments")}>
                    <HiCloud className={getIconClass("deployments")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Deployments</span>
                </div>
            </li>

            {/* 3. Infrastructure */}
            <li>
                <div onClick={() => handleNav("infrastructure")} className={getItemClass("infrastructure")}>
                    <HiServer className={getIconClass("infrastructure")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Infrastructure</span>
                </div>
            </li>

            {/* 4. Logs */}
            <li>
                <div onClick={() => handleNav("logs")} className={getItemClass("logs")}>
                    <HiTerminal className={getIconClass("logs")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Server Logs</span>
                </div>
            </li>

            {/* 5. Kanban */}
            <li>
                <div onClick={() => handleNav("kanban")} className={getItemClass("kanban")}>
                    <HiViewBoards className={getIconClass("kanban")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Kanban Board</span>
                </div>
            </li>

            {/* 6. Settings */}
            <li>
                <div onClick={() => handleNav("settings")} className={getItemClass("settings")}>
                    <HiCog className={getIconClass("settings")} />
                    <span className={`ml-3 whitespace-nowrap transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>Settings</span>
                </div>
            </li>

        </ul>

        {/* Bottom Section */}
        <div className="absolute bottom-5 left-0 w-full px-3">
             <div className={`flex items-center p-3 rounded-xl transition-all duration-200 ${isHovered ? 'bg-white/30 dark:bg-gray-800/30' : ''}`}>
                <DarkThemeToggle className="focus:ring-0" />
                <span className={`ml-3 text-sm text-gray-500 dark:text-gray-400 ${isHovered ? 'block' : 'hidden'}`}>Theme</span>
             </div>
        </div>
      </div>
    </aside>
  );
};

export default ExampleSidebar;