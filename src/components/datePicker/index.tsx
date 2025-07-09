'use client';
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onDateChange: (dates: {
    startDate: Dayjs | null;
    endDate: Dayjs | null;
  }) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onDateChange,
}) => {
  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      if (endDate && date.isAfter(endDate)) {
        alert('Başlangıç tarihi bitiş tarihinden önce olmalı.');
        return;
      }

      onDateChange({ startDate: date, endDate });
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    if (date) {
      if (startDate && date.isBefore(startDate)) {
        alert('Bitiş tarihi başlangıç tarihinden önce olamaz.');
        return;
      }

      onDateChange({ startDate, endDate: date });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" flexDirection="column" gap={2} mt={2}>
        <Typography variant="body1">Start Date:</Typography>

        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
        />

        <Typography variant="body1">End Date:</Typography>
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
