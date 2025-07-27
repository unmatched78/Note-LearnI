import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Plus,
  BookOpen,
  FileText,
  Zap,
  Calendar,
  Settings,
  User,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";
import ModuleGrid from "./ModuleGrid";
import StudyDashboard from "./StudyDashboard";
import AIToolsPanel from "./AIToolsPanel";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    tags: "",
    subject: "",
  });
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedSemester, setSelectedSemester] = useState("This Semester");

  const handleCreateModule = () => {
    console.log("Creating module:", newModule);
    // Here you would typically send the data to your backend
    setNewModule({ title: "", description: "", tags: "", subject: "" });
    setIsCreateModuleOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const handleSettingsSave = () => {
    console.log("Settings saved");
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    // Implement logout functionality
  };

  const handleProfileClick = () => {
    console.log("Opening profile...");
    // Implement profile navigation
  };

  const handleNotificationClick = () => {
    console.log("Opening notifications...");
    // Implement notifications
  };

  const handleHelpClick = () => {
    console.log("Opening help...");
    // Implement help/support
  };

  const handleModuleClick = (moduleId: string) => {
    console.log("Opening module:", moduleId);
    // Navigate to module detail view
  };

  const handleResourceClick = (resourceId: string) => {
    console.log("Opening resource:", resourceId);
    // Navigate to resource viewer
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">StudyHub</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-primary/10 text-primary font-medium"
          >
            <FileText size={18} />
            <span>My Modules</span>
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
                  <p className="text-sm font-medium">Student Name</p>
                  <p className="text-xs text-muted-foreground">
                    student@example.com
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Student Name
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    student@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleHelpClick}>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b p-4 flex items-center justify-between bg-card">
          <form onSubmit={handleSearch} className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Module
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Module</DialogTitle>
                  <DialogDescription>
                    Create a new study module to organize your learning
                    materials.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="module-title">Title</Label>
                    <Input
                      id="module-title"
                      placeholder="Module title"
                      value={newModule.title}
                      onChange={(e) =>
                        setNewModule({ ...newModule, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
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
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="computer-science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="psychology">Psychology</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="module-description">Description</Label>
                    <Textarea
                      id="module-description"
                      placeholder="Brief description of this module"
                      value={newModule.description}
                      onChange={(e) =>
                        setNewModule({
                          ...newModule,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="module-tags">Tags (comma separated)</Label>
                    <Input
                      id="module-tags"
                      placeholder="math, calculus, algebra"
                      value={newModule.tags}
                      onChange={(e) =>
                        setNewModule({ ...newModule, tags: e.target.value })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateModuleOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateModule}
                    disabled={!newModule.title}
                  >
                    Create Module
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="dashboard" className="w-full">
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
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Computer Science">
                        Computer Science
                      </SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Literature">Literature</SelectItem>
                      <SelectItem value="Psychology">Psychology</SelectItem>
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
                      <SelectItem value="This Semester">
                        This Semester
                      </SelectItem>
                      <SelectItem value="Fall 2023">Fall 2023</SelectItem>
                      <SelectItem value="Spring 2023">Spring 2023</SelectItem>
                      <SelectItem value="Summer 2023">Summer 2023</SelectItem>
                      <SelectItem value="All Time">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <TabsContent value="dashboard" className="space-y-6">
                <StudyDashboard />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Modules</CardTitle>
                        <CardDescription>
                          Your recently accessed study modules
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <Card
                              key={i}
                              className="cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleModuleClick(`module-${i}`)}
                            >
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">
                                  Module {i}: Introduction to Subject
                                </CardTitle>
                                <CardDescription className="text-xs">
                                  Last accessed 2 days ago
                                </CardDescription>
                              </CardHeader>
                              <CardFooter className="p-4 pt-0 flex justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {3 + i} Resources
                                </Badge>
                                <span className="text-xs text-muted-foreground">
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
                  onModuleClick={handleModuleClick}
                  onCreateModule={(module) => {
                    console.log("Creating module from grid:", module);
                    // Handle module creation from ModuleGrid
                  }}
                />
              </TabsContent>

              <TabsContent value="recent">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Resources</CardTitle>
                    <CardDescription>
                      Your recently accessed study materials
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                          onClick={() => handleResourceClick(`resource-${i}`)}
                        >
                          <div className="bg-primary/10 p-2 rounded">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">
                              Resource Document {i}.pdf
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Module {Math.ceil(i / 2)}: Introduction to Subject
                            </p>
                          </div>
                          <Badge variant="outline">
                            {["PDF", "DOCX", "PPT", "TXT", "Video"][i - 1]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Accessed {i} day{i > 1 ? "s" : ""} ago
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
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                defaultValue="Student Name"
                placeholder="Your display name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="student@example.com"
                placeholder="Your email address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notifications">Notification Preferences</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select notification preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All notifications</SelectItem>
                  <SelectItem value="important">Important only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="theme">Theme</Label>
              <Select defaultValue="system">
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
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
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSettingsSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;