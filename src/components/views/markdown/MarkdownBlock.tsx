import * as React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import { OSS_RESOURCE_BASE } from '@/utils/config';

import './markdown-style.css';
import './hljs-atom-one-dark.min.css';
import './prism-one-dark.css';

export interface IMarkdownViewArguments {
  text?: string;
  style?: SxProps;
  allowHTML?: boolean;
  usePrism?: boolean;
}

const MarkdownBlock: React.NamedExoticComponent<IMarkdownViewArguments> =
  React.memo<IMarkdownViewArguments>(
    ({ text, style, allowHTML = false, usePrism = false }) => {
      const rehypePlugins = React.useMemo(() => {
        const plugins: any[] = [];
        if (usePrism) {
          plugins.push(rehypePrism);
        } else {
          plugins.push(rehypeHighlight);
        }
        if (allowHTML) {
          plugins.push(rehypeRaw);
        }
        plugins.push(rehypeKatex);
        return plugins;
      }, [allowHTML, usePrism]);
      return (
        <Box className={'markdown-body'} sx={{ ...(style ?? {}) }}>
          <link
            rel="stylesheet"
            href={`${OSS_RESOURCE_BASE}/slides/assets/katex.css`}
            type="text/css"
            media="all"
          />
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={rehypePlugins}
          >
            {text ?? ''}
          </ReactMarkdown>
        </Box>
      );
    },
  );

export default MarkdownBlock;
