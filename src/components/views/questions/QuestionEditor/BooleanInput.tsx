import React from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';

export interface ITextInputProps {
  title: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

export default React.memo<ITextInputProps>(({ title, value, setValue }) => {
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
      <Switch
        checked={value}
        onChange={event => setValue(event.target.checked)}
      />
    </Box>
  );
});
