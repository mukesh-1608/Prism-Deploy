import { Badge, Button, Card, Avatar } from "flowbite-react";
import type { FC } from "react";
import { HiPlus } from "react-icons/hi";

const KanbanBoard: FC = function () {
  return (
    <div className="h-full overflow-x-auto pb-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sprint 42: Infrastructure</h3>
        <Button size="sm" gradientDuoTone="purpleToBlue"><HiPlus className="mr-2 h-4 w-4" /> New Task</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[800px]">
        {/* COLUMN 1: TO DO */}
        <KanbanColumn title="To Do" count={3} color="bg-gray-100 dark:bg-gray-800">
            <KanbanCard 
                title="Update SSL Certs" 
                tag="Security" 
                tagColor="red" 
                assignee="MK" 
                desc="Wildcard cert for *.srm-tech.com expiring in 3 days."
            />
            <KanbanCard 
                title="Migrate to T3.Large" 
                tag="Infra" 
                tagColor="blue" 
                assignee="AJ" 
                desc="Worker nodes running out of RAM."
            />
             <KanbanCard 
                title="Setup Grafana" 
                tag="Monitoring" 
                tagColor="purple" 
                desc="Visualize Nginx logs."
            />
        </KanbanColumn>

        {/* COLUMN 2: IN PROGRESS */}
        <KanbanColumn title="In Progress" count={2} color="bg-indigo-50 dark:bg-gray-700">
            <KanbanCard 
                title="Fix Login Bug" 
                tag="Backend" 
                tagColor="yellow" 
                assignee="MK" 
                desc="Auth service returning 500 on timeout."
            />
            <KanbanCard 
                title="Dockerize Python API" 
                tag="DevOps" 
                tagColor="blue" 
                assignee="SR" 
            />
        </KanbanColumn>

        {/* COLUMN 3: DEPLOYED */}
        <KanbanColumn title="Deployed (Prod)" count={4} color="bg-green-50 dark:bg-gray-800">
            <KanbanCard 
                title="v2.1 Release" 
                tag="Release" 
                tagColor="green" 
                assignee="System" 
                desc="Successfully deployed to ap-south-1"
            />
        </KanbanColumn>
      </div>
    </div>
  );
};

const KanbanColumn = ({ title, count, color, children }: any) => (
    <div className={`rounded-xl p-4 ${color} min-h-[500px]`}>
        <div className="flex justify-between items-center mb-4 px-1">
            <h4 className="font-bold text-gray-700 dark:text-gray-200">{title}</h4>
            <Badge color="gray">{count}</Badge>
        </div>
        <div className="space-y-3">
            {children}
        </div>
    </div>
)

const KanbanCard = ({ title, tag, tagColor, assignee, desc }: any) => (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <div className="flex justify-between items-start mb-2">
            <Badge color={tagColor}>{tag}</Badge>
            {assignee && (
                <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                    {assignee}
                </div>
            )}
        </div>
        <h5 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">{title}</h5>
        {desc && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{desc}</p>}
    </Card>
)

export default KanbanBoard;