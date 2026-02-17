import { Label, Select, TextInput, Spinner, Toast } from "flowbite-react";
import type { FC } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { HiCheck } from "react-icons/hi";

const DeploymentWizard: FC = function () {
  const [isDeploying, setIsDeploying] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDeploy = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    setTimeout(() => {
        setIsDeploying(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
    }, 3000);
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && createPortal(
        <div className="fixed top-5 right-5 z-[9999] animate-bounce">
            <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                    <HiCheck className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                    <span className="font-bold">Success!</span> Pipeline triggered.
                </div>
                <Toast.Toggle onDismiss={() => setShowToast(false)} />
            </Toast>
        </div>,
        document.body
      )}

      {/* Main Glass Card */}
      <div className="rounded-2xl border border-gray-200/50 bg-white/60 p-1 shadow-sm backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/40">
        <div className="p-6">
            
            {/* Header */}
            <div className="mb-8 border-b border-gray-100 pb-6 dark:border-gray-700">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">New Deployment</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configure your application specifications. Infrastructure will be provisioned automatically via Terraform.
                </p>
            </div>

            <form className="flex flex-col gap-8" onSubmit={handleDeploy}>
            
            {/* 1. Project Details */}
            <div>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">1. Project Configuration</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="project_name" className="mb-2 block text-xs font-medium uppercase text-gray-500">Project Name</Label>
                    <TextInput id="project_name" placeholder="e.g. srmist-inv" required sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="environment" className="mb-2 block text-xs font-medium uppercase text-gray-500">Target Environment</Label>
                    <Select id="environment" required sizing="sm">
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
                    <TextInput id="branch_name" placeholder="main" defaultValue="main" required sizing="sm" />
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
                    <Select id="region" required sizing="sm">
                    <option value="ap-south-1">Asia Pacific (Mumbai)</option>
                    <option value="us-east-1">US East (N. Virginia)</option>
                    </Select>
                </div>
                <div>
                    <Label htmlFor="fe_subdomain" className="mb-2 block text-xs font-medium uppercase text-gray-500">Frontend URL</Label>
                    <TextInput id="fe_subdomain" placeholder="app" addon="https://" required sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="be_subdomain" className="mb-2 block text-xs font-medium uppercase text-gray-500">Backend URL</Label>
                    <TextInput id="be_subdomain" placeholder="api" addon="https://" required sizing="sm" />
                </div>
                </div>
            </div>

            {/* 3. Runtime Ports */}
            <div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <Label htmlFor="fe_port" className="mb-2 block text-xs font-medium uppercase text-gray-500">FE Port</Label>
                    <TextInput id="fe_port" type="number" defaultValue={3000} sizing="sm" />
                </div>
                <div>
                    <Label htmlFor="be_port" className="mb-2 block text-xs font-medium uppercase text-gray-500">BE Port</Label>
                    <TextInput id="be_port" type="number" defaultValue={8000} sizing="sm" />
                </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-gray-700">
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
                        <span className="normal-case tracking-normal">Deploying...</span>
                    </div>
                ) : (
                    <span>Deploy Infrastructure</span>
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