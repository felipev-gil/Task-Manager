import { Archive } from "lucide-react";

const ArchiveNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-5 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/35 rounded-full p-8">
        <Archive className="size-14 text-primary" />
      </div>
      <h3 className="text-3xl mb-6 text-base-content font-semibold">
        No archived tasks found. Archived tasks will appear here.
      </h3>
    </div>
  );
};
export default ArchiveNotFound;
