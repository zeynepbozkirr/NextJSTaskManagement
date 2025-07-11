'use client';
import { useContext } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { DragDropContext } from '../../context/DragDropContext';
import { SortableColumn } from '../sortableColumn';
import { SortableTask } from '../sortableTask';
import { Avatar, Box, Button, Typography } from '@mui/material';
import data from '../../utils/dumyData.json';
import Grid from '@mui/material/Grid2';
import styles from './styles.module.css';

const Board = () => {
  const context = useContext(DragDropContext);

  if (!context) {
    // Context yoksa (undefined), bir şey gösterme veya yükleniyor gösterebilirsin
    return null;
  }

  const {
    columns,
    onDragEnd,
    filteredColumns,
    updateFilter,
    filterByUser,
    addColumn,
  } = context;

  const dummyUsers = data.dummyUsers;

  return (
    <Box
      sx={{
        height: '100px',
      }}
    >
      <div className={styles.headerContainer} style={{}}>
        <div>
          <Typography variant="h4" component="div">
            TASKS
          </Typography>
          <Typography sx={{ color: '#574964' }}>
            short description will be placed her
          </Typography>
        </div>

        <Box display="flex" mb={2}>
          {dummyUsers?.map((user, index) => (
            <Avatar
              key={index}
              src={user.avatar}
              alt={user.name}
              className={styles.avatar}
              sx={{
                backgroundColor: user.color,
                border:
                  filterByUser === user.icon
                    ? '1px solid ' + user.textColor
                    : 'none',
              }}
              onClick={() => updateFilter(user.icon)}
            >
              {user.icon}
            </Avatar>
          ))}
        </Box>
      </div>
      <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={columns?.map((column) => column.id)}>
          <Grid container spacing={2}>
            {filteredColumns?.map((column) => (
              <SortableColumn key={column.id} id={column.id} name={column.name}>
                <SortableContext items={column.tasks.map((task) => task.id)}>
                  {column?.tasks?.map((task, index) => (
                    <SortableTask
                      key={index}
                      columnId={column.id}
                      id={task.id}
                      name={task.name}
                    />
                  ))}
                </SortableContext>
              </SortableColumn>
            ))}
            <Button onClick={() => addColumn()} style={{}}>
              <Typography
                variant="h3"
                component="div"
                className={styles.addIcon}
              >
                +
              </Typography>
            </Button>
          </Grid>
        </SortableContext>
      </DndContext>
      <div style={{ minHeight: 50 }}></div>
    </Box>
  );
};

export default Board;
