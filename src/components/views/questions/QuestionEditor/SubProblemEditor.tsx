import React, { MutableRefObject } from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import TextInput from './TextInput';
import EnumInput from './EnumInput';
import BooleanInput from './BooleanInput';

import { IQuestionSubProblemJson } from '@/types/json.d';
import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';

export interface ISubProblemEditorProps {
  style?: SxProps;
  json?: IQuestionSubProblemJson;
  genJsonRef?: MutableRefObject<(() => IQuestionSubProblemJson) | undefined>;
}

export default React.memo<ISubProblemEditorProps>(
  ({ json, genJsonRef, style = {} }) => {
    const [content, setContent] = React.useState<string>('');
    const [explanation, setExplanation] = React.useState<string>('');
    const [type, setType] = React.useState<string>('single');
    const [random, setRandom] = React.useState<boolean>(true);
    const [explanationVideo, setExplanationVideo] = React.useState<string>('');
    const [hasExplanationVideo, setHasExplanationVideo] =
      React.useState<boolean>(false);
    const optionsRef = React.useRef<[string, boolean][]>([]);
    const [optionChangeTimestamp, setOptionChangeTimestamp] =
      React.useState<number>(0);

    React.useEffect(() => {
      if (json !== undefined) {
        setContent(json.content);
        setExplanation(json.explanation);
        setType(json.type);
        setRandom(json.random !== false);
        if (json.explanationVideo) {
          setHasExplanationVideo(true);
          setExplanationVideo(json.explanationVideo);
        } else {
          setHasExplanationVideo(false);
          setExplanationVideo('');
        }
        optionsRef.current = json.options;
        setOptionChangeTimestamp(new Date().getTime());
      }
    }, [json]);

    const genJson = React.useCallback(() => {
      return {
        content,
        options: optionsRef.current,
        explanation,
        explanationVideo: hasExplanationVideo ? explanationVideo : undefined,
        type: type as 'single',
        random,
      };
    }, [
      content,
      explanation,
      type,
      hasExplanationVideo,
      explanationVideo,
      random,
    ]);

    React.useEffect(() => {
      if (genJsonRef) {
        genJsonRef.current = genJson;
      }
    }, [genJsonRef, genJson]);

    const optionBoxs = React.useMemo(
      () =>
        optionsRef.current.map((option, index) => (
          <Box
            // eslint-disable-next-line react/no-array-index-key
            key={`${index}/${option[0]}`}
            sx={{
              padding: '5px',
              margin: '10px 0',
              borderRadius: '5px',
              background: '#3331',
              border: '0.5px solid #FFF3',
            }}
          >
            <Box
              sx={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <ToggleButtonGroup
                value={option[1]}
                exclusive
                color={option[1] ? 'success' : 'error'}
                size="small"
                onChange={(_event, value) => {
                  if (type === 'single' && value !== true) {
                    return;
                  }
                  if (type === 'single') {
                    const len = optionsRef.current.length;
                    for (let i = 0; i < len; i++) {
                      optionsRef.current[i][1] = false;
                    }
                  }
                  optionsRef.current[index][1] = value === true;
                  setOptionChangeTimestamp(new Date().getTime());
                }}
              >
                <ToggleButton value={false}>
                  <CloseIcon />
                  &nbsp;错误选项&nbsp;
                </ToggleButton>
                <ToggleButton value={true}>
                  <CheckIcon />
                  &nbsp;正确选项&nbsp;
                </ToggleButton>
              </ToggleButtonGroup>
              <Button
                startIcon={<DeleteForeverIcon />}
                disabled={optionsRef.current.length <= 2}
                onClick={() => {
                  optionsRef.current = optionsRef.current.filter(
                    (_option, i) => i !== index,
                  );
                  setOptionChangeTimestamp(new Date().getTime());
                }}
              >
                删除选项
              </Button>
            </Box>
            <MixCodeEditor
              language="markdown"
              code={option[0]}
              onChange={(value: string) => {
                if (optionsRef.current[index]) {
                  optionsRef.current[index][0] = value;
                }
              }}
            />
          </Box>
        )),
      [optionsRef.current, optionChangeTimestamp],
    );

    return (
      <Box
        sx={{
          padding: '20px',
          ...style,
        }}
      >
        <TextInput
          markdown
          title="题目"
          value={content}
          setValue={setContent}
        />
        <TextInput
          markdown
          title="解析"
          value={explanation}
          setValue={setExplanation}
        />
        <TextInput
          title="解析视频"
          value={explanationVideo}
          setValue={setExplanationVideo}
          disabled={!hasExplanationVideo}
          setDisabled={value => setHasExplanationVideo(!value)}
        />
        <Box sx={{ paddingBottom: '20px' }}>
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
            选项
            <Button
              startIcon={<AddIcon />}
              onClick={() => {
                optionsRef.current.push(['', false]);
                setOptionChangeTimestamp(new Date().getTime());
              }}
              sx={{ marginLeft: '10px' }}
            >
              添加选项
            </Button>
          </Box>
          {optionBoxs}
        </Box>
        <BooleanInput title="打乱选项" value={random} setValue={setRandom} />
        <EnumInput
          title="题目类型"
          defaultValue="single"
          options={[['single', '单选题']]}
          value={type}
          setValue={setType}
        />
      </Box>
    );
  },
);
