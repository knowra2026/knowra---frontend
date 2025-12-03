import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { FeatureCard } from "@/components/FeatureCard";
import { StatCard } from "@/components/StatCard";
import { BookOpen, Award, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="pt-6 md:pt-28 pb-12 px-4 relative overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Learn Smart. <span className="text-sky-500">Score High.</span> Grow Faster.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Your complete e-learning platform for engineering success. Access academics,
            skill courses, and AI-powered doubt solving.
          </p>
          {!user ? (
            <Button variant="hero" size="lg" onClick={() => navigate("/academics")}>
              Get Started
            </Button>
          ) : (
            <div className="flex justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/academics')}>
                Explore Academics
              </Button>
              <Button className="ml-4" onClick={() => navigate('/profile')}>
                My Profile
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Main Features Section */}
        <section className="py-12 px-4 sm:px-6 bg-accent/30">
          <div className="container mx-auto max-w-7xl">
            {/* Desktop / tablet layout (3 columns) */}
            <div className="hidden md:grid grid-cols-3 gap-6">
          {/* Wrap each FeatureCard so the card background and sizing are consistent and text is visible */}
          <div className="rounded-2xl bg-card shadow-lg overflow-hidden md:overflow-visible flex items-stretch group cursor-pointer md:hover:shadow-2xl md:hover:-translate-y-1 transition-transform transition-shadow transition-colors will-change-transform md:group-hover:ring-2 md:group-hover:ring-sky-200 md:group-hover:ring-offset-2 relative">
            <FeatureCard
              className="w-full h-56 p-6 flex flex-col justify-center items-center text-center"
              icon={BookOpen}
              title="Academics"
              description="Access all academic content for your engineering program. Select your university, branch, and semester."
              onClick={() => navigate("/academics")}
              // disableHover={true}
            />
          </div>

          <div className="rounded-2xl bg-card shadow-lg overflow-hidden md:overflow-visible flex items-stretch group cursor-pointer md:hover:shadow-2xl md:hover:-translate-y-1 transition-transform transition-shadow transition-colors will-change-transform md:group-hover:ring-2 md:group-hover:ring-sky-200 md:group-hover:ring-offset-2 relative">
            <FeatureCard
              className="w-full h-56 p-6 flex flex-col justify-center items-center text-center"
              icon={Award}
              title="Skill Courses"
              description="Level up your skills"
              // disableHover={true}
              // iconFilled={true}
              onClick={() => navigate("/skill-courses")}
            />
          </div>

          <div className="rounded-2xl bg-card shadow-lg overflow-hidden md:overflow-visible flex items-stretch group cursor-pointer md:hover:shadow-2xl md:hover:-translate-y-1 transition-transform transition-shadow transition-colors will-change-transform md:group-hover:ring-2 md:group-hover:ring-sky-200 md:group-hover:ring-offset-2 relative">
            <FeatureCard
              className="w-full h-56 p-6 flex flex-col justify-center items-center text-center"
              icon={Bot}
              title="Guru.AI"
              description="AI doubt solving — 24/7"
              // disableHover={true}
              onClick={() => navigate("/guru-ai")}
            />
          </div>
            </div>

            {/* Mobile layout:
          - One big vertical rectangle for Academics (full width)
          - Below it, two half-width cards: Skill Courses and Guru.AI (side-by-side)
            */}
            <div className="md:hidden grid gap-4">
          {/* Big Academics card */}
          <div className="rounded-2xl bg-card shadow-lg overflow-hidden text-center">
            <FeatureCard
              className="h-56 p-6 flex flex-col justify-center items-center text-center text-sm md:text-base"
              icon={BookOpen}
              title="Academics"
              description="Access all academic content for your engineering program. Select your university, branch, and semester."
              onClick={() => navigate("/academics")}
              disableHover={true}
            />
          </div>

          {/* Two half-width cards in a row */}
          <div className="flex gap-4 px-2">
            <div className="flex-1 rounded-2xl bg-card shadow-lg overflow-hidden flex items-stretch">
              <FeatureCard
            className="h-44 p-4 flex flex-col justify-center items-center text-center text-xs sm:text-sm md:text-base"
            icon={Award}
            title="Skill Courses"
            description={<span className="whitespace-nowrap">Level up your skills</span>}
              onClick={() => navigate("/skill-courses")}
              disableHover={true}
              iconFilled={false}
              />
            </div>

            <div className="flex-1 rounded-2xl bg-card shadow-lg overflow-hidden flex items-stretch">
              {/* Make Guru.AI look more like an image/icon-focused card on mobile */}
              <FeatureCard
            className="h-44 p-4 flex flex-col justify-center items-center text-center text-xs sm:text-sm md:text-base"
            icon={Bot}
            title="Guru.AI"
            description="AI doubt solving — 24/7"
            onClick={() => navigate("/guru-ai")}
            disableHover={true}
              />
            </div>
          </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard value="500+" label="Video Lectures" />
            <StatCard value="1000+" label="Study Materials" />
            <StatCard value="50+" label="Skill Courses" />
            <StatCard value="24/7" label="AI Assistant" />
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-card to-accent p-6 md:p-12 text-center shadow-2xl">
            <div className="absolute inset-0 bg-sky-50" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6 px-6 py-3 rounded-full bg-sky-50 border border-sky-100">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <span className="text-sm font-semibold text-sky-500">Coming Soon</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">Exciting Features on the Way</h2>
              <div className="max-w-2xl mx-auto">
                <div className="grid grid-cols-2 gap-4 text-left mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-muted-foreground">Student Community</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-muted-foreground">Internship Corner</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-muted-foreground">Resume Builder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-muted-foreground">Mock Tests</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 KNOWAR3. Empowering Engineering Students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
