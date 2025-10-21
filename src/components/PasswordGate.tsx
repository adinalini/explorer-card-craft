import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PasswordGateProps {
  onPasswordSubmit: (password: string) => Promise<void>;
  isVerifying: boolean;
}

export const PasswordGate = ({ onPasswordSubmit, isVerifying }: PasswordGateProps) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onPasswordSubmit(password);
    setPassword("");
  };

  return (
    <div 
      className="relative w-full max-w-[320px] sm:max-w-[384px] md:max-w-[420px] lg:max-w-[480px] bg-black/20 backdrop-blur-sm p-6 sm:p-8 rounded-lg animate-fade-in"
      style={{ animationDelay: '0.3s' }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 sm:gap-6">
        <Lock className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" />
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Enter Password</h2>
          <p className="text-xs sm:text-sm text-slate-300">Please enter the password to access Project O Zone</p>
        </div>
        <div className="w-full max-w-xs">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-black/30 border-slate-600 text-white placeholder:text-slate-400 touch-manipulation"
            disabled={isVerifying}
            autoComplete="current-password"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isVerifying || !password}
          className="bg-violet-600 hover:bg-violet-700 text-white w-full max-w-xs touch-manipulation active:scale-95 transition-transform"
          onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isVerifying ? "Verifying..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};
