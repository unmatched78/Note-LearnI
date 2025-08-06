// src/components/ResourceSearchModal.tsx
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { List, ListItem } from "@/components/ui/relist";
import { Button } from "@/components/ui/button";
import { useApi } from "@/api/api";
import { X } from "lucide-react";


interface ResourceResult {
  id: number;
  resource_type: string;
  title: string;
  snippet: string;
  created_at: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ResourceResult[];
}

export default function ResourceSearchModal() {
  const { fetchJson } = useApi();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResourceResult[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Ctrl+F only opens
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Fetch a specific page
  const fetchPage = useCallback(
    async (q: string, page: number) => {
      setLoading(true);
      try {
        const url = `/resources/?search=${encodeURIComponent(q)}&page=${page}`;
        const data = await fetchJson<PaginatedResponse>(url);
        setResults((prev) =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setNextPageUrl(data.next);
      } finally {
        setLoading(false);
      }
    },
    [fetchJson]
  );

  // Debounced search on `query` changes
  useEffect(() => {
    // If query is empty, only clear *once* if there was data previously
    if (!query) {
      if (results.length > 0 || nextPageUrl) {
        setResults([]);
        setNextPageUrl(null);
      }
      return;
    }
    const id = setTimeout(() => fetchPage(query, 1), 300);
    return () => clearTimeout(id);
  }, [query, fetchPage, results.length, nextPageUrl]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        <Dialog>
          <DialogHeader className="flex justify-between items-center p-6 pb-2">

            <DialogTitle className="text-xl font-semibold text-indigo-700">
              Search Resources
            </DialogTitle>
            <Button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </Button>
          </DialogHeader>

          <DialogDescription
            className="px-6 text-sm text-gray-600 mb-4"
            id="search-resources-desc"
          >
            Quickly find quizzes, flashcards, summaries, or documents.
          </DialogDescription>
        </Dialog>
        <div className="px-6 mb-4">
          <Input
            autoFocus
            placeholder="Type to search…"
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            className="w-full border-indigo-300 focus:ring-indigo-400"
          />
        </div>

        <div className="px-6 pb-6">
          {loading && results.length === 0 ? (
            <p className="text-center text-indigo-600">Loading…</p>
          ) : results.length > 0 ? (
            <>
              <List className="max-h-64 overflow-y-auto space-y-2 mb-4">
                {results.map((r) => (
                  <ListItem
                    key={`${r.resource_type}-${r.id}`}
                    className="p-3 rounded-lg bg-white hover:bg-indigo-100 transition cursor-pointer flex flex-col shadow-sm"
                    onClick={() => {
                      console.log("Selected:", r);
                      setOpen(false);
                    }}
                  >
                    <span className="text-sm font-medium text-indigo-800 truncate">
                      [{r.resource_type.toUpperCase()}] {r.title}
                    </span>
                    <span className="text-xs text-indigo-600 mt-1 line-clamp-2">
                      {r.snippet}
                    </span>
                  </ListItem>
                ))}
              </List>

              {nextPageUrl && (
                <div className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-indigo-400 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => {
                      const url = new URL(
                        nextPageUrl,
                        window.location.origin
                      );
                      const page =
                        Number(url.searchParams.get("page")) || 1;
                      fetchPage(query, page);
                    }}
                  >
                    {loading ? "Loading…" : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : query ? (
            <p className="text-center text-indigo-600">No results.</p>
          ) : (
            <p className="text-center text-indigo-600">
              Start typing to search…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
