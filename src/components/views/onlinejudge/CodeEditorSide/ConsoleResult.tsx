import React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

import { useSelector } from '@/utils/redux/hooks';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export default React.memo(() => {
  const theme = useTheme();
  const consoleResult = useSelector(state => state.gameLevel.ojConsoleResult);

  switch (consoleResult?.status) {
    case 'Pending': {
      return (
        <Box
          sx={{
            padding: '20px',
            width: '100%',
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
          <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
        </Box>
      );
    }
    case 'Accepted': {
      return (
        <Box
          sx={{
            padding: '20px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '50px',
                fontSize: '14px',
                userSelect: 'none',
                paddingLeft: '5px',
              }}
            >
              输入
            </Box>
            <MarkdownBlock
              style={{
                flexGrow: 1,
                '& pre > code': {
                  color: '#fff !important',
                },
              }}
              text={`\`\`\`plain showLineNumbers\n${consoleResult.cin}\n\`\`\``}
              usePrism
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              marginTop: '12px',
            }}
          >
            <Box
              sx={{
                width: '50px',
                fontSize: '14px',
                userSelect: 'none',
                paddingLeft: '5px',
              }}
            >
              输出
            </Box>
            <MarkdownBlock
              style={{
                flexGrow: 1,
                '& pre > code': {
                  color: '#fff !important',
                },
              }}
              text={`\`\`\`plain showLineNumbers\n${consoleResult.message}\n\`\`\``}
              usePrism
            />
          </Box>
        </Box>
      );
    }
    case 'Compile Error': {
      return (
        <Box
          sx={{
            padding: '20px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              color: theme.palette.warning.dark,
              fontSize: '18px',
              fontWeight: 700,
              userSelect: 'none',
              marginBottom: '10px',
            }}
          >
            编译错误
          </Box>
          <MarkdownBlock
            text={`\`\`\`\n${consoleResult.message}\n\`\`\``}
            style={{
              marginBottom: '10px',
              width: '100%',
              '& pre': {
                background: '#ffa51944',
                border: '1px solid #ff7b1988',
              },
            }}
          />
        </Box>
      );
    }
    case 'Runtime Error': {
      return (
        <Box
          sx={{
            padding: '20px',
            width: '100%',
          }}
        >
          <Box
            sx={{
              color: theme.palette.error.dark,
              fontSize: '18px',
              fontWeight: 700,
              userSelect: 'none',
              marginBottom: '10px',
            }}
          >
            运行时错误
          </Box>
          <MarkdownBlock
            text={`\`\`\`\n${consoleResult.message}\n\`\`\``}
            style={{
              marginBottom: '10px',
              '& pre': {
                background: '#ff000059',
                border: '1px solid #ff0000d6',
              },
            }}
          />
        </Box>
      );
    }
    case 'Network Error': {
      return (
        <Box
          sx={{
            height: '150px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            fontSize: '16px',
            fontWeight: 500,
            opacity: 0.7,
            color: 'red',
            padding: '0 10px',
          }}
        >
          网络错误: {consoleResult.message}
        </Box>
      );
    }
    default: {
      return (
        <Box
          sx={{
            height: '150px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
            fontSize: '24px',
            fontWeight: 800,
            opacity: 0.3,
            padding: '0 10px',
          }}
        >
          还是空空如也呢，点击下方【执行代码】查看结果吧~
        </Box>
      );
    }
  }
});
