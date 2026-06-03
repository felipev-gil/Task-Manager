import { useState, useRef } from "react";
import { ArchiveX, Trash2, LoaderIcon } from "lucide-react";
import { useConfirm } from "../../hooks/useConfirm";
import { useDebounce } from "../../hooks/useDebounce";
import { useTaskCollection } from "../../hooks/useTasks";
import { usePagination } from "../../hooks/usePagination";
import RateLimitedUi from "../../components/system/RateLimitedUi";
import ArchiveNotFound from "../../components/tasks/ArchiveNotFound";

const Archived = () => {
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search);

  const {
    tasks,
    isLoading,
    isRateLimited,
    page,
    setPage,
    totalPages,
    deleteTask,
    archiveTask,
  } = useTaskCollection({
    archived: true,
    search: debouncedSearch,
  });

  const pageNumbers = usePagination(page, totalPages);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Are you sure?",
      icon: "error",
      confirmText: "Yes, delete it!",
    });

    if (!confirmed) return;

    await deleteTask(id);
  };

  const handleUnarchive = async (id) => {
    const confirmed = await confirm({
      title: "Are you sure?",
      icon: "info",
      confirmText: "Yes, unarchive it!",
    });

    if (!confirmed) return;

    await archiveTask(id, false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (isRateLimited) {
    return <RateLimitedUi />;
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary">Archived</h1>
        </div>
        <div
          className="
            bg-base-100
            rounded-2xl
            shadow-xl
            border border-base-300
            p-6
          "
        >
          <div className="flex justify-end mb-6">
            <input
              id="search"
              type="text"
              autoFocus
              placeholder="Search tasks..."
              className="
                input
                input-bordered
                w-full
                max-w-sm
              "
              ref={searchRef}
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-base-300">
            <table className="table w-full border-collapse">
              <thead className="bg-base-200">
                <tr className="border-b border-base-300">
                  <th className="w-16 border-r border-base-300 text-center">
                    ID
                  </th>

                  <th className="w-64 border-r border-base-300 text-center">
                    Title
                  </th>

                  <th className="min-w-87 border-r border-base-300 text-center">
                    Content
                  </th>

                  <th className="w-32 border-r border-base-300 text-center">
                    State
                  </th>

                  <th className="w-32 border-r border-base-300 text-center">
                    Priority
                  </th>

                  <th className="w-40 border-r border-base-300 text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <tr
                      key={task._id}
                      className="
                        border-b
                        border-base-300
                        hover:bg-base-200
                        transition
                        duration-200
                      "
                    >
                      <td className="border-r border-base-300 text-center">
                        {(page - 1) * 10 + index + 1}
                      </td>

                      <td
                        className="
                          border-r
                          border-base-300
                          px-4
                          text-left
                          font-medium
                        "
                      >
                        {task.title}
                      </td>

                      <td
                        className="
                          border-r
                          border-base-300
                          px-4
                          text-justify
                          max-w-87
                        "
                      >
                        <div className="line-clamp-2">{task.content}</div>
                      </td>

                      <td className="border-r border-base-300 text-center">
                        {task.state}
                      </td>

                      <td className="border-r border-base-300 text-center">
                        {task.priority}
                      </td>

                      <td className="border-r border-base-300 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            className="
                              btn btn-sm btn-ghost
                              hover:bg-primary/20
                            "
                            aria-label="Unarchive task"
                            onClick={() => handleUnarchive(task._id)}
                          >
                            <ArchiveX className="size-4 text-primary" />
                          </button>

                          <button
                            type="button"
                            className="
                              btn btn-sm btn-ghost
                              hover:bg-primary/20
                            "
                            aria-label="Delete task"
                            onClick={() => handleDelete(task._id)}
                          >
                            <Trash2 className="size-4 text-primary" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center">
                      <ArchiveNotFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="join flex justify-center mt-8">
            <button
              className="join-item btn"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </button>

            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`join-item btn ${
                  page === number ? "btn-active btn-primary" : ""
                }`}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              className="join-item btn"
              disabled={page === totalPages || tasks.length === 0}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archived;
