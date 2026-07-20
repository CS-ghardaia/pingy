"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type SearchBarProps = {
  readonly placeholder?: string;
};

export function SearchBar({
  placeholder = "ابحث عن ملف، مقرر، أو نوع محتوى",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  return (
    <label className="relative block w-full max-w-xl">
      <span className="sr-only">البحث</span>
      <Search
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background pr-11 pl-4 text-sm font-semibold text-foreground shadow-sm transition placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/20"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}
