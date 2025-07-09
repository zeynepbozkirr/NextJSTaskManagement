import React, { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Avatar,
} from '@mui/material';
import { DragDropContext } from '@/context/DragDropContext';
import { useDraggable } from '@dnd-kit/core';
import { OutlinedFlag } from '@mui/icons-material';
import Sidebar from '../sidebar/sidebar';
import styles from './styles.module.css';

interface SortableTaskProps {
  id: string;
  columnId: string;
  name: string;
  handleOpen: () => void;
}

export const SortableTask: React.FC<SortableTaskProps> = ({ columnId, id }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { getTaskById } = useContext(DragDropContext);
  const task = getTaskById(columnId, id);

  const getBackgroundColor = (storyPoint: number) => {
    if (storyPoint >= 0 && storyPoint <= 10) {
      return '#FFCDD2';
    } else if (storyPoint > 10 && storyPoint <= 20) {
      return '#C8E6C9';
    } else if (storyPoint > 20 && storyPoint <= 30) {
      return '#FFECB3';
    } else if (storyPoint > 30 && storyPoint <= 40) {
      return '#B3E5FC';
    } else if (storyPoint > 40) {
      return '#D1C4E9';
    } else {
      return '#FFFFFF';
    }
  };

  const backgroundColor = getBackgroundColor(task.storyPoints);

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: isDragging
      ? `translate(${transform?.x ?? 0}px, ${transform?.y ?? 0}px)`
      : undefined,
    backgroundColor: backgroundColor,
  };
  console.log(task, 'taskk');

  return (
    <Card
      ref={setNodeRef}
      className={styles.card}
      style={style}
      {...attributes}
    >
      <CardContent {...listeners}>
        <Typography
          variant="h5"
          component="div"
          sx={{ color: 'text.secondary' }}
        >
          {task.name}
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 1.5, paddingTop: 1 }}>
          Detail: {task.description}
        </Typography>

        {task?.assignedTo.length !== 0 && (
          <div
            className={styles.assignessDiv}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#574964',
            }}
          >
            <Typography
              variant="body2"
              className={styles.assigness}
              style={{ color: '#574964', paddingTop: 2 }}
            >
              assigness:
            </Typography>
            <div
              style={{
                display: 'flex',
                color: '#574964',
              }}
            >
              {task?.assignedTo.map((assign) => (
                <Avatar
                  alt={assign}
                  src={assign}
                  style={{ width: 28, height: 28 }}
                />
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            display: 'flex',
            color: '#574964',
            paddingTop: 10,
          }}
        >
          <OutlinedFlag fontSize={'small'} />
          <Typography
            variant="body2"
            style={{
              paddingLeft: 5,
            }}
          >
            {task?.endDate}
          </Typography>
        </div>
        <Typography
          variant="body2"
          className={styles.assigness}
          style={{ color: '#574964', paddingTop: 10 }}
        >
          Story Points: {task.storyPoints}
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" onClick={handleOpen}>
          Edit Task
        </Button>
      </CardActions>

      <Sidebar
        isModalOpen={isModalOpen}
        handleClose={handleClose}
        columnId={columnId}
        taskId={id}
        color={backgroundColor}
      />
    </Card>
  );
};
