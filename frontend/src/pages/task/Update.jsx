import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";
import { useConfirm } from "../../hooks/useConfirm";
import { useTaskForm } from "../../hooks/useTaskForm";

const Update = () => {
  const { id } = useParams();
  const confirm = useConfirm();

  const { task, updateField, isLoading, isSaving, saveTask, deleteTask } =
    useTaskForm({
      taskId: id,
      onDeleteConfirm: () =>
        confirm({
          title: "Are you sure?",
          icon: "error",
          confirmText: "Yes, delete it!",
        }),
    });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

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
              <legend className="px-6 font-bold text-2xl">Edit Task</legend>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="edit-title" className="font-semibold">
                  Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  value={task.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Task title"
                  className="input w-full px-3 border border-primary rounded-md focus:ring-1 outline-none"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="edit-content" className="font-semibold">
                  Content
                </label>

                <textarea
                  id="edit-content"
                  value={task.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  placeholder="Write your task here..."
                  className="textarea w-full px-3 border-primary rounded-md focus:ring-1 outline-none h-32"
                />
              </div>

              <div className="flex flex-col mb-6 space-y-1">
                <label htmlFor="edit-priority" className="font-semibold">
                  Priority
                </label>

                <select
                  id="edit-priority"
                  value={task.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                  className="select select-primary w-full px-3 border-primary rounded-md focus:ring-1 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex justify-center space-x-15 pt-4">
                <button
                  type="button"
                  onClick={deleteTask}
                  className="btn btn-error"
                >
                  Delete Task
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Update;
