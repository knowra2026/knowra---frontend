import { Navigation } from "@/components/Navigation";

export default function Privacy(){
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Privacy</h1>
        <p className="max-w-2xl mx-auto text-slate-600">Your privacy is important — this is a placeholder privacy page.</p>
      </main>
    </div>
  );
}
