import { Button, Card, Label, Select, TextInput, ToggleSwitch, Spinner, Toast } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { HiCheck } from "react-icons/hi";

const DeploymentWizard: FC = function () {
  const [sslEnabled, setSslEnabled] = useState(true);
  const [route53Enabled, setRoute53Enabled] = useState(true);
  const [s3UploadEnabled, setS3UploadEnabled] = useState(true);
  const [iacBranchEnabled, setIacBranchEnabled] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // --- UPDATED CLOUD LOGIC ---
  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);

    const repoInput = document.getElementById('repo_name') as HTMLInputElement;
    const repoName = repoInput?.value;

    if (!repoName) {
        alert("Please enter a Git Repository name");
        setIsDeploying(false);
        return;
    }

    try {
        // !!! REPLACE THIS WITH YOUR EC2 PUBLIC IP !!!
        const EC2_IP = "13.232.166.106"; 
        
        const response = await fetch(`http://${EC2_IP}:8000/deploy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                repo_name: repoName
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            alert(`🎉 Deployment Started on Cloud!\n\nRepo: ${repoName}\nFE Port: ${data.ports.frontend}\nBE Port: ${data.ports.backend}`);
        } else {
            alert("❌ Server Error: " + (data.detail || "Unknown error"));
        }

    } catch (error) {
        console.error("Connection Error:", error);
        alert("❌ Could not connect to EC2.\nCheck if Port 8000 is open and Uvicorn is running.");
    } finally {
        setIsDeploying(false);
    }
  };

  return (
    <>
      {showToast && createPortal(
        <div className="fixed top-5 right-5 z-[9999] animate-bounce">
            <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                    <span className="font-bold">Success!</span> Cloud Pipeline triggered.
                </div>
                <Toast.Toggle onDismiss={() => setShowToast(false)} />
            </Toast>
        </div>,
        document.body
      )}

      <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-1 shadow-sm backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/40">
        <div className="p-6">
            
            <div className="mb-8 border-b border-gray-100 pb-6 dark:border-gray-700">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">New Deployment</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure your application specifications. Infrastructure will be provisioned automatically.
                </p>
            </div>

            <form className="flex flex-col gap-8" onSubmit={handleDeploy}>
            
            {/* 1. Project Details */}
            <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">1. Project Configuration</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="project_name" className="mb-2 block text-xs font-medium uppercase text-gray-500">Project Name</Label>
                    <TextInput id="project_name" placeholder="e.g. srmist-inv" sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="environment" className="mb-2 block text-xs font-medium uppercase text-gray-500">Target Environment</Label>
                    <Select id="environment" sizing="sm">
                    <option value="dev">Development (dev)</option>
                    <option value="qa">QA / Testing</option>
                    <option value="prod">Production</option>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="repo_name" className="mb-2 block text-xs font-medium uppercase text-gray-500">Git Repository</Label>
                    <TextInput id="repo_name" placeholder="sample-ci-project" required addon="git/" sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="branch_name" className="mb-2 block text-xs font-medium uppercase text-gray-500">Branch</Label>
                    <TextInput id="branch_name" placeholder="main" defaultValue="main" sizing="sm" />
                </div>
                </div>
            </div>

            {/* 2. Domain */}
            <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">2. Network & Domain</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50/50 p-4 rounded-lg border border-gray-100 dark:bg-gray-800/30 dark:border-gray-700">
                <div>
                    <Label htmlFor="base_domain" className="mb-2 block text-xs font-medium uppercase text-gray-500">Base Domain</Label>
                    <TextInput id="base_domain" value="srm-tech.com" disabled readOnly className="opacity-60" sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="region" className="mb-2 block text-xs font-medium uppercase text-gray-500">Region</Label>
                    <Select id="region" sizing="sm">
                    <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                    </Select>
                </div>
                </div>
            </div>

            {/* 3. Runtime Ports */}
            <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="fe_port" className="mb-2 block text-xs font-medium uppercase text-gray-500">FE Port (Auto-Assigned)</Label>
                    <TextInput id="fe_port" type="number" placeholder="Auto" disabled className="opacity-50" sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="be_port" className="mb-2 block text-xs font-medium uppercase text-gray-500">BE Port (Auto-Assigned)</Label>
                    <TextInput id="be_port" type="number" placeholder="Auto" disabled className="opacity-50" sizing="sm" />
                </div>
                </div>
            </div>

            {/* 4. Options */}
            <div className="border-t border-gray-100 pt-6 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center justify-between rounded-lg border border-gray-200/60 p-3 hover:bg-white transition dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">SSL / TLS</span>
                    <ToggleSwitch checked={sslEnabled} onChange={setSslEnabled} color="indigo" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200/60 p-3 hover:bg-white transition dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Route53</span>
                    <ToggleSwitch checked={route53Enabled} onChange={setRoute53Enabled} color="indigo" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200/60 p-3 hover:bg-white transition dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">S3 Assets</span>
                    <ToggleSwitch checked={s3UploadEnabled} onChange={setS3UploadEnabled} color="indigo" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-gray-200/60 p-3 hover:bg-white transition dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">IaC Git</span>
                    <ToggleSwitch checked={iacBranchEnabled} onChange={setIacBranchEnabled} color="indigo" />
                </div>
                </div>
            </div>

            {/* --- THE BUTTON --- */}
            <div className="mt-8">
                <button 
                type="submit" 
                disabled={isDeploying}
                className={`
                    w-full py-4 px-6 rounded-xl shadow-lg
                    text-sm font-bold tracking-widest uppercase text-white
                    bg-gray-900 border border-gray-800
                    hover:bg-black hover:border-gray-600 hover:shadow-2xl
                    focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                    dark:bg-white dark:text-black dark:border-gray-200 dark:hover:bg-gray-100
                    transition-all duration-300 ease-out transform active:scale-[0.99]
                    ${isDeploying ? 'cursor-not-allowed opacity-75' : ''}
                `}
                >
                {isDeploying ? (
                    <div className="flex items-center justify-center">
                        <Spinner size="sm" light={true} className="mr-3" />
                        <span className="normal-case tracking-normal">Deploying to Cloud...</span>
                    </div>
                ) : (
                    <span>Deployment</span>
                )}
                </button>
            </div>
            </form>
        </div>
      </div>
    </>
  );
};

export default DeploymentWizard;