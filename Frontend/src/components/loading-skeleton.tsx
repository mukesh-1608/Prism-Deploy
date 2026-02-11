import { Card } from "flowbite-react";
import type { FC } from "react";

const LoadingSkeleton: FC = function () {
  return (
    <div className="animate-pulse space-y-6">
      
      {/* 1. TOP STATS ROW (3 Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-32">
            <div className="flex items-center justify-between">
               <div className="h-4 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
               <div className="h-4 w-8 bg-gray-200 rounded dark:bg-gray-700"></div>
            </div>
            <div className="mt-4 h-8 w-16 bg-gray-300 rounded dark:bg-gray-600"></div>
            <div className="mt-2 h-2 w-full bg-gray-100 rounded dark:bg-gray-800"></div>
          </Card>
        ))}
      </div>

      {/* 2. BIG TABLE AREA */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded dark:bg-gray-700"></div>
            <div className="h-8 w-24 bg-gray-200 rounded dark:bg-gray-700"></div>
        </div>
        <div className="space-y-4">
            {/* 5 Fake Rows */}
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <div className="h-3 w-32 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                            <div className="h-2 w-20 bg-gray-100 rounded dark:bg-gray-800"></div>
                        </div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded dark:bg-gray-700"></div>
                </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default LoadingSkeleton;