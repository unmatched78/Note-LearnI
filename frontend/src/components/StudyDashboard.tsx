// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Calendar } from "@/components/ui/calendar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   CalendarIcon,
//   BookOpen,
//   Clock,
//   Award,
//   BookMarked,
//   FileText,
// } from "lucide-react";
// import React from "react";

// interface StudyProgressProps {
//   subject: string;
//   progress: number;
//   color?: string;
// }

// const StudyProgress = ({
//   subject,
//   progress,
//   color = "bg-primary",
// }: StudyProgressProps) => {
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between items-center mb-1">
//         <span className="text-sm font-medium">{subject}</span>
//         <span className="text-xs text-muted-foreground">{progress}%</span>
//       </div>
//       <Progress value={progress} className={color} />
//     </div>
//   );
// };

// interface UpcomingExamProps {
//   title: string;
//   date: string;
//   timeLeft: string;
//   priority: "high" | "medium" | "low";
// }

// const UpcomingExam = ({
//   title,
//   date,
//   timeLeft,
//   priority,
// }: UpcomingExamProps) => {
//   const priorityColors = {
//     high: "bg-red-100 text-red-800",
//     medium: "bg-yellow-100 text-yellow-800",
//     low: "bg-green-100 text-green-800",
//   };

//   return (
//     <div className="flex items-center justify-between p-3 border rounded-lg mb-2 bg-card">
//       <div className="flex items-center gap-3">
//         <CalendarIcon className="h-5 w-5 text-muted-foreground" />
//         <div>
//           <h4 className="font-medium">{title}</h4>
//           <p className="text-xs text-muted-foreground">{date}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-2">
//         <Badge variant="outline" className={priorityColors[priority]}>
//           {priority}
//         </Badge>
//         <span className="text-xs font-medium">{timeLeft}</span>
//       </div>
//     </div>
//   );
// };

// interface RecentMaterialProps {
//   title: string;
//   type: string;
//   lastAccessed: string;
//   icon: React.ReactNode;
// }

// const RecentMaterial = ({
//   title,
//   type,
//   lastAccessed,
//   icon,
// }: RecentMaterialProps) => {
//   return (
//     <div className="flex items-center gap-3 p-3 border rounded-lg mb-2 bg-card hover:bg-accent/50 cursor-pointer transition-colors">
//       <div className="p-2 rounded-md bg-primary/10">{icon}</div>
//       <div className="flex-1">
//         <h4 className="font-medium truncate">{title}</h4>
//         <p className="text-xs text-muted-foreground">{type}</p>
//       </div>
//       <div className="text-xs text-muted-foreground">{lastAccessed}</div>
//     </div>
//   );
// };

// interface StudyDashboardProps {
//   studentName?: string;
//   studyProgress?: StudyProgressProps[];
//   upcomingExams?: UpcomingExamProps[];
//   recentMaterials?: RecentMaterialProps[];
// }

// const StudyDashboard = ({
//   studentName = "Alex Johnson",
//   studyProgress = [
//     { subject: "Mathematics", progress: 75 },
//     { subject: "Computer Science", progress: 60 },
//     { subject: "Physics", progress: 45 },
//     { subject: "English Literature", progress: 90 },
//   ],
//   upcomingExams = [
//     {
//       title: "Calculus Midterm",
//       date: "Oct 15, 2023",
//       timeLeft: "3 days left",
//       priority: "high",
//     },
//     {
//       title: "Data Structures Quiz",
//       date: "Oct 18, 2023",
//       timeLeft: "6 days left",
//       priority: "medium",
//     },
//     {
//       title: "Physics Lab Report",
//       date: "Oct 25, 2023",
//       timeLeft: "13 days left",
//       priority: "low",
//     },
//   ],
//   recentMaterials = [
//     {
//       title: "Calculus Chapter 5 Notes",
//       type: "PDF Document",
//       lastAccessed: "2h ago",
//       icon: <FileText size={18} />,
//     },
//     {
//       title: "Data Structures Lecture Recording",
//       type: "Video",
//       lastAccessed: "1d ago",
//       icon: <BookOpen size={18} />,
//     },
//     {
//       title: "Physics Formulas Flashcards",
//       type: "Flashcards",
//       lastAccessed: "3d ago",
//       icon: <BookMarked size={18} />,
//     },
//   ],
// }: StudyDashboardProps) => {
//   const [date, setDate] = React.useState<Date | undefined>(new Date());

//   return (
//     <div className="w-full bg-background p-6 rounded-xl">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Welcome back, {studentName}</h1>
//           <p className="text-muted-foreground">
//             Here's an overview of your study progress
//           </p>
//         </div>
//         <div className="mt-4 md:mt-0">
//           <Button variant="outline" className="mr-2">
//             <Clock className="mr-2 h-4 w-4" /> Study Timer
//           </Button>
//           <Button>
//             <Award className="mr-2 h-4 w-4" /> Set Goals
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Study Progress Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Study Progress</CardTitle>
//             <CardDescription>
//               Track your progress across subjects
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {studyProgress.map((subject, index) => (
//               <StudyProgress key={index} {...subject} />
//             ))}
//             <Button variant="outline" className="w-full mt-4">
//               View All Subjects
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Upcoming Exams Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Upcoming Exams</CardTitle>
//             <CardDescription>
//               Stay prepared for your next assessments
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {upcomingExams.map((exam, index) => (
//               <UpcomingExam key={index} {...exam} />
//             ))}
//             <Button variant="outline" className="w-full mt-4">
//               View All Exams
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Calendar & Schedule Card */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Study Schedule</CardTitle>
//             <CardDescription>Plan your study sessions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs defaultValue="calendar">
//               <TabsList className="w-full mb-4">
//                 <TabsTrigger value="calendar" className="flex-1">
//                   Calendar
//                 </TabsTrigger>
//                 <TabsTrigger value="schedule" className="flex-1">
//                   Schedule
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value="calendar">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   onSelect={setDate}
//                   className="rounded-md border"
//                 />
//               </TabsContent>
//               <TabsContent value="schedule">
//                 <div className="space-y-2">
//                   <div className="flex justify-between p-2 bg-muted rounded-md">
//                     <span>9:00 AM</span>
//                     <span className="font-medium">Calculus Study</span>
//                   </div>
//                   <div className="flex justify-between p-2 bg-muted rounded-md">
//                     <span>11:00 AM</span>
//                     <span className="font-medium">Physics Lab Prep</span>
//                   </div>
//                   <div className="flex justify-between p-2 bg-muted rounded-md">
//                     <span>2:00 PM</span>
//                     <span className="font-medium">Group Project Meeting</span>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Materials Section */}
//       <Card className="mt-6">
//         <CardHeader>
//           <CardTitle>Recently Accessed Materials</CardTitle>
//           <CardDescription>
//             Quick access to your study resources
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {recentMaterials.map((material, index) => (
//               <RecentMaterial key={index} {...material} />
//             ))}
//           </div>
//           <Button variant="outline" className="w-full mt-4">
//             View All Materials
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default StudyDashboard;

// src/components/StudyDashboard.tsx
import React, { useEffect, useState } from "react";
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
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/api/api";
import { Clock, Award, CalendarIcon, Plus } from "lucide-react";

interface StudyProgressProps {
  subject: string;
  progress: number;
  color?: string;
}
const StudyProgress = ({ subject, progress, color = "bg-primary" }: StudyProgressProps) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium">{subject}</span>
      <span className="text-xs text-muted-foreground">{progress}%</span>
    </div>
    <Progress value={progress} className={color} />
  </div>
);

interface UpcomingExamProps {
  title: string;
  date: string;
  timeLeft: string;
  priority: "high" | "medium" | "low";
}
const UpcomingExam = ({ title, date, timeLeft, priority }: UpcomingExamProps) => {
  const colors = {
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
        <Badge variant="outline" className={colors[priority]}>
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
const RecentMaterial = ({ title, type, lastAccessed, icon }: RecentMaterialProps) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg mb-2 bg-card hover:bg-accent/50 cursor-pointer transition-colors">
    <div className="p-2 rounded-md bg-primary/10">{icon}</div>
    <div className="flex-1">
      <h4 className="font-medium truncate">{title}</h4>
      <p className="text-xs text-muted-foreground">{type}</p>
    </div>
    <div className="text-xs text-muted-foreground">{lastAccessed}</div>
  </div>
);

interface StudyEvent {
  id: number;
  title: string;
  date: string;
  time: string;
}
interface StudyDashboardProps {
  studentName?: string;
  studyProgress?: StudyProgressProps[];
  upcomingExams?: UpcomingExamProps[];
  recentMaterials?: RecentMaterialProps[];
}

export default function StudyDashboard({
  studentName = "Alex Johnson",
  studyProgress = [
    { subject: "Mathematics", progress: 75 },
    { subject: "Computer Science", progress: 60 },
    { subject: "Physics", progress: 45 },
    { subject: "English Literature", progress: 90 },
  ],
  upcomingExams = [
    { title: "Calculus Midterm", date: "Oct 15, 2023", timeLeft: "3 days left", priority: "high" },
    { title: "Data Structures Quiz", date: "Oct 18, 2023", timeLeft: "6 days left", priority: "medium" },
    { title: "Physics Lab Report", date: "Oct 25, 2023", timeLeft: "13 days left", priority: "low" },
  ],
  recentMaterials = [
    { title: "Calculus Chapter 5 Notes", type: "PDF", lastAccessed: "2h ago", icon: <Clock size={18} /> },
    { title: "DS Lecture Recording", type: "Video", lastAccessed: "1d ago", icon: <Award size={18} /> },
    { title: "Physics Flashcards", type: "Flashcards", lastAccessed: "3d ago", icon: <Award size={18} /> },
  ],
}: StudyDashboardProps) {
  const { fetchJson } = useApi();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: date?.toISOString().slice(0, 10) || "",
    time: "12:00",
  });

  // reload whenever the calendar date changes
  useEffect(() => {
    if (!date) return;
    const d = date.toISOString().slice(0, 10);
    fetchJson<StudyEvent[]>(`/events/?date=${d}`)
      .then(setEvents)
      .catch(console.error);
  }, [date, fetchJson]);

  const createEvent = async () => {
    try {
      const payload = {
        title: newEvent.title,
        date: newEvent.date,
        // append seconds
        time: newEvent.time.includes(":") ? newEvent.time + ":00" : newEvent.time,
      };
      await fetchJson<StudyEvent>("/events/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // refresh list for that day
      fetchJson<StudyEvent[]>(`/events/?date=${newEvent.date}`)
        .then(setEvents)
        .catch(console.error);

      // clear title (keep date/time)
      setNewEvent(ns => ({ ...ns, title: "" }));
    } catch (err: any) {
      alert(`Could not save event: ${err.message}`);
    }
  };

  return (
    <div className="w-full bg-background p-6 rounded-xl space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {studentName}</h1>
          <p className="text-muted-foreground">Here's an overview of your study progress</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline"><Clock className="mr-2 h-4 w-4" />Study Timer</Button>
          <Button><Award className="mr-2 h-4 w-4" />Set Goals</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            {studyProgress.map((s, i) => <StudyProgress key={i} {...s} />)}
            <Button variant="outline" className="w-full mt-4">View All Subjects</Button>
          </CardContent>
        </Card>

        {/* Exams */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Stay prepared</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExams.map((e, i) => <UpcomingExam key={i} {...e} />)}
            <Button variant="outline" className="w-full mt-4">View All Exams</Button>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Study Schedule</CardTitle>
            <CardDescription>Plan your sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList className="w-full mb-4">
                <TabsTrigger value="calendar" className="flex-1">Calendar</TabsTrigger>
                <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
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
                <div className="flex justify-between items-center mb-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="mr-1" />Add Event</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>New Study Event</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-2">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={newEvent.title}
                            onChange={e => setNewEvent(ns => ({ ...ns, title: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input
                            type="date"
                            value={newEvent.date}
                            onChange={e => setNewEvent(ns => ({ ...ns, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={newEvent.time}
                            onChange={e => setNewEvent(ns => ({ ...ns, time: e.target.value }))}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Cancel</Button>
                        <Button onClick={createEvent}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                {events.length ? (
                  events.map(ev => (
                    <div key={ev.id} className="flex justify-between p-2 bg-muted rounded-md mb-2">
                      <span>{ev.time}</span>
                      <span className="font-medium">{ev.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No events scheduled.</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Recent Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Accessed</CardTitle>
          <CardDescription>Quick access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((m, i) => <RecentMaterial key={i} {...m} />)}
          </div>
          <Button variant="outline" className="w-full mt-4">View All</Button>
        </CardContent>
      </Card>
    </div>
  );
}
