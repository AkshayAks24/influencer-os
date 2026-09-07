import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingLayout } from "./OnboardingLayout";
import { FaInstagram } from "react-icons/fa";

import type { ConnectedAccount } from "@/types/onboarding";

interface ConnectAccountsStepProps {
  connectedAccounts: ConnectedAccount[];
  onUpdate: (accounts: ConnectedAccount[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ConnectAccountsStep({ connectedAccounts, onUpdate, onNext, onBack }: ConnectAccountsStepProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const igAccount = connectedAccounts.find((a) => a.platform === "instagram");
  const isConnected = igAccount?.connected ?? false;

  const handleConnect = async (platform: ConnectedAccount["platform"]) => {
    setConnecting(platform);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const updated = [
      ...connectedAccounts.filter((a) => a.platform !== platform),
      { platform, username: "@creator_pulse_user", connected: true },
    ];
    onUpdate(updated);
    setConnecting(null);
  };

  return (
    <OnboardingLayout
      step="connect"
      stepIndex={5}
      totalSteps={7}
      heading="Let AI learn from your content"
      description="Connect your social account so we can understand your content and generate personalized insights."
      onBack={onBack}
      footer={
        <motion.button
          className={`w-full py-3.5 rounded-full font-heading font-bold text-base transition-all ${isConnected ? "bg-pulse-text text-pulse-white hover:bg-pulse-text/90 shadow-lg" : "bg-pulse-elevated text-pulse-muted cursor-not-allowed"}`}
          whileTap={isConnected ? { scale: 0.97 } : {}}
          onClick={() => isConnected && onNext()}
        >
          {isConnected ? "Continue" : "Connect an account to continue"}
        </motion.button>
      }
    >
      <motion.div className={`rounded-2xl border p-5 transition-all ${isConnected ? "border-pulse-lime/40 bg-pulse-lime/5" : "border-pulse-border bg-pulse-card"}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
            <FaInstagram className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-heading font-bold text-pulse-text">Instagram</p>
            <p className="text-sm font-body text-pulse-muted">
              {isConnected && igAccount ? `✓ Connected as ${igAccount.username}` : "Connect to analyze your content"}
            </p>
          </div>
          {!isConnected && (
            <motion.button className="px-5 py-2.5 rounded-full bg-pulse-text text-pulse-white text-sm font-heading font-bold" whileTap={{ scale: 0.95 }} onClick={() => handleConnect("instagram")} disabled={connecting !== null}>
              {connecting === "instagram" ? "Connecting..." : "Connect"}
            </motion.button>
          )}
          {isConnected && <span className="text-pulse-lime text-xl">✓</span>}
        </div>
      </motion.div>
      <div className="mt-8 flex items-start gap-3 rounded-xl bg-pulse-elevated p-4 border border-pulse-border">
        <span className="text-lg">🔒</span>
        <p className="text-xs font-body text-pulse-muted leading-relaxed">We'll only use the data you authorize to understand your content and generate personalized insights.</p>
      </div>
    </OnboardingLayout>
  );
}
