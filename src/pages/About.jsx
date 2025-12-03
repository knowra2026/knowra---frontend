import { Navigation } from "@/components/Navigation";

export default function About(){
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="container mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">About Knowra</h1>
        <p className="max-w-2xl mx-auto text-slate-600">Knowra is a modern e-learning platform focused on academic excellence and fast growth for engineering students. This is a placeholder about page.</p>
      </main>
    </div>
  );
}
