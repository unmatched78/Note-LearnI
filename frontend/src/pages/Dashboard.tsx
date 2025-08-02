// // src/pages/HomePage.tsx
// import React, { useState, useEffect } from "react";
// import { useUser, useAuth } from '@clerk/clerk-react';
// import { useApi } from '@/api/api';
// import ModuleGrid from "@/components/ModuleGrid";
// import StudyDashboard from "@/components/StudyDashboard";
// import AIToolsPanel from "@/components/AIToolsPanel";
// import { Link } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   BookOpen,
//   FileText,
//   Zap,
//   Settings,
//   User,
//   LogOut,
//   Bell,
//   HelpCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// interface Module {
//   id: number;
//   title: string;
//   code: string;
//   created_at: string;
// }

// interface Document {
//   id: number;
//   title: string;
//   file: string;
//   created_at: string;
// }

// const HomePage: React.FC = () => {
//   const { isLoaded, user } = useUser();
//   const { signOut } = useAuth();
//   const { fetchJson } = useApi();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [newModule, setNewModule] = useState({
//     title: "",
//     description: "",
//     tags: "",
//     subject: "",
//   });
//   const [modules, setModules] = useState<Module[]>([]);
//   const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
//   const [selectedSubject, setSelectedSubject] = useState("All Subjects");
//   const [selectedSemester, setSelectedSemester] = useState("This Semester");

//   useEffect(() => {
//     if (isLoaded && user) {
//       loadModules();
//       loadRecentDocuments();
//     }
//   }, [isLoaded, user]);

//   const loadModules = async () => {
//     try {
//       const data = await fetchJson<{ results: Module[] }>("/modules/");
//       setModules(data.results);
//     } catch (err) {
//       console.error("Error loading modules", err);
//     }
//   };

//   const loadRecentDocuments = async () => {
//     try {
//       const data = await fetchJson<{ results: Document[] }>("/documents/");
//       setRecentDocuments(data.results.slice(0, 5));
//     } catch (err) {
//       console.error("Error loading documents", err);
//     }
//   };

//   const handleCreateModule = async () => {
//     try {
//       const created = await fetchJson<Module>("/modules/", {
//         method: 'POST',
//         body: JSON.stringify(newModule),
//       });
//       setModules([created, ...modules]);
//       setNewModule({ title: "", description: "", tags: "", subject: "" });
//       setIsCreateModuleOpen(false);
//     } catch (err) {
//       console.error("Create module failed", err);
//       alert("Failed to create module");
//     }
//   };

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // implement search or filter locally
//   };

//   const handleSettingsSave = () => {
//     // implement settings save
//     setIsSettingsOpen(false);
//   };

//   const handleProfileClick = () => {
//     // navigate to profile
//   };

//   const handleNotificationClick = () => {
//     // show notifications
//   };

//   const handleHelpClick = () => {
//     // show help
//   };

//   const handleModuleClick = (moduleId: string) => {
//     // navigate to module detail
//   };

//   const handleResourceClick = (resourceId: string) => {
//     // navigate to resource viewer
//   };

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="flex h-screen bg-background">
//       {/* Sidebar */}
//       <div className="w-64 border-r bg-card p-4 flex flex-col">
//         <div className="flex items-center gap-2 mb-8">
//           <BookOpen className="h-6 w-6 text-primary" />
//           <h1 className="text-xl font-bold">StudyHub</h1>
//         </div>

//         <nav className="space-y-2 flex-1">
//           <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
//             <FileText size={18} />
//             <span>My Modules</span>
//           </Link>
//           <Link to="/resources" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
//             <BookOpen size={18} />
//             <span>Resources</span>
//           </Link>
//           <Link to="/ai-tools" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
//             <Zap size={18} />
//             <span>AI Tools</span>
//           </Link>
//         </nav>

//         <div className="mt-auto pt-4 border-t">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="w-full justify-start p-3">
//                 <Avatar className="h-8 w-8 mr-3">
//                   <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=student" alt="User" />
//                   <AvatarFallback>ST</AvatarFallback>
//                 </Avatar>
//                 <div className="text-left">
//                   <p className="text-sm font-medium">{user?.fullName || user?.username}</p>
//                   <p className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
//                 </div>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{user?.fullName || user?.username}</p>
//                   <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={handleProfileClick}><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
//               <DropdownMenuItem onClick={handleHelpClick}><HelpCircle className="mr-2 h-4 w-4" /><span>Help & Support</span></DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => signOut()}><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Header */}
//         <header className="border-b p-4 flex items-center justify-between bg-card">
//           <form onSubmit={handleSearch} className="relative w-96">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input placeholder="Search modules, resources, notes..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
//           </form>

//           <div className="flex items-center gap-2">
//             <TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm" onClick={handleNotificationClick}><Bell className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Notifications</p></TooltipContent></Tooltip></TooltipProvider>
//             <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}><Settings className="h-4 w-4 mr-2" />Settings</Button>
//             <Dialog open={isCreateModuleOpen} onOpenChange={setIsCreateModuleOpen}><DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-2" />New Module</Button></DialogTrigger><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Create New Module</DialogTitle><DialogDescription>Create a new study module to organize your learning materials.</DialogDescription></DialogHeader><div className="grid gap-4 py-4"><Label htmlFor="module-title">Title</Label><Input id="module-title" placeholder="Module title" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} /><Label htmlFor="module-subject">Subject</Label><Select value={newModule.subject} onValueChange={value => setNewModule({ ...newModule, subject: value })}><SelectTrigger><SelectValue placeholder="Select a subject" /></SelectTrigger><SelectContent><SelectItem value="mathematics">Mathematics</SelectItem><SelectItem value="computer-science">Computer Science</SelectItem><SelectItem value="physics">Physics</SelectItem><SelectItem value="chemistry">Chemistry</SelectItem><SelectItem value="biology">Biology</SelectItem><SelectItem value="history">History</SelectItem><SelectItem value="literature">Literature</SelectItem><SelectItem value="psychology">Psychology</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select><Label htmlFor="module-description">Description</Label><Textarea id="module-description" placeholder="Brief description of this module" value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} /><Label htmlFor="module-tags">Tags (comma separated)</Label><Input id="module-tags" placeholder="math, calculus, algebra" value={newModule.tags} onChange={e => setNewModule({ ...newModule, tags: e.target.value })} /></div><DialogFooter><Button variant="outline" onClick={() => setIsCreateModuleOpen(false)}>Cancel</Button><Button onClick={handleCreateModule} disabled={!newModule.title}>Create Module</Button></DialogFooter></DialogContent></Dialog>
//             <Button variant="ghost" size="icon" onClick={() => signOut()}><LogOut /></Button>
//           </div>
//         </header>

//         {/* Content Area */}
//         <div className="flex-1 overflow-auto p-6">
//           <div className="max-w-7xl mx-auto">
//             <Tabs defaultValue="dashboard" className="w-full">
//               <div className="flex justify-between items-center mb-6">
//                 <TabsList><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="modules">Modules</TabsTrigger><TabsTrigger value="recent">Recent Resources</TabsTrigger></TabsList>
//                 <div className="flex gap-2"><Select value={selectedSubject} onValueChange={setSelectedSubject}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All Subjects">All Subjects</SelectItem></SelectContent></Select><Select value={selectedSemester} onValueChange={setSelectedSemester}><SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="This Semester">This Semester</SelectItem><SelectItem value="Fall 2023">Fall 2023</SelectItem><SelectItem value="Spring 2023">Spring 2023</SelectItem><SelectItem value="Summer 2023">Summer 2023</SelectItem><SelectItem value="All Time">All Time</SelectItem></SelectContent></Select></div>
//               </div>

//               <TabsContent value="dashboard" className="space-y-6"><StudyDashboard /><div className="grid grid-cols-1 lg:grid-cols-3 gap-6"><div className="lg:col-span-2"><Card><CardHeader><CardTitle>Recent Modules</CardTitle><CardDescription>Your recently accessed study modules</CardDescription></CardHeader><CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{modules.slice(0, 4).map((m, i) => (<Card key={m.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => handleModuleClick(`module-${i}`)}><CardHeader className="p-4"><CardTitle className="text-base">{m.title}</CardTitle><CardDescription className="text-xs">Last accessed 2 days ago</CardDescription></CardHeader><CardFooter className="p-4 pt-0 flex justify-between"><Badge variant="secondary" className="text-xs">{3 + i} Resources</Badge><span className="text-xs text-muted-foreground">Progress: {20 * i}%</span></CardFooter></Card>))}</div></CardContent></Card></div><div><AIToolsPanel /></div></div></TabsContent>

//               <TabsContent value="modules"><ModuleGrid modules={modules} onModuleClick={handleModuleClick} onCreateModule={(module) => console.log('Creating module from grid', module)} /></TabsContent>

//               <TabsContent value="recent"><Card><CardHeader><CardTitle>Recent Resources</CardTitle><CardDescription>Your recently accessed study materials</CardDescription></CardHeader><CardContent><div className="space-y-4">{recentDocuments.map((doc, i) => (<div key={doc.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors" onClick={() => handleResourceClick(`resource-${i}`)}><div className="bg-primary/10 p-2 rounded"><FileText className="h-6 w-6 text-primary" /></div><div className="flex-1"><h4 className="font-medium">{doc.title}</h4><p className="text-sm text-muted-foreground">Module {Math.ceil((i + 1) / 2)}: Introduction to Subject</p></div><Badge variant="outline">{["PDF", "DOCX", "PPT", "TXT", "Video"][i]}</Badge><span className="text-xs text-muted-foreground">Accessed {i + 1} day{i > 0 ? 's' : ''} ago</span></div>))}</div></CardContent></Card></TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>

//       {/* Settings Dialog */}
//       <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}><DialogContent className="sm:max-w-[425px]"><DialogHeader><DialogTitle>Settings</DialogTitle><DialogDescription>Manage your account settings and preferences.</DialogDescription></DialogHeader><div className="grid gap-4 py-4"><div className="grid gap-2"><Label htmlFor="display-name">Display Name</Label><Input id="display-name" defaultValue={user?.fullName || user?.username} placeholder="Your display name" /></div><div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue={user?.primaryEmailAddress?.emailAddress} placeholder="Your email address" /></div><div className="grid gap-2"><Label htmlFor="notifications">Notification Preferences</Label><Select defaultValue="all"><SelectTrigger><SelectValue placeholder="Select notification preference" /></SelectTrigger><SelectContent><SelectItem value="all">All notifications</SelectItem><SelectItem value="important">Important only</SelectItem><SelectItem value="none">None</SelectItem></SelectContent></Select></div><div className="grid gap-2"><Label htmlFor="theme">Theme</Label><Select defaultValue="system"><SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger><SelectContent><SelectItem value="light">Light</SelectItem><SelectItem value="dark">Dark</SelectItem><SelectItem value="system">System</SelectItem></SelectContent></Select></div></div><DialogFooter><Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button><Button onClick={handleSettingsSave}>Save Changes</Button></DialogFooter></DialogContent></Dialog>
//     </div>
//   );
// };

// export default HomePage;

// // /**
// //  * Backend endpoints used:
// //  * GET /api/modules/           -> list modules
// //  * POST /api/modules/          -> create module
// //  * GET /api/documents/         -> list documents
// //  * GET /api/attempts/          -> list quiz attempts
// //  */
// src/pages/HomePage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useApi } from "@/api/api";
import ModuleGrid from "@/components/ModuleGrid";
import StudyDashboard from "@/components/StudyDashboard";
import AIToolsPanel from "@/components/AIToolsPanel";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Zap,
  Settings,
  User,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogDescription } from "@/components/ui/dialog";

interface Module { id: number; title: string; code: string; created_at: string; }
interface Document { id: number; title: string; file: string; created_at: string; }

const HomePage: React.FC = () => {
  const { isLoaded, user } = useUser();
  const { signOut } = useAuth();
  const { fetchJson } = useApi();

  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    tags: "",
    subject: "",
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedSemester, setSelectedSemester] = useState("This Semester");

  useEffect(() => {
    if (isLoaded && user) {
      loadModules();
      loadRecentDocuments();
    }
  }, [isLoaded, user]);

  const loadModules = async () => {
    try {
      const data = await fetchJson<{ results: Module[] }>("/modules/");
      setModules(data.results);
    } catch (err) {
      console.error(err);
    }
  };
  const loadRecentDocuments = async () => {
    try {
      const data = await fetchJson<{ results: Document[] }>("/documents/");
      setRecentDocuments(data.results.slice(0, 5));
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreateModule = async () => {
    try {
      const created = await fetchJson<Module>("/modules/", {
        method: "POST",
        body: JSON.stringify(newModule),
      });
      setModules([created, ...modules]);
      setNewModule({ title: "", description: "", tags: "", subject: "" });
      setIsCreateModuleOpen(false);
    } catch {
      alert("Failed to create module");
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };
  const handleSettingsSave = () => setIsSettingsOpen(false);
  const handleProfileClick = () => {};
  const handleNotificationClick = () => {};
  const handleHelpClick = () => {};
  const handleModuleClick = (id: string) => {};
  const handleResourceClick = (id: string) => {};

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h1 className="text-xl font-bold text-indigo-700">StudyHub</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded border-l-4 border-indigo-500 bg-indigo-50 text-indigo-700"
          >
            <FileText size={18} />
            My Modules
          </Link>
          <Link
            to="/resources"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <BookOpen size={18} />
            Resources
          </Link>
          <Link
            to="/ai-tools"
            className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted transition-colors text-muted-foreground"
          >
            <Zap size={18} /> AI Tools
          </Link>
        </nav>
        <div className="mt-auto pt-4 border-t">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-3">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=student"
                    alt="User"
                  />
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHelpClick}>
                <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="border-b p-4 flex items-center justify-between bg-card">
          <form onSubmit={handleSearch} className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search modules, resources, notes..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNotificationClick}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Dialog
              open={isCreateModuleOpen}
              onOpenChange={setIsCreateModuleOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm" className="bg-indigo-600 text-white">
                  <Plus className="h-4 w-4 mr-2" /> New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                  <DialogDescription>
                    Create a new study module to organize your learning materials.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Label htmlFor="module-title">Title</Label>
                  <Input
                    id="module-title"
                    placeholder="Module title"
                    value={newModule.title}
                    onChange={(e) =>
                      setNewModule({ ...newModule, title: e.target.value })
                    }
                  />
                  <Label htmlFor="module-subject">Subject</Label>
                  <Select
                    value={newModule.subject}
                    onValueChange={(value) =>
                      setNewModule({ ...newModule, subject: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* ...items */}
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="module-description">Description</Label>
                  <Textarea
                    id="module-description"
                    placeholder="Brief description"
                    value={newModule.description}
                    onChange={(e) =>
                      setNewModule({ ...newModule, description: e.target.value })
                    }
                  />
                  <Label htmlFor="module-tags">Tags (comma separated)</Label>
                  <Input
                    id="module-tags"
                    placeholder="math, calculus"
                    value={newModule.tags}
                    onChange={(e) =>
                      setNewModule({ ...newModule, tags: e.target.value })
                    }
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleCreateModule} disabled={!newModule.title}>
                    Create Module
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut()}
              className="hover:bg-red-100"
            >
              <LogOut className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="dashboard">
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="modules">Modules</TabsTrigger>
                  <TabsTrigger value="recent">Recent Resources</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Select
                    value={selectedSubject}
                    onValueChange={setSelectedSubject}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Subjects">All Subjects</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={selectedSemester}
                    onValueChange={setSelectedSemester}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="This Semester">This Semester</SelectItem>
                      <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                      <SelectItem value="Spring 2025">Spring 2025</SelectItem>
                      <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                      <SelectItem value="All Time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="dashboard" className="space-y-6">
                <StudyDashboard />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="border-l-4 border-indigo-500 hover:shadow-lg">
                      <CardHeader>
                        <CardTitle>Recent Modules</CardTitle>
                        <CardDescription>Your recently accessed modules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {modules.slice(0, 4).map((m, i) => (
                            <Card
                              key={m.id}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleModuleClick(`${m.id}`)}
                            >
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">{m.title}</CardTitle>
                                <CardDescription className="text-xs">
                                  Last accessed 2 days ago
                                </CardDescription>
                              </CardHeader>
                              <CardFooter className="p-4 pt-0 flex justify-between">
                                <Badge className="bg-indigo-100 text-indigo-800 text-xs">
                                  {3 + i} Resources
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  Progress: {20 * i}%
                                </span>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div>
                    <AIToolsPanel />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="modules">
                <ModuleGrid
                  modules={modules.map((m) => ({
                    id: m.id.toString(),
                    title: m.title,
                    description: m.code,
                    resourceCount: 0,
                    tags: "",
                    lastUpdated: m.created_at,
                  }))}
                  onModuleClick={(id) => handleModuleClick(id)}
                  onCreateModule={(mod) => console.log(mod)}
                />
              </TabsContent>

              <TabsContent value="recent">
                <Card className="border-l-4 border-blue-500 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Recent Resources</CardTitle>
                    <CardDescription>Your recently accessed materials</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentDocuments.map((doc, i) => (
                        <div
                          key={doc.id}
                          className="flex items-center gap-4 p-3 bg-blue-50 rounded hover:bg-blue-100 transition"
                          onClick={() => handleResourceClick(`${doc.id}`)}
                        >
                          <div className="bg-blue-200 p-2 rounded">
                            <FileText className="h-6 w-6 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{doc.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              Module Intro
                            </p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            PDF
                          </Badge>
                          <span className="text-xs text-gray-600">
                            Accessed {i + 1} day{ i > 0 ? "s" : "" } ago
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                defaultValue={user?.fullName || user?.username}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.primaryEmailAddress?.emailAddress}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notifications">Notification Preferences</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSettingsSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
