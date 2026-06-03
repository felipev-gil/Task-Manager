import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { useTaskForm } from "../../hooks/useTaskForm";

const Create = () => {
  const { task, updateField, saveTask, isSaving } = useTaskForm({});

  return (
    <div className="flex justify-center w-full pt-15">
      <div className="bg-secondary-content p-12 max-w-lg w-full rounded-lg shadow-md shadow-current text-center">
        <Link
          to="/tasks"
          className="btn flex-start btn-ghost mb-6 text-base-content"
        >
          <ArrowLeftIcon className="size-5" />
          Back to Tasks
        </Link>

        <div className="flex flex-col py-7">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveTask();
            }}
          >
            <fieldset className="border border-primary rounded-lg p-6">
              <legend className="px-6 font-bold text-2xl">Create Task</legend>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="task-title" className="font-semibold">
                  Title
                </label>

                <input
                  id="task-title"
                  type="text"
                  value={task.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Task Title"
                  className="input w-full px-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="task-content" className="font-semibold">
                  Content
                </label>

                <textarea
                  id="task-content"
                  value={task.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Write your task content here..."
                  className="textarea w-full px-3 border-primary rounded-md focus:ring-1 outline-none h-32"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="task-priority" className="font-semibold">
                  Priority
                </label>

                <select
                  id="task-priority"
                  value={task.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                  className="select select-primary w-full px-3 border-primary rounded-md focus:ring-1 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
              >
                {isSaving ? "Creating..." : "Create Task"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Create;
