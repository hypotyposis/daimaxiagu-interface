import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography';
import Badge from './Badge';

export interface IVideoTextProps {
  style?: SxProps;
  title?: string;
  name?: string;
  description?: string;
  tags?: string[];
  badge?: string;
}

export default React.memo<IVideoTextProps>(
  ({
    style = {},
    title = '我的AI创作',
    name = '代码峡谷',
    description = '点击收藏, 关注「代码峡谷」, 轻松搞定信奥编程!',
    tags = ['代码峡谷', '信奥', '少儿编程'],
    badge = '',
  }) => {
    const [moreDescrition, setMoreDiscription] = React.useState<boolean>(false);
    const _descrition = React.useMemo(() => {
      if (description.length <= 55 || moreDescrition) {
        return description;
      } else {
        return `${description.substring(0, 55)}...`;
      }
    }, [description, moreDescrition]);
    return (
      <Box
        sx={{
          userSelect: 'none',
          background: '#0006',
          borderRadius: '5px',
          boxShadow: '#000A 0 0 5px',
          ...style,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ fontSize: '30px', marginBottom: '0', marginTop: '5px' }}
          gutterBottom
          component="div"
        >
          『{title}』
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700, fontSize: '34px' }}
          gutterBottom
          component="div"
        >
          @{name}
          <Badge type={badge} />
        </Typography>
        <Typography
          variant="body2"
          display="block"
          gutterBottom
          sx={{ fontSize: '20px' }}
        >
          {_descrition}
          {description.length <= 55 ? (
            <></>
          ) : (
            <Box
              component="span"
              sx={{
                color: 'primary.dark',
                fontWeight: 700,
                padding: '0 4px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setMoreDiscription(!moreDescrition);
              }}
            >
              {moreDescrition ? '收起' : '更多'}
            </Box>
          )}
        </Typography>
        <Typography
          variant="button"
          sx={{ fontWeight: 900, fontSize: '16px' }}
          display="block"
          gutterBottom
        >
          {tags.map(tag => `#${tag}`).join(' ')}
        </Typography>
      </Box>
    );
  },
);
