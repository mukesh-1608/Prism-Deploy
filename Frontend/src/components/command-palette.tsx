import { Modal, TextInput } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { HiSearch, HiChartPie, HiCloud, HiTerminal, HiServer, HiCog } from "react-icons/hi";

const COMMANDS = [
    { id: "dashboard", name: "Go to Dashboard", icon: HiChartPie, shortcut: "D" },
    { id: "deployments", name: "View Deployments", icon: HiCloud, shortcut: "H" },
    { id: "infrastructure", name: "Infrastructure Map", icon: HiServer, shortcut: "I" },
    { id: "logs", name: "Open Terminal Logs", icon: HiTerminal, shortcut: "L" },
    { id: "settings", name: "Settings", icon: HiCog, shortcut: "S" },
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

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (id: string) => {
    setIsOpen(false);
    setQuery("");
    window.location.hash = id === "dashboard" ? "" : id; 
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 hidden md:block z-40">
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 cursor-pointer" onClick={() => setIsOpen(true)}>
           <span>Quick Menu</span>
           <kbd className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-300">Ctrl K</kbd>
        </div>
      </div>

      <Modal show={isOpen} size="lg" popup onClose={() => setIsOpen(false)} position="center">
        <div className="relative overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-800">
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
            <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                    filteredCommands.map((cmd) => (
                        <button
                            key={cmd.id}
                            onClick={() => handleSelect(cmd.id)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <cmd.icon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 dark:text-gray-500 dark:group-hover:text-white" />
                                <span className="font-medium">{cmd.name}</span>
                            </div>
                            <span className="text-xs text-gray-400 group-hover:text-indigo-500">Jump to</span>
                        </button>
                    ))
                ) : (
                    <div className="p-4 text-center text-sm text-gray-500">No results found.</div>
                )}
            </div>
        </div>
      </Modal>
    </>
  );
};

export default CommandPalette;