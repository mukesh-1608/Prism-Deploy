import { Button, Card } from "flowbite-react";
import type { FC } from "react";
import { useEffect, useState, useRef } from "react";
import { HiDownload, HiRefresh, HiTerminal } from "react-icons/hi";

// Static list of logs to simulate
const LOG_DATA = [
    { time: "14:05:22", level: "INFO", msg: "Starting deployment process for commit #a1b2c3", color: "blue" },
    { time: "14:05:23", level: "INFO", msg: "Docker container 'frontend-v2' stopped", color: "blue" },
    { time: "14:05:24", level: "INFO", msg: "Pulling image: srm-tech/frontend:latest", color: "blue" },
    { time: "14:05:28", level: "INFO", msg: "Image pulled successfully (450MB)", color: "blue" },
    { time: "14:05:30", level: "WARN", msg: "Memory usage high on worker-node-04 (85%)", color: "yellow" },
    { time: "14:05:32", level: "INFO", msg: "Starting container 'frontend-v2'...", color: "blue" },
    { time: "14:05:35", level: "INFO", msg: "Health check passed: http://localhost:3000/health", color: "green" },
    { time: "14:05:36", level: "ERROR", msg: "Connection timeout: Redis Cache at 10.0.1.5:6379", color: "red" },
    { time: "14:05:37", level: "WARN", msg: "Retrying connection (Attempt 1/3)...", color: "yellow" },
    { time: "14:05:39", level: "INFO", msg: "Connection established.", color: "green" }, // Fixed Typo Here (: instead of =)
    { time: "14:05:40", level: "INFO", msg: "Nginx reloaded successfully.", color: "green" },
    { time: "14:05:42", level: "INFO", msg: "Deployment #142 completed in 20s.", color: "green" },
];

const ServerLogs: FC = function () {
  const [logs, setLogs] = useState<any[]>([]);
  const bottomRef = useRef<null | HTMLDivElement>(null);

  // Effect to stream logs one by one
  useEffect(() => {
    let currentIndex = 0;
    
    // Clear logs on mount to start fresh
    setLogs([]);

    const interval = setInterval(() => {
        if (currentIndex < LOG_DATA.length) {
            setLogs((prev) => [...prev, LOG_DATA[currentIndex]]);
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    }, 800); // Add a new line every 800ms

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <Card className="bg-gray-900 border-gray-800 text-gray-300 shadow-2xl">
      {/* TERMINAL HEADER */}
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <h3 className="ml-4 font-mono text-sm font-bold text-gray-100 flex items-center gap-2">
                <HiTerminal /> root@srm-tech:~/logs
            </h3>
        </div>
        <div className="flex gap-2">
            <Button size="xs" color="gray" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white" onClick={() => window.location.reload()}>
                <HiRefresh className="mr-1" /> Replay
            </Button>
            <Button size="xs" color="gray" className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-white">
                <HiDownload className="mr-1" /> Export
            </Button>
        </div>
      </div>

      {/* TERMINAL CONTENT */}
      <div className="font-mono text-xs h-[500px] overflow-y-auto space-y-1 p-2 scrollbar-hide">
        <p className="text-gray-500">Last login: Tue Oct 24 14:02:11 on ttys001</p>
        <p className="mb-4"><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> tail -f /var/log/app/production.log</p>
        
        <div className="space-y-1">
            {logs.map((log, index) => (
                <LogLine key={index} time={log.time} level={log.level} msg={log.msg} color={log.color} />
            ))}
            <div ref={bottomRef} />
            {logs.length === LOG_DATA.length && (
                 <p className="animate-pulse text-green-400 mt-2">_</p>
            )}
        </div>
      </div>
    </Card>
  );
};

const LogLine = ({ time, level, msg, color }: any) => {
    const colors: any = { blue: "text-blue-400", yellow: "text-yellow-400", red: "text-red-500", green: "text-green-400" };
    return (
        <div className="flex gap-3 hover:bg-gray-800 p-0.5 rounded cursor-default animate-fade-in">
            <span className="text-gray-600">{time}</span>
            <span className={`font-bold w-12 ${colors[color]}`}>[{level}]</span>
            <span className="text-gray-300">{msg}</span>
        </div>
    )
}

export default ServerLogs;