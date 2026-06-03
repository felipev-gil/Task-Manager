import { Link, useNavigate } from "react-router-dom";
import { ArchiveX, LoaderIcon, PlusIcon, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useConfirm } from "../../hooks/useConfirm";
import { useTaskCollection } from "../../hooks/useTasks";
import { useTaskBoard } from "../../hooks/useTaskBoard";
import RateLimitedUi from "../../components/system/RateLimitedUi";
import TasksNotFound from "../../components/tasks/TasksNotFound";

const Tasks = () => {
  const confirm = useConfirm();
  const navigate = useNavigate();

  const {
    tasks,
    isLoading,
    isRateLimited,
    deleteTask,
    archiveTask,
    updateTaskState,
  } = useTaskCollection({
    archived: false,
  });

  const { columns, groupedTasks, visibleTasks, handleDragEnd, priorityColor } =
    useTaskBoard({
      tasks,
      updateTaskState,
    });

  const handleDelete = async (e, id) => {
    e.preventDefault();

    const confirmed = await confirm({
      title: "Are you sure?",
      icon: "error",
      confirmText: "Yes, delete it!",
    });

    if (!confirmed) return;

    await deleteTask(id);
  };

  const handleArchive = async (e, id) => {
    e.preventDefault();

    const confirmed = await confirm({
      title: "Are you sure?",
      icon: "info",
      confirmText: "Yes, archive it!",
    });

    if (!confirmed) return;

    await archiveTask(id);
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

  if (visibleTasks.length === 0) {
    return <TasksNotFound />;
  }

  return (
    <div className="flex justify-center w-full">
      <div className="max-w-7xl w-full p-12">
        <div className="flex justify-between mb-10">
          <h1 className="text-primary text-4xl font-bold">Task Board</h1>
          <div>
            <Link to="/create" className="btn btn-primary">
              <PlusIcon className="size-5" />
              Create Task
            </Link>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div
            className="grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6"
          >
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      p-5
                      min-h-160
                      border
                      border-primary
                      rounded-3xl
                      shadow-md 
                      shadow-current
                      ${snapshot.isDraggingOver ? "bg-secondary/10" : "bg-primary/10"}
                    `}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-base-content font-bold text-xl">
                        {column.title}
                      </h2>

                      <div className="badge badge-primary">
                        {groupedTasks[columnId]?.length || 0}
                      </div>
                    </div>

                    <div className="space-y-5">
                      {groupedTasks[columnId]?.map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => navigate(`/task/${task._id}`)}
                              className={`
                                  p-5
                                  border
                                  rounded-3xl
                                  shadow-sm
                                  shadow-current
                                  hover:shadow-md
                                  cursor-pointer
                                  ${priorityColor(task.priority)}
                                  ${snapshot.isDragging ? "rotate-1 shadow-2xl" : ""}
                                `}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{task.title}</h3>

                                <div className="flex flex-row">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleArchive(e, task._id);
                                    }}
                                    aria-label="Archive task"
                                    className="btn btn-xs btn-ghost hover:bg-primary-content/20"
                                  >
                                    <ArchiveX className="size-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(e, task._id);
                                    }}
                                    aria-label="Delete task"
                                    className="btn btn-xs btn-ghost hover:bg-primary-content/20"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </div>
                              </div>
                              <p>{task.content}</p>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Tasks;
