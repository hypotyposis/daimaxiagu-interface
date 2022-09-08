import React from 'react';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';

import { useSelector } from '@/utils/redux/hooks';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export interface IProblemContentProps {
  style?: SxProps;
}

const domParser = new DOMParser();

export const stripHTML = (htmlText: string): string => {
  const textList: string[] = [];
  const fakeDocument = domParser.parseFromString(htmlText, 'text/html');
  for (
    let ele = fakeDocument.querySelector('body')?.firstElementChild;
    ele;
    ele = ele.nextElementSibling
  ) {
    switch (ele.tagName.toLowerCase()) {
      case 'p':
      case 'div': {
        textList.push(ele.innerHTML);
        break;
      }
      default: {
        textList.push(ele.outerHTML);
        break;
      }
    }
  }
  return textList.join('\n\n');
};

export default React.memo<IProblemContentProps>(({ style = {} }) => {
  const problem = useSelector(state => state.gameLevel.ojProblem!);
  const markdownText = React.useMemo(() => {
    const lines = [problem.description ? stripHTML(problem.description) : ''];
    if (
      problem.description &&
      problem.input_description &&
      problem.input_description.trim() !== ''
    ) {
      lines.push('---');
    }
    if (problem.input_description && problem.input_description.trim() !== '') {
      lines.push('### 输入');
      lines.push(stripHTML(problem.input_description));
    }
    if (
      problem.input_description &&
      problem.input_description.trim() !== '' &&
      problem.output_description &&
      problem.output_description.trim() !== ''
    ) {
      lines.push('---');
    }
    if (
      problem.output_description &&
      problem.output_description.trim() !== ''
    ) {
      lines.push('### 输出');
      lines.push(stripHTML(problem.output_description));
    }
    if (
      problem.output_description &&
      problem.output_description.trim() !== '' &&
      problem.samples.length > 0
    ) {
      lines.push('---');
    }
    if (problem.samples.length > 0) {
      lines.push('### 输入输出样例');
      problem.samples.forEach((sample, index) => {
        lines.push(`#### 样例 ${index + 1}`);
        if (sample.input && sample.input.trim() !== '') {
          lines.push('##### 输入');
          lines.push(['```plain', sample.input, '```'].join('\n'));
        }
        if (sample.output && sample.output.trim() !== '') {
          lines.push('##### 输出');
          lines.push(['```plain', sample.output, '```'].join('\n'));
        }
      });
    }
    if (problem.samples.length > 0 && problem.hint) {
      lines.push('---');
    }
    if (problem.hint) {
      lines.push('### 提示');
      lines.push(stripHTML(problem.hint));
    }
    return lines
      .join('\n\n')
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/src="\//g, 'src="https://oj.daimaxiagu.com/')
      .replace(/src="http:\/\/[^/]+\//g, 'src="https://oj.daimaxiagu.com/');
  }, [problem]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        '& hr': {
          backgroundColor: '#ffffff30',
          height: '0.05em',
        },
        '& p span': {
          color: 'inherit !important',
        },
        ...style,
      }}
    >
      <MarkdownBlock text={markdownText} allowHTML usePrism />
    </Box>
  );
});
