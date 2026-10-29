"use client";

import React, { createContext, useContext, useState } from "react";

interface FilterContextType {
  selectedClass: string;
  setSelectedClass: (cls: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  gradeNumber: number | null;
}

const FilterContext = createContext<FilterContextType>({
  selectedClass: "all",
  setSelectedClass: () => {},
  searchTerm: "",
  setSearchTerm: () => {},
  gradeNumber: null,
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const gradeMatch = selectedClass.match(/^cls-(\d+)/);
  const gradeNumber = gradeMatch
    ? parseInt(gradeMatch[1], 10)
    : selectedClass === "cls-1a"
    ? 1
    : selectedClass === "cls-2a"
    ? 2
    : selectedClass === "cls-3a"
    ? 3
    : selectedClass === "cls-4a"
    ? 4
    : selectedClass === "cls-5a"
    ? 5
    : null;

  return (
    <FilterContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        searchTerm,
        setSearchTerm,
        gradeNumber,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}
