



import React, { useState } from 'react';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Dayjs from 'dayjs';
import { TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import utc from 'dayjs/plugin/utc';

Dayjs.extend(utc);

const BasicDateTimePicker = ({ selectedDate, onDateTimeChange, onDurationChange }) => {

    const [duration, setDuration] = useState(15);
    const dateAdapter = new AdapterDayjs();

    const handleDateChange = (newDate) => {
        if (dateAdapter.isValid(newDate)) {
            onDateTimeChange(dateAdapter.date(newDate).toISOString());
        }
    };

    const handleDurationChange = (event) => {
        const newDuration = event.target.value;
        setDuration(newDuration);
        onDurationChange(newDuration);
    };

    const durations = [15, 30, 60, 90].concat(Array.from({length: (240-90)/30}, (_, i) => 120 + i * 30));

    return (
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{ marginBottom: '20px' }}>
                    <DateTimePicker
                        label="Start Time"
                        value={dateAdapter.date(selectedDate)}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </div>
                <FormControl fullWidth>
                    <InputLabel id="duration-label">Duration</InputLabel>
                    <Select
                        labelId="duration-label"
                        id="duration-select"
                        value={duration}
                        label="Duration"
                        onChange={handleDurationChange}
                    >
                        {durations.map((durationValue, index) => (
                            <MenuItem key={index} value={durationValue}>
                                {durationValue} min
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </LocalizationProvider>
        </div>
    );
};

export default BasicDateTimePicker;