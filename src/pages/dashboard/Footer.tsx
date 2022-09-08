import Box from '@mui/material/Box';

export default () => (
  <Box
    style={{
      bottom: '0',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      padding: '20px',
      backgroundColor: '#000a',
      flexShrink: 0,
      height: '40px',
    }}
  >
    <a
      href="https://beian.miit.gov.cn/"
      target="_blank"
      style={{
        color: '#888',
        textDecoration: 'none',
        borderBottom: 'dotted 1px',
        transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
      }}
    >
      浙ICP备2022020865号-1
    </a>
  </Box>
);
