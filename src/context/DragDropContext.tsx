import React, { createContext, useContext, useState, ReactNode } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  name: string;
  description: string;
  assignedTo: string[];
  storyPoints: number;
  startDate?: string | null;
  endDate?: string | null;
}

interface Column {
  id: string;
  name: string;
  tasks: Task[];
}
interface DragDropContextType {
  columns: Column[];
  addColumn: () => void;
  addTask: (columnId: number, taskName: string) => void;
  onDragEnd: (event: {
    sourceColumnId: string;
    destinationColumnId?: string;
    sourceTaskIndex: number;
    destinationTaskIndex?: number;
    taskId: string;
  }) => void;
  getTaskById: (taskId: string) => Task | undefined;
  updateColumnName: (columnId: string, newName: string) => void;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => void;
  updateFilter: (filterValue: string) => void;
}

export const DragDropContext = createContext<DragDropContextType | undefined>(
  undefined,
);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'column-1',
      name: 'Open',
      tasks: [
        {
          id: 'task-1',
          name: 'Task 1',
          description: 'Description 1',
          storyPoints: 10,
          assignedTo: ['RS'],
        },
        {
          id: 'task-2',
          name: 'Task 2',
          description: 'Description 2',
          storyPoints: 20,
          assignedTo: ['KD'],
        },
      ],
    },
    {
      id: 'column-2',
      name: 'In Progress',
      tasks: [
        {
          id: 'task-3',
          name: 'Task 3',
          description: 'Description 3',
          storyPoints: 30,
          assignedTo: ['TN'],
        },
      ],
    },
    {
      id: 'column-3',
      name: 'In Review',
      tasks: [
        {
          id: 'task-4',
          name: 'Task 4',
          description: 'Description 4',
          storyPoints: 60,
          assignedTo: ['TN'],
        },
      ],
    },
    {
      id: 'column-4',
      name: 'Done',
      tasks: [
        {
          id: 'task-5',
          name: 'Task 5',
          description: 'Description 4',
          storyPoints: 50,
          assignedTo: ['RS'],
        },
      ],
    },
  ]);

  const [filterByUser, setFilterByUser] = useState(null);

  const filteredColumns = filterByUser
    ? columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) =>
          task.assignedTo.includes(filterByUser),
        ),
      }))
    : columns;

  const updateFilter = (userId) => {
    setFilterByUser((prev) => (prev === userId ? null : userId));
  };

  const addColumn = (name: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      name: name,
      tasks: [],
    };
    setColumns([...columns, newColumn]);
  };

  const getTaskById = (columnId: string, taskId: string): Task | null => {
    return (
      columns
        .find((col) => col.id === columnId)
        ?.tasks.find((task) => task.id === taskId) || null
    );
  };

  const updateColumnName = (columnId: string, newName: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        name: column.id === columnId ? newName : column.name,
      })),
    );
  };

  const addTask = (columnId: number, taskName: string) => {
    if (!taskName.trim()) return;

    const newTask: Task = {
      id: uuidv4(),
      name: taskName,
      description: '',
      assignedTo: [],
      startDate: null,
      endDate: null,
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId.toString()
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column,
      ),
    );
  };

  const updateTask = (updatedTask) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      })),
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeColumnIndex = columns.findIndex(
      (column) => column.id === activeId,
    );
    const overColumnIndex = columns.findIndex((column) => column.id === overId);

    if (activeColumnIndex !== -1 && overColumnIndex !== -1) {
      setColumns((prevColumns) =>
        arrayMove(prevColumns, activeColumnIndex, overColumnIndex),
      );
      return;
    }
    let sourceColumn: Column | null = null;
    let destinationColumn: Column | null = null;
    const updatedColumns = columns.map((column) => {
      if (column.tasks.some((task) => task.id === activeId)) {
        sourceColumn = column;
      }
      if (column.id === overId) {
        destinationColumn = column;
      }
      return column;
    });

    if (!sourceColumn || !destinationColumn) return;

    const activeTaskIndex = sourceColumn.tasks.findIndex(
      (task) => task.id === activeId,
    );
    const [movedTask] = sourceColumn.tasks.splice(activeTaskIndex, 1);

    if (sourceColumn.id === destinationColumn.id) {
      const destinationIndex = destinationColumn.tasks.findIndex(
        (task) => task.id === overId,
      );
      destinationColumn.tasks.splice(destinationIndex, 0, movedTask);
    } else {
      destinationColumn.tasks.push(movedTask);
    }

    setColumns([...updatedColumns]);
  };

  return (
    <DragDropContext.Provider
      value={{
        columns,
        getTaskById,
        addColumn,
        addTask,
        updateTask,
        onDragEnd,
        updateFilter,
        updateColumnName,
        filteredColumns,
        filterByUser,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export const useDragDrop = () => {
  const context = useContext(DragDropContext);

  if (!context) {
    throw new Error('useDragDrop has to be used within <useDragDrop.Provider>');
  }

  return context;
};
