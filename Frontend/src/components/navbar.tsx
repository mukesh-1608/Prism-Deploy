import type { FC } from "react";
import { Navbar } from "flowbite-react";

const ExampleNavbar: FC = function () {
  return (
    <Navbar fluid className="fixed top-0 z-50 w-full bg-transparent border-none transition-all duration-300">
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center h-16">
          
          {/* THE STACKED BRANDING */}
          <div className="flex flex-col justify-center select-none">
            
            {/* 1. Main Title (Big & Tight) */}
            <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white font-sans drop-shadow-sm leading-[0.85]">
              Prism
            </span>

            {/* 2. Subtitle (Small, Spaced Out, & Stacked Below) */}
            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.35em] ml-[2px] mt-1 opacity-90">
              by SRMTECH
            </span>

          </div>
          
        </div>
      </div>
    </Navbar>
  );
};

export default ExampleNavbar;