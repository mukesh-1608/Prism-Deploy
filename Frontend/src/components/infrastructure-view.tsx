import { Badge, Button, Card, Progress } from "flowbite-react";
import type { FC } from "react";
import { HiServer, HiDatabase, HiCloud, HiChip, HiRefresh, HiExternalLink } from "react-icons/hi";

const InfrastructureView: FC = function () {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
           <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
             Infrastructure Map
           </h3>
           <p className="text-sm text-gray-500">Live monitoring of ap-south-1 resources.</p>
        </div>
        <Button color="gray">
            <HiRefresh className="mr-2 h-4 w-4" /> Refresh Status
        </Button>
      </div>

      {/* 1. COMPUTE SECTION (EC2) */}
      <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <HiServer className="text-indigo-500" /> Compute Resources (EC2)
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
         {/* Server Card 1 */}
         <ServerCard 
            name="app-server-01" 
            type="t3.medium" 
            ip="10.0.1.24" 
            status="Running" 
            cpu={45} 
         />
         {/* Server Card 2 */}
         <ServerCard 
            name="worker-node-01" 
            type="t3.small" 
            ip="10.0.1.25" 
            status="Running" 
            cpu={78} 
         />
         {/* Server Card 3 */}
         <ServerCard 
            name="jenkins-build-agent" 
            type="c5.large" 
            ip="10.0.2.10" 
            status="Stopped" 
            cpu={0} 
         />
      </div>

      {/* 2. STORAGE SECTION (S3) */}
      <h4 className="mt-6 text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <HiCloud className="text-blue-500" /> Object Storage (S3)
      </h4>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StorageCard name="srm-deployment-artifacts" region="ap-south-1" size="45.2 GB" files="1,204" />
        <StorageCard name="srm-app-logs-archive" region="ap-south-1" size="120.5 GB" files="54,000+" />
      </div>

      {/* 3. DATABASE SECTION (RDS) */}
      <h4 className="mt-6 text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <HiDatabase className="text-green-500" /> Managed Databases (RDS)
      </h4>
      <Card>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg dark:bg-green-900">
                    <HiDatabase className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                    <h5 className="font-bold text-gray-900 dark:text-white">production-db-cluster</h5>
                    <p className="text-sm text-gray-500">PostgreSQL 14.2 • db.r6g.large</p>
                </div>
            </div>
            <div className="text-right">
                <Badge color="success" size="sm">Available</Badge>
                <p className="text-xs text-gray-400 mt-1">Uptime: 45d 12h</p>
            </div>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700 flex gap-6 text-sm">
            <div>
                <span className="block text-gray-500 text-xs">Connections</span>
                <span className="font-mono font-bold dark:text-white">142</span>
            </div>
            <div>
                <span className="block text-gray-500 text-xs">IOPS</span>
                <span className="font-mono font-bold dark:text-white">3,200</span>
            </div>
            <div>
                <span className="block text-gray-500 text-xs">Storage</span>
                <span className="font-mono font-bold dark:text-white">45% Used</span>
            </div>
        </div>
      </Card>

    </div>
  );
};

// --- HELPER COMPONENT: SERVER CARD ---
const ServerCard = ({ name, type, ip, status, cpu }: any) => {
    const isRunning = status === "Running";
    return (
        <Card className="transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex justify-between items-start">
                <div className="flex gap-3">
                    <div className={`p-2 rounded-md ${isRunning ? 'bg-indigo-50 dark:bg-indigo-900' : 'bg-gray-100 dark:bg-gray-700'}`}>
                        <HiChip className={`h-6 w-6 ${isRunning ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">{name}</h5>
                        <p className="text-xs text-gray-500 font-mono">{ip}</p>
                    </div>
                </div>
                <Badge color={isRunning ? "success" : "failure"}>{status}</Badge>
            </div>
            
            <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">CPU Usage</span>
                    <span className={`font-bold ${cpu > 80 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{cpu}%</span>
                </div>
                <Progress progress={cpu} color={cpu > 80 ? "red" : "indigo"} size="sm" />
            </div>
            
            <div className="mt-4 flex justify-between items-center border-t border-gray-100 pt-3 dark:border-gray-700">
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded dark:bg-gray-700">{type}</span>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1">
                    Console <HiExternalLink />
                </a>
            </div>
        </Card>
    )
}

// --- HELPER COMPONENT: STORAGE CARD ---
const StorageCard = ({ name, region, size, files }: any) => (
    <Card className="border-l-4 border-blue-500">
        <div className="flex justify-between">
            <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HiCloud className="text-gray-400" /> {name}
            </h5>
            <span className="text-xs text-gray-500">{region}</span>
        </div>
        <div className="mt-2 flex gap-6">
            <div>
                <span className="block text-xs text-gray-400 uppercase">Total Size</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">{size}</span>
            </div>
            <div>
                <span className="block text-xs text-gray-400 uppercase">File Count</span>
                <span className="text-lg font-bold text-gray-800 dark:text-white">{files}</span>
            </div>
        </div>
    </Card>
)

export default InfrastructureView;