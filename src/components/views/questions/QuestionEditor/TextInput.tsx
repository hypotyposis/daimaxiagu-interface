import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';

export interface ITextInputProps {
  title: string;
  value: string;
  setValue: (value: string) => void;
  disabled?: boolean;
  setDisabled?: (value: boolean) => void;
  markdown?: boolean;
}

export default React.memo<ITextInputProps>(
  ({ title, value, setValue, disabled, setDisabled, markdown = false }) => {
    return (
      <Box sx={{ paddingBottom: '20px', opacity: disabled ? 0.25 : 1 }}>
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
          {disabled === undefined ? (
            <></>
          ) : (
            <Checkbox
              checked={!disabled}
              onChange={(_event, checked) => setDisabled?.(!checked)}
            />
          )}
        </Box>
        {markdown ? (
          <MixCodeEditor
            language="markdown"
            readOnly={disabled}
            code={disabled ? '' : value}
            onChange={(value: string) => {
              if (disabled !== false) {
                setValue?.(value);
              }
            }}
          />
        ) : (
          <TextField
            disabled={disabled}
            variant="outlined"
            value={value}
            onChange={event => setValue(event.target.value)}
            fullWidth
            size="small"
          />
        )}
      </Box>
    );
  },
);
