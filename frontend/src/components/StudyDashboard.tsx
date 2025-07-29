import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  BookOpen,
  Clock,
  Award,
  BookMarked,
  FileText,
} from "lucide-react";

interface StudyProgressProps {
  subject: string;
  progress: number;
  color?: string;
}

const StudyProgress = ({
  subject,
  progress,
  color = "bg-primary",
}: StudyProgressProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{subject}</span>
        <span className="text-xs text-muted-foreground">{progress}%</span>
      </div>
      <Progress value={progress} className={color} />
    </div>
  );
};

interface UpcomingExamProps {
  title: string;
  date: string;
  timeLeft: string;
  priority: "high" | "medium" | "low";
}

const UpcomingExam = ({
  title,
  date,
  timeLeft,
  priority,
}: UpcomingExamProps) => {
  const priorityColors = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-card">
      <div className="flex items-center gap-3">
        <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={priorityColors[priority]}>
          {priority}
        </Badge>
        <span className="text-xs font-medium">{timeLeft}</span>
      </div>
    </div>
  );
};

interface RecentMaterialProps {
  title: string;
  type: string;
  lastAccessed: string;
  icon: React.ReactNode;
}

const RecentMaterial = ({
  title,
  type,
  lastAccessed,
  icon,
}: RecentMaterialProps) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg mb-2 bg-card hover:bg-accent/50 cursor-pointer transition-colors">
      <div className="p-2 rounded-md bg-primary/10">{icon}</div>
      <div className="flex-1">
        <h4 className="font-medium truncate">{title}</h4>
        <p className="text-xs text-muted-foreground">{type}</p>
      </div>
      <div className="text-xs text-muted-foreground">{lastAccessed}</div>
    </div>
  );
};

interface StudyDashboardProps {
  studentName?: string;
  studyProgress?: StudyProgressProps[];
  upcomingExams?: UpcomingExamProps[];
  recentMaterials?: RecentMaterialProps[];
}

const StudyDashboard = ({
  studentName = "Alex Johnson",
  studyProgress = [
    { subject: "Mathematics", progress: 75 },
    { subject: "Computer Science", progress: 60 },
    { subject: "Physics", progress: 45 },
    { subject: "English Literature", progress: 90 },
  ],
  upcomingExams = [
    {
      title: "Calculus Midterm",
      date: "Oct 15, 2023",
      timeLeft: "3 days left",
      priority: "high",
    },
    {
      title: "Data Structures Quiz",
      date: "Oct 18, 2023",
      timeLeft: "6 days left",
      priority: "medium",
    },
    {
      title: "Physics Lab Report",
      date: "Oct 25, 2023",
      timeLeft: "13 days left",
      priority: "low",
    },
  ],
  recentMaterials = [
    {
      title: "Calculus Chapter 5 Notes",
      type: "PDF Document",
      lastAccessed: "2h ago",
      icon: <FileText size={18} />,
    },
    {
      title: "Data Structures Lecture Recording",
      type: "Video",
      lastAccessed: "1d ago",
      icon: <BookOpen size={18} />,
    },
    {
      title: "Physics Formulas Flashcards",
      type: "Flashcards",
      lastAccessed: "3d ago",
      icon: <BookMarked size={18} />,
    },
  ],
}: StudyDashboardProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-full bg-background p-6 rounded-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {studentName}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your study progress
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="mr-2">
            <Clock className="mr-2 h-4 w-4" /> Study Timer
          </Button>
          <Button>
            <Award className="mr-2 h-4 w-4" /> Set Goals
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Study Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>
              Track your progress across subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {studyProgress.map((subject, index) => (
              <StudyProgress key={index} {...subject} />
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Subjects
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Exams Card */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>
              Stay prepared for your next assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExams.map((exam, index) => (
              <UpcomingExam key={index} {...exam} />
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Exams
            </Button>
          </CardContent>
        </Card>

        {/* Calendar & Schedule Card */}
        <Card>
          <CardHeader>
            <CardTitle>Study Schedule</CardTitle>
            <CardDescription>Plan your study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="calendar" className="flex-1">
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="schedule" className="flex-1">
                  Schedule
                </TabsTrigger>
              </TabsList>
              <TabsContent value="calendar">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </TabsContent>
              <TabsContent value="schedule">
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-muted rounded-md">
                    <span>9:00 AM</span>
                    <span className="font-medium">Calculus Study</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded-md">
                    <span>11:00 AM</span>
                    <span className="font-medium">Physics Lab Prep</span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded-md">
                    <span>2:00 PM</span>
                    <span className="font-medium">Group Project Meeting</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Materials Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recently Accessed Materials</CardTitle>
          <CardDescription>
            Quick access to your study resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((material, index) => (
              <RecentMaterial key={index} {...material} />
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Materials
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyDashboard;