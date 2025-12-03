import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Navigation } from "@/components/Navigation";
import AuthPrompt from "@/components/AuthPrompt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Award, ExternalLink } from "lucide-react";

const SkillCourses = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [authPromptTimer, setAuthPromptTimer] = useState(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Courses page remains viewable to all users.

  const courses = [
    {
      title: "Full Stack Web Development",
      category: "development",
      duration: "12 weeks",
      level: "Intermediate",
      certified: true,
      description: "Master frontend and backend development with React, Node.js, and databases.",
    },
    {
      title: "Data Science with Python",
      category: "data-science",
      duration: "10 weeks",
      level: "Beginner",
      certified: true,
      description: "Learn data analysis, visualization, and machine learning fundamentals.",
    },
    {
      title: "Cloud Computing - AWS",
      category: "cloud",
      duration: "8 weeks",
      level: "Intermediate",
      certified: true,
      description: "Master Amazon Web Services and cloud architecture fundamentals.",
    },
    {
      title: "UI/UX Design Fundamentals",
      category: "design",
      duration: "6 weeks",
      level: "Beginner",
      certified: true,
      description: "Learn user interface and experience design principles and tools.",
    },
    {
      title: "DevOps Engineering",
      category: "development",
      duration: "10 weeks",
      level: "Advanced",
      certified: true,
      description: "Master CI/CD, containerization, and infrastructure as code.",
    },
    {
      title: "Cybersecurity Basics",
      category: "security",
      duration: "8 weeks",
      level: "Beginner",
      certified: true,
      description: "Understand network security, encryption, and ethical hacking.",
    },
  ];

  const categories = [
    { value: "all", label: "All Courses" },
    { value: "development", label: "Development" },
    { value: "data-science", label: "Data Science" },
    { value: "cloud", label: "Cloud" },
    { value: "design", label: "Design" },
    { value: "security", label: "Security" },
  ];

  const filteredCourses = selectedCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === selectedCategory);

  const handleStartCourse = () => {
    if (!user) {
      setAuthPromptOpen(true);
    } else {
      navigate('/profile');
    }
  };

  const handleAuthPromptChange = (open) => {
    setAuthPromptOpen(open);
    
    if (authPromptTimer) {
      clearTimeout(authPromptTimer);
      setAuthPromptTimer(null);
    }

    if (!open && !user) {
      const timer = setTimeout(() => {
        setAuthPromptOpen(true);
      }, 3000);
      setAuthPromptTimer(timer);
    }
  };

  useEffect(() => {
    return () => {
      if (authPromptTimer) {
        clearTimeout(authPromptTimer);
      }
    };
  }, [authPromptTimer]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <AuthPrompt open={authPromptOpen} onOpenChange={handleAuthPromptChange} />
      
      <main className="container mx-auto px-6 pt-10 md:pt-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Skill Courses</h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Enhance your skills with industry-recognized certification courses.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.value)}
                className={selectedCategory === category.value ? "bg-sky-500 hover:bg-sky-600 text-white" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <Card key={index} className="flex flex-col hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    {course.certified && (
                      <Badge variant="secondary" className="bg-sky-50 text-sky-500 border-sky-100">
                        <Award className="h-3 w-3 mr-1" />
                        Certified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-1">{course.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>

                  <Button
                    onClick={handleStartCourse}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    Start Course
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SkillCourses;
