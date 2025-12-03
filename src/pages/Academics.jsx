import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, FileText, Download } from "lucide-react";

const Academics = () => {
  const [university, setUniversity] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

  const showSubjects = university && college && branch && semester;

  const subjects = [
    { name: "Data Structures", materials: 45, videos: 32, papers: 8 },
    { name: "Algorithms", materials: 38, videos: 28, papers: 6 },
    { name: "Database Systems", materials: 42, videos: 30, papers: 7 },
    { name: "Operating Systems", materials: 40, videos: 26, papers: 8 },
    { name: "Computer Networks", materials: 36, videos: 24, papers: 5 },
    { name: "Software Engineering", materials: 44, videos: 29, papers: 7 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-10 md:pt-32">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Academics</h1>
          <p className="text-muted-foreground mb-12 text-lg">
            Select your details to access course materials, video lectures, and previous papers.
          </p>

          {/* Selection Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Select value={university} onValueChange={setUniversity}>
              <SelectTrigger>
                <SelectValue placeholder="Select University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jntu">JNTU</SelectItem>
                <SelectItem value="ou">Osmania University</SelectItem>
                <SelectItem value="iit">IIT</SelectItem>
              </SelectContent>
            </Select>

            <Select value={college} onValueChange={setCollege} disabled={!university}>
              <SelectTrigger>
                <SelectValue placeholder="Select College" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cbit">CBIT</SelectItem>
                <SelectItem value="vnr">VNR VJIET</SelectItem>
                <SelectItem value="cvsr">CVSR</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branch} onValueChange={setBranch} disabled={!college}>
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cse">Computer Science</SelectItem>
                <SelectItem value="ece">Electronics</SelectItem>
                <SelectItem value="mech">Mechanical</SelectItem>
              </SelectContent>
            </Select>

            <Select value={semester} onValueChange={setSemester} disabled={!branch}>
              <SelectTrigger>
                <SelectValue placeholder="Select Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
                <SelectItem value="7">Semester 7</SelectItem>
                <SelectItem value="8">Semester 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subjects Grid */}
          {showSubjects && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <Card key={subject.name} className="group hover:shadow-lg transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-sky-500" />
                      {subject.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Study Materials
                      </span>
                      <span className="font-medium">{subject.materials}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Video className="h-4 w-4" />
                        Video Lectures
                      </span>
                      <span className="font-medium">{subject.videos}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Download className="h-4 w-4" />
                        Previous Papers
                      </span>
                      <span className="font-medium">{subject.papers}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!showSubjects && (
            <div className="text-center py-20">
              <BookOpen className="h-20 w-20 mx-auto mb-6 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">
                Select your university, college, branch, and semester to view subjects
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Academics;
