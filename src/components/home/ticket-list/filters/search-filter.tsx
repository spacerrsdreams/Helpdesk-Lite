import { useSearchTerm, useSetSearchTerm } from "@/stores/tickets.store";
import { Search } from "@/components/icons";
import { Input } from "@/components/ui/input";

export function SearchFilter() {
  const searchTerm = useSearchTerm();
  const setSearchTerm = useSetSearchTerm();

  return (
    <div className="relative mb-4">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder="Search tickets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
        aria-label="Search tickets by title, content, ID, status, or author"
      />
    </div>
  );
}
