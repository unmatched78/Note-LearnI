// export default ModuleGrid;
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Safe utility to normalize tags
const normalizeTags = (tags: string[] | string | undefined): string[] => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") return tags.split(",").map((tag) => tag.trim());
  return [];
};

interface Module {
  id: string;
  title: string;
  description: string;
  resourceCount: number;
  tags: string[] | string;
  lastUpdated: string;
}

interface ModuleGridProps {
  modules?: Module[];
  onCreateModule?: (
    module: Omit<Module, "id" | "lastUpdated" | "resourceCount">
  ) => void;
  onModuleClick?: (moduleId: string) => void;
}

const ModuleGrid = ({
  modules = defaultModules,
  onCreateModule = () => {},
  onModuleClick = () => {},
}: ModuleGridProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const filteredModules = modules.filter((module) => {
    const tagsArray = normalizeTags(module.tags);
    return (
      module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tagsArray.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  });

  const handleCreateModule = () => {
    const tagsArray = normalizeTags(newModule.tags);
    onCreateModule({
      title: newModule.title,
      description: newModule.description,
      tags: tagsArray,
    });
    setNewModule({ title: "", description: "", tags: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="w-full bg-background p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Study Modules</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle size={18} />
              Create Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Create a new study module to organize your learning materials.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Module title"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of this module"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
              />
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="math, calculus, algebra"
                value={newModule.tags}
                onChange={(e) =>
                  setNewModule({ ...newModule, tags: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateModule}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search modules by title, description or tags"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="mt-4">
          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module) => (
                <Card
                  key={module.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => onModuleClick(module.id)}
                >
                  <CardHeader>
                    <CardTitle>{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {normalizeTags(module.tags).map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-muted-foreground">
                    <span>{module.resourceCount} resources</span>
                    <span>Updated {module.lastUpdated}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState searchQuery={searchQuery} onCreate={() => setIsCreateDialogOpen(true)} />
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          {filteredModules.length > 0 ? (
            <div className="space-y-2">
              {filteredModules.map((module) => {
                const tags = normalizeTags(module.tags);
                return (
                  <Card
                    key={module.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onModuleClick(module.id)}
                  >
                    <div className="flex items-center p-4 justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {module.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-wrap gap-1">
                          {tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                          {tags.length > 2 && (
                            <Badge variant="outline">+{tags.length - 2}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {module.resourceCount} resources
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <EmptyState searchQuery={searchQuery} onCreate={() => setIsCreateDialogOpen(true)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ searchQuery, onCreate }: { searchQuery: string; onCreate: () => void }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed">
    <FolderPlus className="h-12 w-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium mb-2">No modules found</h3>
    <p className="text-muted-foreground mb-4">
      {searchQuery
        ? "No modules match your search criteria."
        : "Create your first module to get started."}
    </p>
    {!searchQuery && (
      <Button onClick={onCreate}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Module
      </Button>
    )}
  </div>
);

const defaultModules: Module[] = [
  {
    id: "1",
    title: "Calculus I",
    description: "Limits, derivatives, and integrals",
    resourceCount: 12,
    tags: ["math", "calculus", "derivatives"],
    lastUpdated: "2 days ago",
  },
  {
    id: "2",
    title: "Psychology Basics",
    description: "Theories and schools of thought",
    resourceCount: 8,
    tags: ["psychology", "mind", "behavior"],
    lastUpdated: "1 week ago",
  },
];

export default ModuleGrid;
