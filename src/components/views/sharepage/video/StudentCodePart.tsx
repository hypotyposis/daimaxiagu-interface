import React from 'react';
import Box from '@mui/material/Box';
import FullScoreImage from './100score.png';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export interface IShareVideoPageProps {
  name: string;
  code: string;
  language: string;
  levelId?: string;
  collectionId?: string;
  levelName?: string;
  collectionName?: string;
  date: Date;
}

export default React.memo<IShareVideoPageProps>(
  ({
    name,
    code,
    language,
    levelId,
    levelName,
    collectionId,
    collectionName,
    date,
  }) => (
    <>
      <Box
        sx={{
          paddingLeft: '20px',
          fontSize: '13px',
          color: '#FFFA',
          lineHeight: 1.75,
          userSelect: 'none',
        }}
      >
        <Box
          sx={{
            fontSize: '20px',
            lineHeight: 3,
            fontWeight: 900,
            color: '#FFF',
          }}
        >
          <strong>成绩单</strong>
        </Box>
        <Box>
          <strong>姓名: </strong>
          {name}
        </Box>
        <Box>
          <strong>编程语言: </strong>
          {{
            cpp: 'C++',
            python: 'Python',
            scratch: 'Scratch',
          }[language] ?? '未知'}
        </Box>
        <Box>
          <strong>关卡名称: </strong>
          {collectionName} - {levelName}
        </Box>
        <Box>
          <strong>提交时间: </strong>
          {date.toLocaleString()}
        </Box>
        <Box>
          <strong>教师评价: </strong>
          <Box component="span" sx={{ color: 'success.dark', fontWeight: 800 }}>
            优秀
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          right: '30px',
          top: '25px',
        }}
      >
        <img width="80px" src={FullScoreImage} />
      </Box>
      <MarkdownBlock
        style={{ padding: '10px', fontSize: '22px', userSelect: 'none' }}
        text={`\`\`\`${language}\n${code}\n\`\`\``}
      />
      <Box sx={{ opacity: 0.05, fontSize: '6px', paddingLeft: '15px' }}>
        LEVEL_ID: {collectionId}/level:{levelId}
      </Box>
    </>
  ),
);
