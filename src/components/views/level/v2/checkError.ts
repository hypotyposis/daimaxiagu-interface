import { CodeLanguageType } from '@/types/data.d';

export interface ErrorMessage {
  type?: string;
  line: number;
  column: number;
  message: string;
}

const cppCompileErrorRegExp = /\s*:\s*(\d+)\s*:\s*(\d+)\s*:\s*(\w+)\s*:\s*(.*)/;
const pythonRuntimeErrorRegExp1 =
  /\s*File\s*"([^"]+)",\s*line\s*(\d+)(?:,\s*in\s*([^\s]+))?/;
const pythonRuntimeErrorRegExp2 = /\s*(\w+)\s*:\s*(.*)/;

export const checkError = (
  language: CodeLanguageType,
  lineOffset: number,
  stage: 'compile' | 'runtime',
  text: string,
): ErrorMessage[] => {
  const errors = [];
  switch (language) {
    case 'cpp': {
      if (stage === 'compile') {
        const messageLines = text.split('\n').map(line => line.trim());
        const len = messageLines.length;
        for (let i = 0; i < len; i++) {
          const messageResult = cppCompileErrorRegExp.exec(messageLines[i]);
          if (messageResult) {
            errors.push({
              line: parseInt(messageResult[1], 10) - lineOffset,
              column: parseInt(messageResult[2], 10),
              type: '语法',
              message: messageResult[4],
            });
          }
        }
      } else {
        errors.push({
          line: -1,
          column: -1,
          message: '运行时错误',
        });
      }
      break;
    }
    case 'python': {
      if (stage === 'runtime') {
        const messageLines = text
          .replace(/^Traceback (most recent call last):\n+/g, '')
          .trim()
          .split('\n')
          .map(line => line.trim());
        const len = messageLines.length;
        let line = -1;
        for (let i = 0; i < len; i++) {
          const messageResult = pythonRuntimeErrorRegExp1.exec(messageLines[i]);
          if (messageResult) {
            const module = messageResult[3];
            if (module === '<module>') {
              continue;
            }
            if (module === undefined) {
              line = parseInt(messageResult[2] ?? '0', 10) - lineOffset;
            }
            const messageReult2 = pythonRuntimeErrorRegExp2.exec(
              messageLines[len - 1],
            );
            if (messageReult2) {
              errors.push({
                line: parseInt(messageResult[2], 10) - lineOffset,
                column: -1,
                type:
                  {
                    TypeError: '类型错误',
                    SyntaxError: '语法错误',
                  }[messageReult2[1]?.trim()] ?? messageReult2[1]?.trim(),
                message: messageReult2[2]?.trim() ?? '未知',
              });
            } else if (!pythonRuntimeErrorRegExp1.test(messageLines[len - 1])) {
              errors.push({
                line: parseInt(messageResult[2], 10) - lineOffset,
                column: -1,
                type: '',
                message: messageLines[len - 1].trim(),
              });
            }
            break;
          }
        }
        if (errors.length === 0) {
          errors.push({
            line,
            column: -1,
            type: '',
            message: '语法错误',
          });
        }
      } else {
        errors.push({
          line: 0,
          column: 0,
          message: text,
        });
      }
      break;
    }
    default: {
      break;
    }
  }
  return errors;
};
