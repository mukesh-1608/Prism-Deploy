import { Modal, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
// ADDED MISSING ICONS HERE
import { 
  HiSearch, 
  HiChartPie, 
  HiCloud, 
  HiTerminal, 
  HiCog, 
  HiLightningBolt, 
  HiViewBoards 
} from "react-icons/hi";

// This is your data source
const searchItems = [
  { id: 'dashboard', title: 'Dashboard', icon: HiChartPie, href: '#dashboard' },
  { id: 'deployments', title: 'New Deployment', icon: HiCloud, href: '#deployments' },
  { id: 'health', title: 'System Health', icon: HiLightningBolt, href: '#infrastructure' },
  { id: 'logs', title: 'Server Logs', icon: HiTerminal, href: '#logs' },
  { id: 'tasks', title: 'Task Board', icon: HiViewBoards, href: '#kanban' },
  { id: 'settings', title: 'Settings', icon: HiCog, href: '#settings' },
];

const CommandPalette: FC = function () {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  // Listen for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // FIXED: Changed COMMANDS to searchItems and cmd.name to cmd.title
  const filteredCommands = searchItems.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    setQuery("");
    window.location.hash = href; 
  };

  return (
    <>
      {/* Quick Menu Trigger Button */}
      <div className="fixed bottom-5 right-5 hidden md:block z-40">
        <div 
            className="flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-xs font-medium text-gray-500 shadow-lg border border-gray-100 dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-400 cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => setIsOpen(true)}
        >
           <span>Quick Menu</span>
           <kbd className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-300 shadow-sm">Ctrl K</kbd>
        </div>
      </div>

      <Modal show={isOpen} size="lg" popup onClose={() => setIsOpen(false)} position="center">
        <div className="relative overflow-hidden rounded-xl bg-white/90 backdrop-blur-xl shadow-2xl dark:bg-gray-800/90 border border-white/20">
            <div className="border-b border-gray-100 p-4 dark:border-gray-700">
                <TextInput
                    icon={HiSearch}
                    placeholder="Where do you want to go?"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-none shadow-none focus:ring-0"
                    sizing="lg"
                />
            </div>
            <div className="max-h-[350px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                    filteredCommands.map((cmd) => (
                        <button
                            key={cmd.id}
                            onClick={() => handleSelect(cmd.href)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50/50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors">
                                    <cmd.icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-indigo-400" />
                                </div>
                                <span className="font-semibold">{cmd.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">Navigate</span>
                                <svg className="h-4 w-4 text-gray-300 group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="p-8 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No results for "{query}"</p>
                        <p className="text-xs text-gray-400 mt-1">Try searching for 'Deploy' or 'Logs'</p>
                    </div>
                )}
            </div>
        </div>
      </Modal>
    </>
  );
};

export default CommandPalette;