import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import { SxProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useSelector } from '@/utils/redux/hooks';

export interface IProblemHeaderProps {
  style?: SxProps;
}

export default React.memo<IProblemHeaderProps>(({ style = {} }) => {
  const problem = useSelector(state => state.gameLevel.ojProblem!);
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...style,
      }}
    >
      <Box sx={{ fontSize: '20px', fontWeight: 750, lineHeight: '2em' }}>
        {problem._id}. {problem.title}
      </Box>

      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          fontSize: '14px',
          userSelect: 'none',
        }}
        rowSpacing={0.5}
        columnSpacing={3}
      >
        <Grid item>
          {'难度: '}
          {{
            Low: (
              <Box component="span" sx={{ color: theme.palette.success.dark }}>
                简单
              </Box>
            ),
            Medium: (
              <Box component="span" sx={{ color: theme.palette.warning.dark }}>
                中等
              </Box>
            ),
            High: (
              <Box component="span" sx={{ color: theme.palette.error.dark }}>
                困难
              </Box>
            ),
          }[problem.difficulty] ?? (
            <Box
              component="span"
              sx={{ color: (theme.palette.grey as any).dark }}
            >
              未知
            </Box>
          )}
        </Grid>
        <Grid item>模式: {problem.rule_type}</Grid>
        <Grid item>
          时间限制:{' '}
          <span style={{ color: theme.palette.primary.dark, fontWeight: 800 }}>
            {problem.time_limit}ms
          </span>
        </Grid>
        <Grid item>
          内存限制:{' '}
          <span style={{ color: theme.palette.primary.dark, fontWeight: 800 }}>
            {problem.memory_limit}MB
          </span>
        </Grid>
        <Grid item>满分: {problem.total_score}</Grid>
        <Grid item>出题人: {problem.created_by.username ?? '?'}</Grid>
      </Grid>
      <Box
        sx={{
          fontSize: '14px',
          opacity: 0.3,
          lineHeight: 1.85,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          userSelect: 'none',
        }}
      >
        出题时间: {new Date(problem.create_time).toLocaleString()}
      </Box>
      {problem.last_update_time ? (
        <Box
          sx={{
            fontSize: '14px',
            opacity: 0.3,
            lineHeight: 1.85,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            userSelect: 'none',
          }}
        >
          修改时间时间: {new Date(problem.last_update_time).toLocaleString()}
        </Box>
      ) : (
        <></>
      )}
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        rowSpacing={0.5}
        columnSpacing={1.35}
        sx={{ padding: '5px 0 0 0' }}
      >
        {problem.tags.map(tag => (
          <Grid item key={tag}>
            <Chip label={tag} size="small" />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});
