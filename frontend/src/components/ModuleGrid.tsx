import { useState, ChangeEvent, useMemo } from "react";
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

// Utility: normalize tags safely
const normalizeTags = (tags: string[] | string | undefined): string[] => {
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === "string")
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
};

interface Module {
  id: string;
  title: string | null;
  description: string | null;
  resourceCount: number;
  tags: string[] | string | null;
  lastUpdated: string;
}

interface ModuleGridProps {
  modules?: Module[];
  onCreateModule?: (
    module: Omit<Module, "id" | "lastUpdated" | "resourceCount">
  ) => void;
  onModuleClick?: (moduleId: string) => void;
}

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

export default function ModuleGrid({
  modules = defaultModules,
  onCreateModule = () => {},
  onModuleClick = () => {},
}: ModuleGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const lowerSearch = searchQuery.toLowerCase();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const filtered = useMemo(
    () =>
      modules.filter((m) => {
        const title = (m.title ?? "").toLowerCase();
        const desc = (m.description ?? "").toLowerCase();
        const tagsArr = normalizeTags(m.tags).map((t) =>
          (t ?? "").toLowerCase()
        );
        return (
          title.includes(lowerSearch) ||
          desc.includes(lowerSearch) ||
          tagsArr.some((t) => t.includes(lowerSearch))
        );
      }),
    [modules, lowerSearch]
  );

  const handleCreate = () => {
    const tagsArr = normalizeTags(newModule.tags);
    onCreateModule({
      title: newModule.title,
      description: newModule.description,
      tags: tagsArr,
    });
    setNewModule({ title: "", description: "", tags: "" });
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700">Study Modules</h2>
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 text-white gap-2 hover:bg-indigo-700">
              <PlusCircle size={18} /> Create Module
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Module</DialogTitle>
              <DialogDescription>
                Organize your study materials into a module.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Label htmlFor="mod-title">Title</Label>
              <Input
                id="mod-title"
                placeholder="Module title"
                value={newModule.title}
                onChange={(e) =>
                  setNewModule({ ...newModule, title: e.target.value })
                }
              />
              <Label htmlFor="mod-desc">Description</Label>
              <Textarea
                id="mod-desc"
                placeholder="Brief description"
                value={newModule.description}
                onChange={(e) =>
                  setNewModule({ ...newModule, description: e.target.value })
                }
              />
              <Label htmlFor="mod-tags">Tags</Label>
              <Input
                id="mod-tags"
                placeholder="e.g. math, algebra"
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
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="grid">
        <TabsList>
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>

        {/* Grid */}
        <TabsContent value="grid">
          {filtered.length ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((m) => (
                <Card
                  key={m.id}
                  className="border-l-4 border-indigo-500 hover:shadow-lg transition cursor-pointer"
                  onClick={() => onModuleClick(m.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-indigo-800">
                      {m.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {m.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {normalizeTags(m.tags).map((t, i) => (
                        <Badge
                          key={i}
                          className="bg-indigo-100 text-indigo-800"
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between text-sm text-gray-500">
                    <span>{m.resourceCount} resources</span>
                    <span>Updated {m.lastUpdated}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState onCreate={() => setIsCreateDialogOpen(true)} />
          )}
        </TabsContent>

        {/* List */}
        <TabsContent value="list">
          {filtered.length ? (
            <div className="space-y-4">
              {filtered.map((m) => (
                <Card
                  key={m.id}
                  className="border-l-4 border-indigo-500 hover:shadow-lg transition cursor-pointer"
                  onClick={() => onModuleClick(m.id)}
                >
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="text-indigo-800 font-medium">
                        {m.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {m.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {normalizeTags(m.tags)
                        .slice(0, 3)
                        .map((t, i) => (
                          <Badge
                            key={i}
                            className="bg-indigo-100 text-indigo-800"
                          >
                            {t}
                          </Badge>
                        ))}
                      {normalizeTags(m.tags).length > 3 && (
                        <Badge variant="outline">
                          +{normalizeTags(m.tags).length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState onCreate={() => setIsCreateDialogOpen(true)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-300 rounded-lg">
      <FolderPlus className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        No modules found
      </h3>
      <p className="text-gray-500 mb-4">
        Create your first study module to get started.
      </p>
      <Button
        className="bg-indigo-600 text-white hover:bg-indigo-700"
        onClick={onCreate}
      >
        <PlusCircle className="mr-2" /> Create Module
      </Button>
    </div>
  );
}
