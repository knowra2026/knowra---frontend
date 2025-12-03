import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, BookOpen, Award, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If auth is still loading, wait
    if (loading) return;

    // If user is not authenticated, show a guest placeholder profile
    if (!user) {
      setProfile({ name: 'Guest', email: '', mobile: '' });
      return;
    }

    // fetch profile via backend API
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/users/${user.uid}`);
        if (!res.ok) {
          // fallback to user object
          setProfile({ name: user.displayName || '', email: user.email || '', mobile: '' });
          return;
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile', err);
        setProfile({ name: user.displayName || '', email: user.email || '', mobile: '' });
      }
    };

    fetchProfile();
  }, [user, loading]);

  // derive some stats for display (placeholder fallback values)
  const courses = profile?.coursesEnrolled ?? 0;
  const certificates = profile?.certificates ?? 0;
  const queries = profile?.queriesSolved ?? 0;

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-10 md:pt-32">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                {/* could show profile picture later */}
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile?.name ?? 'Student Name'}</h1>
                <p className="text-muted-foreground mb-4">{profile?.course ?? 'Computer Science Engineering'}</p>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{profile?.email ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Phone className="h-4 w-4" />
                    <span>{profile?.mobile ? profile.mobile : '—'}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-sky-500" />
              <h3 className="text-2xl font-bold mb-1">{courses}</h3>
              <p className="text-sm text-muted-foreground">Courses Enrolled</p>
            </Card>
            <Card className="p-6 text-center">
              <Award className="h-8 w-8 mx-auto mb-3 text-sky-500" />
              <h3 className="text-2xl font-bold mb-1">{certificates}</h3>
              <p className="text-sm text-muted-foreground">Certificates Earned</p>
            </Card>
            <Card className="p-6 text-center">
              <User className="h-8 w-8 mx-auto mb-3 text-sky-500" />
              <h3 className="text-2xl font-bold mb-1">{queries}</h3>
              <p className="text-sm text-muted-foreground">AI Queries Solved</p>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-sky-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Completed Data Structures Module</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <Award className="h-5 w-5 text-sky-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Earned Python Certification</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-sky-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Asked 5 questions to Guru.AI</p>
                  <p className="text-sm text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
