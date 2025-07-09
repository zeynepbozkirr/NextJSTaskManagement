'use client';
import React, { useContext, useState } from 'react';
import {
  Drawer,
  IconButton,
  Divider,
  Box,
  Button,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DateRangePicker from '../datePicker';
import { DragDropContext } from '@/context/DragDropContext';
import data from '../../utils/dumyData.json';
import styles from './styles.module.css';

interface TaskModalProps {
  handleClose: () => void;
  onSave: (updatedTask: {
    name: string;
    description: string;
    assignedTo: string[];
  }) => void;
  isModalOpen: boolean;
  columnId: string;
  taskId: string;
  color: string;
}

const Sidebar: React.FC<TaskModalProps> = ({
  handleClose,
  isModalOpen,
  columnId,
  taskId,
  color,
}) => {
  const context = useContext(DragDropContext);
  const dummyUsers = data.dummyUsers;

  if (!context) return null;

  const { getTaskById, updateTask } = context;
  const task = getTaskById(columnId, taskId);

  // Eğer task yoksa, güvenli fallback ver
  const [taskName, setTaskName] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });
  const [storyPoints, setStoryPoints] = useState(0);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setDescription(task.description);
      setAssignedTo(task.assignedTo || []);
      setDates({
        startDate: task.startDate || null,
        endDate: task.endDate || null,
      });
      setStoryPoints(task.storyPoints || 0);
    }
  }, [task]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleUserToggle = (userId: string) => {
    setAssignedTo((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSave = () => {
    if (!task) return;

    const startDate = dates?.startDate?.format('DD/MM/YYYY');
    const endDate = dates?.endDate?.format('DD/MM/YYYY');

    updateTask(task.id, {
      ...task,
      name: taskName,
      description,
      assignedTo,
      startDate: startDate || null,
      endDate: endDate || null,
      storyPoints,
    });

    handleClose();
  };

  return (
    <div>
      <IconButton
        edge="start"
        color="inherit"
        onClick={handleDrawerToggle}
        sx={{ color: color, marginRight: 2 }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        open={isModalOpen}
        onClose={handleDrawerToggle}
        anchor="right"
        PaperProps={{
          style: {
            width: '100%',
            maxWidth: '500px',
            height: '100%',
            padding: '20px',
          },
        }}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            color: '#ecf0f1',
            paddingTop: 8,
            boxSizing: 'border-box',
            position: 'fixed',
            zIndex: 1300,
          },
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            Edit Task
          </Typography>
          <Divider className={styles.divider} />

          <TextField
            fullWidth
            margin="normal"
            label="Task Name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Story Points"
            value={storyPoints}
            onChange={(e) => setStoryPoints(Number(e.target.value))}
          />
          <DateRangePicker
            startDate={dates.startDate}
            endDate={dates.endDate}
            onDateChange={setDates}
          />

          <Typography variant="body1" gutterBottom>
            Assign to:
          </Typography>

          {dummyUsers?.map((user, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={assignedTo.includes(user.icon)}
                  onChange={() => handleUserToggle(user.icon)}
                  style={{ color: user.textColor }}
                />
              }
              label={
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{
                      width: 24,
                      height: 24,
                      marginRight: 1,
                      backgroundColor: user.color,
                    }}
                  />
                  <Typography style={{ color: user.textColor }}>
                    {user.name}
                  </Typography>
                </Box>
              }
            />
          ))}

          <Divider className={styles.divider} />

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default Sidebar;
