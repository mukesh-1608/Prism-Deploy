import { Button, DarkThemeToggle, Label, TextInput, Spinner } from "flowbite-react";
import { 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  Terminal, 
  Lock,
  Zap,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [orgId, setOrgId] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;

    setIsLoading(true);
    setError("");

    try {
        const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ org_id: orgId })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("prism_token", data.access_token);
            setTimeout(() => navigate("/dashboard"), 600); 
        } else {
            setError("Invalid Organization ID.");
        }
    } catch (err) {
        console.error(err);
        setError("Connection failed. Is the Backend running?");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-white font-sans">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Technical Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 h-[600px] w-[600px] bg-indigo-500/10 blur-[130px] rounded-full dark:bg-indigo-500/20" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] bg-blue-500/10 blur-[130px] rounded-full dark:bg-blue-500/20" />
      </div>

      {/* --- THEME TOGGLE (Top Right) --- */}
      <div className="absolute top-6 right-6 z-50">
        <DarkThemeToggle className="focus:ring-0 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg p-2 transition-all" />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto flex h-screen max-w-6xl flex-col items-center justify-center px-6 lg:flex-row lg:gap-24">
        
        {/* LEFT COLUMN: The Experience */}
        <div className={`flex flex-col items-start text-left lg:w-1/2 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* BIG PRISM TITLE */}
            <div className="flex items-center gap-3 mb-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/30">
                    <Rocket className="h-7 w-7 text-white" />
                </div>
                <span className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    PRISM
                </span>
            </div>

            {/* HEADLINE */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight leading-tight text-gray-900 dark:text-white">
              Infrastructure that <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">feels like magic.</span>
            </h1>
            
            {/* CLEAN DESCRIPTION (No Hyphens) */}
            <p className="mb-12 text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
               Prism is an automated orchestration layer designed for high-velocity engineering teams. We automate the boring parts of DevOps, turning your repository into a production-ready application with a single click. Cut your deployment time by 90%.
            </p>

            {/* SMOOTH HIGHLIGHTS (No Boxes) */}
            <div className="space-y-6 w-full max-w-md">
                <SmoothFeature 
                    icon={<Zap className="h-5 w-5" />} 
                    title="One-Click Provisioning" 
                    desc="Zero-config deployment from Git to AWS." 
                />
                <SmoothFeature 
                    icon={<Terminal className="h-5 w-5" />} 
                    title="Live Terminal Streaming" 
                    desc="Watch your build logs in real-time." 
                />
                <SmoothFeature 
                    icon={<ShieldCheck className="h-5 w-5" />} 
                    title="15-Minute Secure Sessions" 
                    desc="Auto-expiring tokens via IAM Identity." 
                />
            </div>
        </div>

        {/* RIGHT COLUMN: The Login Gate */}
        <div className={`mt-16 w-full max-w-md lg:mt-0 lg:w-5/12 transition-all duration-1000 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Widget-Style Login Card */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-2xl">
                
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Workspace Login</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Enter your Organization ID to continue
                    </p>
                </div>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="org-id" value="Organization Domain" className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400" />
                        </div>
                        <TextInput 
                            id="org-id" 
                            type="text" 
                            placeholder="e.g. srm-tech" 
                            required 
                            sizing="lg" 
                            value={orgId}
                            onChange={(e) => setOrgId(e.target.value)}
                            className="[&_input]:bg-gray-50 [&_input]:border-gray-300 [&_input]:focus:ring-indigo-600 dark:[&_input]:bg-gray-900/50 dark:[&_input]:border-gray-600"
                        />
                        {error && <p className="mt-2 text-xs font-medium text-red-500 animate-pulse">{error}</p>}
                    </div>

                    <Button 
                        type="submit" 
                        disabled={isLoading || !orgId}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all active:scale-[0.98] rounded-xl"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Spinner size="sm" light={true} />
                                <span>Authenticating...</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 font-semibold">
                                <span>Access Dashboard</span>
                                <ArrowRight size={16} />
                            </div>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Restricted Access. Authorized Personnel Only.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER: The "Smooth" Feature Item ---
// No boxes, no borders. Just clean layout with a glowing icon.
function SmoothFeature({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex items-center gap-5 group">
            {/* Icon Circle */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white dark:bg-gray-800 dark:text-indigo-400 dark:group-hover:bg-indigo-500 dark:group-hover:text-white">
                {icon}
            </div>
            {/* Text Content */}
            <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {desc}
                </p>
            </div>
        </div>
    )
}