import React, { useContext, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragDropContext } from '@/context/DragDropContext';
import { Button, Input, Box, Typography, TextField } from '@mui/material';
import DragIndicator from '@mui/icons-material/DragIndicator';

import styles from './styles.module.css';

interface SortableColumnProps {
  id: string;
  name: string;
  children: React.ReactNode;
}

export const SortableColumn: React.FC<SortableColumnProps> = ({
  id,
  name,
  children,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const context = useContext(DragDropContext);

  if (!context) return null;

  const { addTask, updateColumnName } = context;

  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [taskName, setTaskName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [columnName, setName] = useState(name);

  const handleBlur = () => {
    setIsEditing(false);
    updateColumnName(id, columnName);
  };
  const handleAddTask = (id: number) => {
    if (taskName.trim()) {
      addTask(id, taskName);
      setTaskName('');
      setActiveInput(null);
    }
  };

  return (
    <Box
      className={styles.box}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      ref={setNodeRef}
    >
      <div className={styles.columHeader}>
        <div>
          {isEditing ? (
            <TextField
              value={columnName}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleBlur}
              autoFocus
              variant="outlined"
              size="small"
            />
          ) : (
            <Typography
              variant="h6"
              onClick={() => setIsEditing(true)}
              style={{ cursor: 'pointer' }}
            >
              {name}
            </Typography>
          )}
        </div>
        <Typography component="div"></Typography>
        <DragIndicator
          {...listeners}
          style={{ color: '#9DA0AB' }}
          sx={{ fontSize: 20 }}
        />
      </div>

      {children}
      {activeInput === id ? (
        <div>
          <Input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
          />
          <Button onClick={() => handleAddTask(id)}>Save</Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            setActiveInput(id);
          }}
        >
          Add Task
        </Button>
      )}
    </Box>
  );
};
