import { RainbowButton } from "@/components/ui/rainbow-button";

export function RainbowButtonDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 gap-8">
      <h1 className="text-4xl font-bold text-white mb-8">Rainbow Button Demo</h1>
      <RainbowButton className="text-white font-semibold">
        Join Waitlist
      </RainbowButton>
      <RainbowButton className="text-white font-semibold">
        Get Unlimited Access
      </RainbowButton>
    </div>
  );
}
