import { NavLink } from "./NavLink";
import logo from "@/assets/logo.png";
import logoname from "@/assets/logoname-b.png";
import { Home, BookOpen, GraduationCap, Bot, User, Menu, X, Info, Settings, ShieldCheck, FileText } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const { user, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  // always use the rounded floating header style across pages
  return (
    <>
      {/* Desktop Navigation */}
      {/* Desktop nav: make it shorter on big screens with bigger margins on left+right */}
      <nav className="hidden md:block fixed top-4 left-8 right-8 lg:left-28 lg:right-28 xl:left-48 xl:right-48 z-50 bg-white/95 backdrop-blur-xl border border-border/20 rounded-2xl shadow-lg">
        <div className="container mx-auto px-6 py-3 max-w-[1100px]">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-3 pl-2">
              <img src={logo} alt="Knowra mark" draggable={false} onDragStart={(e)=>e.preventDefault()} className="h-10 w-10 object-contain select-none" />
              <img src={logoname} alt="Knowra" draggable={false} onDragStart={(e)=>e.preventDefault()} className="h-6 hidden lg:block object-contain select-none" />
            </NavLink>
            
            <div className="flex items-center gap-8">
              <NavLink
                to="/"
                className="relative px-4 py-2 rounded-md text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                activeClassName="text-slate-900 bg-slate-100 shadow-sm"
              >
                Home
              </NavLink>
              <NavLink
                to="/academics"
                className="relative px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                activeClassName="text-slate-900 bg-slate-100 shadow-sm"
              >
                Academics
              </NavLink>
              <NavLink
                to="/skill-courses"
                className="relative px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                activeClassName="text-slate-900 bg-slate-100 shadow-sm"
              >
                Courses
              </NavLink>
              <NavLink
                to="/guru-ai"
                className="relative px-4 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                activeClassName="text-slate-900 bg-slate-100 shadow-sm"
              >
                Guru.AI
              </NavLink>
              {user ? (
                <NavLink 
                  to="/profile" 
                  className="text-sm font-medium text-foreground hover:text-sky-600 transition-colors"
                  activeClassName="text-sky-500"
                >
                  Profile
                </NavLink>
              ) : (
                <div className="flex items-center gap-3">
                  <NavLink to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2 rounded-md border border-transparent hover:border-slate-200">Login</NavLink>
                  <NavLink to="/signup" className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:opacity-95 transform hover:-translate-y-0.5 transition">Get Started</NavLink>
                </div>
              )}
              {user && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={async()=>{ await signOutUser(); navigate('/'); }}
                    className="text-sm px-3 py-2 rounded-md border border-border bg-transparent transition-colors hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header (small screens) */}
      <nav className="md:hidden fixed top-3 left-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-xl border border-border/20 shadow-lg">
        <div className="container mx-auto px-3 py-1 flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2">
            <img src={logo} alt="Knowra mark" draggable={false} onDragStart={(e)=>e.preventDefault()} className="h-8 w-8 object-contain select-none" />
            {/* always show the logoname on mobile and larger screens */}
            <img src={logoname} alt="Knowra" draggable={false} onDragStart={(e)=>e.preventDefault()} className="h-4 block object-contain select-none" />
          </NavLink>

          <div className="flex items-center gap-3">
            <button aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg bg-muted/40 hover:bg-muted/60 transition">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* Slide-down mobile menu */}
        {mobileOpen && (
          <div className="mt-1 container mx-auto px-2 py-2 bg-white/95 border-t border-border/20 rounded-b-xl shadow-sm">
            <div className="flex flex-col gap-1">
              {/* only show the requested settings/about/privacy/policy items */}
              <NavLink to="/about" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                <Info className="w-4 h-4" />
                <span>About</span>
              </NavLink>
              <NavLink to="/settings" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NavLink>
              <NavLink to="/privacy" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                <ShieldCheck className="w-4 h-4" />
                <span>Privacy</span>
              </NavLink>
              <NavLink to="/policy" onClick={()=>setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-50">
                <FileText className="w-4 h-4" />
                <span>Policy</span>
              </NavLink>
            </div>
          </div>
        )}

      </nav>

        {/* spacer removed so hero background shows under the fixed header on mobile */}

      {/* Mobile Navigation - Fixed Bottom */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-white/95 backdrop-blur-md rounded-2xl border border-border/20 shadow-xl">
        <div className="flex items-center justify-around py-2 px-2">
          <NavLink 
            to="/" 
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
            activeClassName="text-primary bg-primary/10 ring-1 ring-primary/20"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </NavLink>
          <NavLink 
            to="/academics" 
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
            activeClassName="text-primary bg-primary/10 ring-1 ring-primary/20"
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs">Academics</span>
          </NavLink>
          <NavLink 
            to="/skill-courses" 
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
            activeClassName="text-primary bg-primary/10 ring-1 ring-primary/20"
          >
            <GraduationCap className="h-6 w-6" />
            <span className="text-xs">Courses</span>
          </NavLink>
          <NavLink 
            to="/guru-ai" 
            className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
            activeClassName="text-primary bg-primary/10 ring-1 ring-primary/20"
          >
            <Bot className="h-6 w-6" />
            <span className="text-xs">Guru.AI</span>
          </NavLink>
          {user ? (
            <NavLink 
              to="/profile" 
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
              activeClassName="text-sky-500"
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </NavLink>
            ) : (
            <NavLink 
              to="/login" 
              className="flex flex-col items-center gap-1 text-muted-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/40"
              activeClassName="text-primary bg-primary/10 ring-1 ring-primary/20"
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Login</span>
            </NavLink>
            )}
          {/* small gap to keep it visually balanced */}
        </div>
      </nav>

      {/* spacer at bottom so the page content doesn't get hidden under the fixed bottom nav */}
      <div className="md:hidden h-[76px]" aria-hidden="true" />
    </>
  );
};

// Grab auth user via hook injection
