import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  jlptLevels,
  readingTypes,
  testPeriods,
} from "@/modules/reading-list/const";
import { useSearchParams } from "next/navigation";

export function DataTableFilters() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();

  const search = searchParams.get("search") ?? "";
  const isPublic = searchParams.get("isPublic") ?? "all";
  const jlptLevel = searchParams.get("jlptLevel") ?? "all";
  const readingType = searchParams.get("readingType") ?? "all";
  const examCode = searchParams.get("examCode") ?? "all";
  const isJlpt = searchParams.get("isJlpt") ?? "all";

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-1">
        <div>Is JLPT Test</div>
        <Select
          onValueChange={(isJlpt) => {
            setSearchParam({ isJlpt, page: 1 });
          }}
          value={isJlpt}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              <SelectItem value="true">JLPT Test</SelectItem>
              <SelectItem value="false">Not JLPT Test</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div>Reading Type</div>
        <Select
          disabled={isJlpt === "true"}
          onValueChange={(readingType) => {
            setSearchParam({ readingType, page: 1 });
          }}
          value={readingType}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              {readingTypes.map((type) => (
                <SelectItem key={type.value} value={type.value.toString()}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div>Test Period</div>
        <Select
          disabled={isJlpt === "false"}
          onValueChange={(examCode) => {
            setSearchParam({ examCode, page: 1 });
          }}
          value={examCode}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              {testPeriods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div>JLPT Level</div>
        <Select
          onValueChange={(jlptLevel) => {
            setSearchParam({ jlptLevel, page: 1 });
          }}
          value={jlptLevel}
        >
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              {jlptLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <div>Is Public</div>
        <Select
          onValueChange={(isPublic) => {
            setSearchParam({ isPublic, page: 1 });
          }}
          value={isPublic}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>All</SelectItem>
              <SelectItem value="true">Public</SelectItem>
              <SelectItem value="false">Not Public</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Input
        className="w-[200px]"
        value={search}
        onChange={(e) => {
          setSearchParam({ search: e.target.value, page: 1 });
        }}
        type="search"
        placeholder="Search..."
      />
    </div>
  );
}
