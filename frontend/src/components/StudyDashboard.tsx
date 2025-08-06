import { useEffect, useState, useMemo, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/api/api";
import { Clock, Award } from "lucide-react";

interface StudyEvent { id: number; title: string; datetime: string; }
interface Material { id: number; title: string; type: string; lastAccessed: string; }
interface ModuleProgress { moduleId: string; title: string; score: number; }

export default function StudyDashboard() {
  const { fetchJson } = useApi();
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [progressData, setProgressData] = useState<ModuleProgress[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDatetime, setNewEventDatetime] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState({ events: false, materials: false, progress: false });

  useEffect(() => {
    loadEvents(); loadMaterials(); loadProgress();
  }, []);

  async function loadEvents() {
    setLoading(l => ({ ...l, events: true })); setErrorMsg(null);
    try {
      const raw = await fetchJson<any>("/events/");
      setEvents(Array.isArray(raw) ? raw : raw.results || []);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(l => ({ ...l, events: false }));
    }
  }
  async function loadMaterials() {
    setLoading(l => ({ ...l, materials: true })); setErrorMsg(null);
    try {
      const raw = await fetchJson<any>("/documents/");
      setMaterials(Array.isArray(raw) ? raw : raw.results || []);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(l => ({ ...l, materials: false }));
    }
  }
  async function loadProgress() {
    setLoading(l => ({ ...l, progress: true })); setErrorMsg(null);
    try {
      const raw = await fetchJson<any>("/modules/progress/");
      setProgressData(Array.isArray(raw) ? raw : raw.results || []);
    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(l => ({ ...l, progress: false }));
    }
  }

  async function handleCreateEvent() {
    if (!newEventTitle || !newEventDatetime) return;
    setErrorMsg(null);
    try {
      await fetchJson("/events/", {
        method: "POST",
        body: JSON.stringify({ title: newEventTitle, datetime: newEventDatetime }),
      });
      setNewEventTitle("");
      setNewEventDatetime(new Date().toISOString().slice(0,16));
      loadEvents();
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  }

  const upcoming = useMemo(() =>
    events.filter(e => new Date(e.datetime) >= new Date())
      .sort((a,b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
      .slice(0,5),
    [events]
  );
  const recentMaterials = useMemo(() =>
    [...materials].sort((a,b)=> 
      new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime()
    ).slice(0,6),
    [materials]
  );
  const topModules = useMemo(() =>
    [...progressData].sort((a,b)=> b.score - a.score).slice(0,5),
    [progressData]
  );

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-3 bg-red-200 text-red-900 rounded">{errorMsg}</div>
      )}

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700">Welcome back</h1>
          <p className="text-gray-600">Here’s an overview of your study progress</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 shadow-md transition">
            <Clock className="mr-2"/> Timer
          </Button>
          <Button className="bg-purple-100 text-purple-800 hover:bg-purple-200 shadow-md transition">
            <Award className="mr-2"/> Goals
          </Button>
        </div>
      </header>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-indigo-500 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-indigo-600">Study Progress</CardTitle>
            <CardDescription>Track your performance</CardDescription>
          </CardHeader>
          <CardContent>
            {topModules.length ? (
              topModules.map(m => (
                <StudyProgress key={m.moduleId} subject={m.title} progress={m.score}/>
              ))
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
              View Modules
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-yellow-500 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-yellow-600">Upcoming Events</CardTitle>
            <CardDescription>Next study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.events ? (
              <p className="text-gray-500">Loading...</p>
            ) : upcoming.length ? (
              upcoming.map(e => (
                <div
                  key={e.id}
                  className="flex justify-between bg-yellow-50 p-2 rounded"
                >
                  <span className="text-yellow-800">
                    {new Date(e.datetime).toLocaleTimeString()}
                  </span>
                  <span className="font-medium text-yellow-900">{e.title}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events</p>
            )}
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-yellow-600 text-white hover:bg-yellow-700 animate-pulse">
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Label>Title</Label>
                  <Input
                    value={newEventTitle}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewEventTitle(e.target.value)
                    }
                  />
                  <Label>Date & Time</Label>
                  <Input
                    type="datetime-local"
                    value={newEventDatetime}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewEventDatetime(e.target.value)
                    }
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleCreateEvent}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="border-l-4 border-green-500 hover:shadow-lg transition">
          <CardHeader>
            <CardTitle className="text-green-600">Study Schedule</CardTitle>
            <CardDescription>Calendar & list</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calendar">
              <TabsList>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <TabsContent value="calendar">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  className="border"
                />
              </TabsContent>
              <TabsContent value="list">
                <div className="space-y-2">
                  {events
                    .filter(
                      (e) =>
                        new Date(e.datetime).toDateString() ===
                        selectedDate.toDateString()
                    )
                    .map((e) => (
                      <div
                        key={e.id}
                        className="flex justify-between bg-green-50 p-2 rounded"
                      >
                        <span className="text-green-800">
                          {new Date(e.datetime).toLocaleTimeString()}
                        </span>
                        <span className="font-medium text-green-900">
                          {e.title}
                        </span>
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Materials */}
      <Card className="border-l-4 border-blue-500 hover:shadow-lg transition">
        <CardHeader>
          <CardTitle className="text-blue-600">Recently Accessed</CardTitle>
          <CardDescription>Quick resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentMaterials.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded"
              >
                <Badge className="bg-blue-200 text-blue-800">{m.type}</Badge>
                <div className="flex-1">{m.title}</div>
                <div className="text-gray-600 text-xs">{m.lastAccessed}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
            View Materials
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

const StudyProgress = ({
  subject,
  progress,
}: {
  subject: string;
  progress: number;
}) => (
  <div className="mb-3">
    <div className="flex justify-between mb-1">
      <span className="text-gray-700 font-medium">{subject}</span>
      <span className="text-gray-600 text-sm">{progress}%</span>
    </div>
    <Progress value={progress} className="bg-gradient-to-r from-indigo-500 to-purple-500" />
  </div>
);
