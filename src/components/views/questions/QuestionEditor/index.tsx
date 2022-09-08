import React, { MutableRefObject } from 'react';
import { cloneDeep } from 'lodash';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import TextInput from './TextInput';
import SubProblemEditor from './SubProblemEditor';

import { IQuestionInfoJson, IQuestionSubProblemJson } from '@/types/json.d';

const EmptySubProblemJson: IQuestionSubProblemJson = {
  content: '',
  options: [
    ['', true],
    ['', false],
  ],
  explanation: '',
  type: 'single',
  random: true,
};

export interface ISubProblemEditorProps {
  style?: SxProps;
  json?: IQuestionInfoJson;
  genJsonRef?: MutableRefObject<(() => IQuestionInfoJson) | undefined>;
}

export default React.memo<ISubProblemEditorProps>(
  ({ style = {}, json, genJsonRef }) => {
    const [hasTitle, setHasTitle] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>('');
    const [hasContent, setHasContent] = React.useState<boolean>(false);
    const [content, setContent] = React.useState<string>('');
    const [hasExplanation, setHasExplanation] = React.useState<boolean>(false);
    const [explanation, setExplanation] = React.useState<string>('');
    const [subProblems, setSubProblems] = React.useState<
      [
        IQuestionSubProblemJson,
        MutableRefObject<(() => IQuestionSubProblemJson) | undefined>,
      ][]
    >(() => [[cloneDeep(EmptySubProblemJson), { current: undefined }]]);
    const [subProblemsIndex, setSubProblemsIndex] = React.useState<number>(0);

    React.useEffect(() => {
      if (json !== undefined) {
        if (json.title) {
          setHasTitle(true);
          setTitle(json.title);
        } else {
          setHasTitle(false);
          setTitle('');
        }
        if (json.content) {
          setHasContent(true);
          setContent(json.content);
        } else {
          setHasContent(false);
          setContent('');
        }
        setSubProblems(
          json.subproblems.map(subProblem => [
            subProblem,
            { current: undefined },
          ]),
        );
        setSubProblemsIndex(0);
      }
    }, [json]);

    const genJson = React.useCallback(() => {
      const len = subProblems.length;
      for (let i = 0; i < len; i++) {
        const subProblem = subProblems[i];
        const getSubProblemJson = subProblem[1].current;
        if (getSubProblemJson !== undefined) {
          subProblem[0] = getSubProblemJson();
        }
      }
      return cloneDeep({
        title: hasTitle ? title : undefined,
        type: '1',
        content: hasContent ? content : undefined,
        subproblems: subProblems.map(subProblem => subProblem[0]),
        explanation: hasExplanation ? explanation : undefined,
      });
    }, [
      hasTitle,
      title,
      hasContent,
      content,
      subProblems,
      hasExplanation,
      explanation,
    ]);

    React.useEffect(() => {
      if (genJsonRef) {
        genJsonRef.current = genJson;
      }
    }, [genJsonRef, genJson]);

    const subProblemTabs = React.useMemo(
      () =>
        subProblems.map((subProblem, index) => (
          <Tab
            label={
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>第 {index + 1} 题</Box>
                <Tooltip
                  title="删除题目"
                  placement="right"
                  sx={{ padding: '0', marginLeft: '5px' }}
                >
                  <IconButton
                    size="small"
                    color="inherit"
                    disabled={subProblems.length <= 1}
                    onClick={() => {
                      if (subProblems.length - subProblemsIndex <= 1) {
                        setSubProblemsIndex(Math.max(subProblemsIndex - 1, 0));
                      }
                      setSubProblems(
                        subProblems.filter((_subProblem, i) => i !== index),
                      );
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{ padding: '12px 8px 12px 16px' }}
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}/${subProblem[0].content}`}
          />
        )),
      [subProblems],
    );

    return (
      <Box sx={style}>
        <TextInput
          title="题目标题"
          value={title}
          setValue={setTitle}
          disabled={!hasTitle}
          setDisabled={value => setHasTitle(!value)}
        />
        <TextInput
          markdown
          title="题目描述(大题)"
          value={content}
          setValue={setContent}
          disabled={!hasContent}
          setDisabled={value => setHasContent(!value)}
        />
        <TextInput
          markdown
          title="题目解析(大题)"
          value={explanation}
          setValue={setExplanation}
          disabled={!hasExplanation}
          setDisabled={value => setHasExplanation(!value)}
        />
        <Box sx={{ display: 'flex' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRight: 1,
              borderColor: 'divider',
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={subProblemsIndex}
              onChange={(_event, value) => {
                const genJson = subProblems[subProblemsIndex][1].current;
                if (genJson) {
                  subProblems[subProblemsIndex][0] = genJson();
                  subProblems[subProblemsIndex][1].current = undefined;
                  setSubProblems([...subProblems]);
                }
                setSubProblemsIndex(value);
              }}
              sx={{ minWidth: '91px' }}
            >
              {subProblemTabs}
            </Tabs>
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                setSubProblems([
                  ...subProblems,
                  [cloneDeep(EmptySubProblemJson), { current: undefined }],
                ]);
              }}
            >
              添加
            </Button>
          </Box>
          {subProblems.length > 0 ? (
            <SubProblemEditor
              style={{ flexGrow: 1, width: 0 }}
              json={subProblems[subProblemsIndex][0]}
              genJsonRef={subProblems[subProblemsIndex][1]}
            />
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  },
);
