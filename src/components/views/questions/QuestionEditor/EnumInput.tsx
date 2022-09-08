import React from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export interface ITextInputProps {
  title: string;
  value: string;
  defaultValue?: string;
  setValue: (value: string) => void;
  options: (string | [string, string])[];
}

export default React.memo<ITextInputProps>(
  ({ title, value, setValue, options, defaultValue }) => {
    return (
      <Box sx={{ paddingBottom: '20px' }}>
        <Box
          sx={{
            flexShrink: 0,
            fontWeight: 800,
            fontSize: '20px',
            userSelect: 'none',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {title}
        </Box>
        <Select
          defaultValue={
            defaultValue ??
            (typeof options[0] === 'string' ? options[0] : options[0][0])
          }
          value={value}
          onChange={event =>
            setValue(
              typeof event.target.value === 'string'
                ? event.target.value
                : event.target.value[0],
            )
          }
          sx={{ width: '100%' }}
        >
          {options.map(option =>
            typeof option === 'string' ? (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ) : (
              <MenuItem value={option[0]} key={option[0]}>
                {option[1]}
              </MenuItem>
            ),
          )}
        </Select>
      </Box>
    );
  },
);
