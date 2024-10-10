import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { questionTypes } from "@/modules/question-master/const";
import { jlptLevels } from "@/modules/reading-list/const";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function DataTableFilters() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();
  const [searchText, setSearchText] = useState("");

  const jlptLevel = searchParams.get("jlptLevel") ?? "N3";
  const type = searchParams.get("type") ?? "all";
  const source = searchParams.get("source") ?? "all";

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-1">
        <div>Source</div>
        <Select
          onValueChange={(source) => {
            setSearchParam({ source, page: 1 });
          }}
          value={source}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All</SelectItem>
            <SelectItem value="JLPT">JLPT</SelectItem>
            <SelectItem value="BaseDict">BaseDict</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div>Reading Type</div>
        <Select
          onValueChange={(type) => {
            setSearchParam({ type, page: 1 });
          }}
          value={type}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All</SelectItem>
            {questionTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label>Jlpt Level</label>
        <Select
          onValueChange={(jlptLevel) => {
            setSearchParam({ jlptLevel, page: 1 });
          }}
          value={jlptLevel}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              {jlptLevels.map(({ value }) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        className="w-[200px]"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setSearchParam({ search: e.target.value, page: 1 });
        }}
        type="search"
        placeholder="Search..."
      />
    </div>
  );
}
