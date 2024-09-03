import { useUrlSearchParams } from "@/hooks/useUrlSearchParams";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { jlptLevels, readingTypeMap } from "@/modules/reading-list/const";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import { getRequest } from "@/service/data";

export function DataTableFilters() {
  const searchParams = useSearchParams();
  const setSearchParam = useUrlSearchParams();

  const { data: testPeriods = [] } = useSWR<TTestPeriod[]>(
    "/v1/exams/jlpt",
    getRequest
  );

  // const isPublic = searchParams.get("isPublic") ?? "all";
  const examId = searchParams.get("examId") ?? "all";
  const search = searchParams.get("search") ?? "";
  const jlptLevel = searchParams.get("jlptLevel") ?? "all";
  const readingType = searchParams.get("readingType") ?? "all";
  const source = searchParams.get("source") ?? "all";

  return (
    <div className="flex items-end gap-4">
      <div className="space-y-1">
        <div>Exam</div>
        <Select
          onValueChange={(examId) => {
            setSearchParam({ examId, page: 1 });
          }}
          value={examId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All</SelectItem>
            {testPeriods.map((testPeriod) => (
              <SelectItem key={testPeriod.id} value={testPeriod.id.toString()}>
                {testPeriod.title} - {testPeriod.jlptLevel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
          onValueChange={(readingType) => {
            setSearchParam({ readingType, page: 1 });
          }}
          value={readingType}
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All</SelectItem>
            {Object.entries(readingTypeMap).map(([type, title]) => (
              <SelectItem key={type} value={type}>
                {title}
              </SelectItem>
            ))}
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
            <SelectItem value={"all"}>All</SelectItem>
            {jlptLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <div className="space-y-1">
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
      </div> */}
      {/* <div className="space-y-1">
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
      </div> */}
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
