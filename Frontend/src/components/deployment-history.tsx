import { Badge, Button, Card, Table, TextInput } from "flowbite-react";
import type { FC } from "react";
import { HiSearch, HiRefresh, HiExternalLink, HiTerminal } from "react-icons/hi";

const DeploymentHistory: FC = function () {
  return (
    <Card className="shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div>
           <h3 className="text-xl font-bold text-gray-900 dark:text-white">
             Deployment History
           </h3>
           <p className="text-sm text-gray-500">Track all automation scripts executed by Prism.</p>
        </div>
        <div className="flex gap-2">
            <TextInput icon={HiSearch} placeholder="Search commit..." />
            <Button color="gray">
                <HiRefresh className="mr-2 h-4 w-4" /> Refresh
            </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>Project / Branch</Table.HeadCell>
            <Table.HeadCell>Commit</Table.HeadCell>
            <Table.HeadCell>Environment</Table.HeadCell>
            <Table.HeadCell>Time</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            
            {/* ROW 1 */}
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                srmist-inv <span className="ml-2 font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">main</span>
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-indigo-600">#8f4a21</Table.Cell>
              <Table.Cell><Badge color="purple">Production</Badge></Table.Cell>
              <Table.Cell>Oct 24, 14:30</Table.Cell>
              <Table.Cell><Badge color="success">Active</Badge></Table.Cell>
              <Table.Cell>
                <div className="flex gap-3">
                    <a href="#" className="text-indigo-600 hover:underline flex items-center gap-1">
                        View <HiExternalLink />
                    </a>
                </div>
              </Table.Cell>
            </Table.Row>

            {/* ROW 2 */}
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                payment-gateway <span className="ml-2 font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">dev</span>
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-indigo-600">#c22b90</Table.Cell>
              <Table.Cell><Badge color="blue">Development</Badge></Table.Cell>
              <Table.Cell>Oct 24, 11:15</Table.Cell>
              <Table.Cell><Badge color="failure">Failed</Badge></Table.Cell>
              <Table.Cell>
                <div className="flex gap-3">
                    <a href="#" className="text-red-600 hover:underline flex items-center gap-1">
                        <HiTerminal /> Logs
                    </a>
                </div>
              </Table.Cell>
            </Table.Row>

            {/* ROW 3 */}
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                auth-service <span className="ml-2 font-mono text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">feature/login</span>
              </Table.Cell>
              <Table.Cell className="font-mono text-xs text-indigo-600">#d99e12</Table.Cell>
              <Table.Cell><Badge color="gray">QA</Badge></Table.Cell>
              <Table.Cell>Just now</Table.Cell>
              <Table.Cell><Badge color="warning" className="animate-pulse">Building...</Badge></Table.Cell>
              <Table.Cell>
                <span className="text-gray-400 cursor-not-allowed">Wait...</span>
              </Table.Cell>
            </Table.Row>

          </Table.Body>
        </Table>
      </div>
    </Card>
  );
};

export default DeploymentHistory;