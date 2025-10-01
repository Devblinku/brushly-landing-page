import { ModernHeader } from "@/components/ui/modern-header";

export function HeaderDemo() {
  return (
    <div className="min-h-screen bg-slate-900">
      <ModernHeader />
      <div className="pt-32 px-6">
        <h1 className="text-4xl font-bold text-white text-center">
          Modern Header Demo
        </h1>
        <p className="text-slate-300 text-center mt-4">
          Scroll down to see the header background change effect
        </p>
        <div className="h-screen"></div>
        <div className="h-screen"></div>
      </div>
    </div>
  );
}
