import React from 'react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Zoom from '@mui/material/Zoom';
import { useTheme } from '@mui/material/styles';

import Snippets, { SnippetItem } from './snippets';
import { ILevelToolKit } from '.';

import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';
import { useSelector } from '@/utils/redux/hooks';

const GradientList: [string, string][] = [
  ['#0093E9', 'linear-gradient(212deg, #0093E9 0%, #80D0C7 100%)'],
  ['#4158D0', 'linear-gradient(160deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)'],
  ['#FFE53B', 'linear-gradient(147deg, #FFE53B 0%, #FF2525 74%)'],
  ['#21D4FD', 'linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)'],
  ['#F4D03F', 'linear-gradient(132deg, #F4D03F 0%, #16A085 100%)'],
];

interface ISnippetSelectorBarArguments {
  levelToolkit?: ILevelToolKit;
}

const SnippetSelectorBar = React.memo<ISnippetSelectorBarArguments>(
  ({ levelToolkit }) => {
    const theme = useTheme();
    const currentLanguage = useSelector(
      state => state.gameLevel.currentLanguage,
    );
    const allowedSnippets = useSelector(
      state => state.gameLevel.levelData!.allowedSnippets,
    );
    const snippetList = React.useMemo<SnippetItem[]>(() => {
      const origin = Snippets[currentLanguage];
      if (origin === undefined || origin.length === 0) {
        return [];
      }
      if (allowedSnippets === undefined) {
        return origin;
      }
      if (allowedSnippets.length === 0) {
        return [];
      }
      const snippets: SnippetItem[] = [];
      const len = origin.length;
      for (let i = 0; i < len; i++) {
        const snippet = origin[i];
        if (allowedSnippets.includes(snippet.id)) {
          snippets.push(snippet);
        }
      }
      return snippets;
    }, [allowedSnippets, currentLanguage]);
    const snippetItems = React.useMemo(
      () =>
        snippetList.map(
          ({ iconTitle, id, snippet, title, document }, index) => (
            <Grid
              item
              key={id}
              sx={{
                height: '80px',
                margin: '0 5px 10px 5px',
                flexShrink: 0,
                padding: '0 !important',
              }}
            >
              <Tooltip
                TransitionComponent={Zoom}
                title={
                  <Box
                    sx={{
                      width: '300px',
                      maxHeight: '300px',
                      minHeight: '100px',
                      color: theme.palette.text.secondary,
                      overflow: 'hidden',
                      ...theme.typography.body2,
                    }}
                  >
                    <MarkdownBlock
                      style={{
                        height: '100%',
                        width: 'calc(100% - 15px)',
                        padding: '5px',
                        overflowY: 'scroll',
                      }}
                      text={[
                        `## ${title}`,
                        document ? `\n${document}\n` : '',
                        '将会在编辑器中插入如下代码：\n',
                        `\`\`\`${currentLanguage}`,
                        snippet,
                        '```\n',
                      ].join('\n')}
                    />
                  </Box>
                }
                placement="top"
              >
                <Paper
                  sx={{
                    ...theme.typography.body2,
                    height: '100%',
                    width: '95px',
                    color: theme.palette.text.secondary,
                    backgroundColor:
                      GradientList[index % GradientList.length][0],
                    backgroundImage:
                      GradientList[index % GradientList.length][1],
                    flexShrink: 0,
                    overflow: 'hidden',
                    userSelect: 'none',
                    '&:hover > div:first-of-type': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  onClick={() => {
                    levelToolkit?.editorInstance?.insert?.(snippet);
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '70%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '900',
                      transition: 'all 0.3s ease 0s',
                      backgroundColor: '#0008',
                    }}
                  >
                    {iconTitle}
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: '30%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      backgroundColor: '#000b',
                    }}
                  >
                    {snippet}
                  </Box>
                </Paper>
              </Tooltip>
            </Grid>
          ),
        ),
      [snippetList],
    );

    if (snippetItems.length === 0) {
      return <></>;
    } else {
      return (
        <Grid
          container
          spacing={2}
          sx={{
            height: '100px',
            padding: '10px 10px 0 10px',
            bgcolor: 'background.default',
            overflowX: 'scroll',
            marginLeft: '0 !important',
            marginTop: '0 !important',
            justifyContent: 'center',
            flexShrink: 0,
            width: '100%',
            position: 'relative',
          }}
        >
          {snippetItems}
        </Grid>
      );
    }
  },
);

export default SnippetSelectorBar;
