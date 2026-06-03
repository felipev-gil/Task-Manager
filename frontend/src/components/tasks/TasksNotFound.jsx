import { Link } from "react-router-dom";
import { NotebookIcon } from "lucide-react";

const TasksNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
      <div className="bg-primary/35 rounded-full p-8">
        <NotebookIcon className="size-14 text-primary" />
      </div>
      <h3 className="text-3xl mb-6 text-base-content font-semibold">
        No tasks yet
      </h3>
      <p className="text-md text-base-content mb-6">
        Ready to organize your thoughts? Create your first task to get started
        on your journey.
      </p>
      <Link to="/create" className="btn btn-primary btn-md mb-6">
        Create Your First Task
      </Link>
    </div>
  );
};
export default TasksNotFound;
