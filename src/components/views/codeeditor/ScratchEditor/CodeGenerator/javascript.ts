import { BlockCodeGenerator, IBlockField } from './type';
import {
  isArray,
  getTmpName,
  resetUtils,
  registerVariable,
  getVariables,
  usingVariable,
  pushBlocks,
  getBlocks,
} from './utils';

const blockCodeGenerators: Record<string, BlockCodeGenerator> = {
  // common
  data_variable: ({ field }) => {
    usingVariable(field.value!);
    return field.value!;
  },
  // motion
  motion_movesteps: ({ value }) => `moveSteps(${value('STEPS')});`,
  motion_turnright: ({ value }) => `turnRight(${value('DEGREES')});`,
  motion_turnleft: ({ value }) => `turnLeft(${value('DEGREES')});`,
  // event
  event_whenflagclicked: () => '',
  // calculate
  operator_add: ({ value }) =>
    `(parseFloat(${value('NUM1')}, 10) + parseFloat(${value('NUM2')}, 10))`,
  operator_subtract: ({ value }) =>
    `(parseFloat(${value('NUM1')}, 10) - parseFloat(${value('NUM2')}, 10))`,
  operator_multiply: ({ value }) =>
    `(parseFloat(${value('NUM1')}, 10) * parseFloat(${value('NUM2')}, 10))`,
  operator_divide: ({ value }) =>
    `(parseFloat(${value('NUM1')}, 10) / parseFloat(${value('NUM2')}, 10))`,
  operator_random: ({ value }) =>
    `((from,to)=>Math.floor(Math.random()*(to-from+1)+from))(parseInt(${value(
      'FROM',
    )}, 10), parseInt(${value('TO')}, 10))`,
  operator_and: ({ value }) => `(${value('OPERAND1')} && ${value('OPERAND2')})`,
  operator_or: ({ value }) => `(${value('OPERAND1')} || ${value('OPERAND2')})`,
  operator_not: ({ value }) => `(!${value('OPERAND')})`,
  operator_join: ({ value }) => `(${value('STRING1')} + ${value('STRING2')})`,
  operator_letter_of: ({ value }) =>
    `${value('STRING')}[parseInt(${value('LETTER')}, 10)]`,
  operator_length: ({ value }) => `${value('STRING')}.length`,
  operator_contains: ({ value }) =>
    `(${value('STRING1')}.indexOf(${value('STRING2')}) > -1)`,
  operator_mod: ({ value }) =>
    `(parseFloat(${value('NUM1')}, 10) % parseFloat(${value('NUM2')}, 10))`,
  operator_round: ({ value }) => `Math.round(parseFloat(${value('NUM')}, 10))`,
  operator_mathop: ({ value, field }) => {
    const num = `parseFloat(${value('NUM')}, 10)`;
    switch (field.value) {
      case 'abs': {
        return `Math.abs(${num})`;
      }
      case 'floor': {
        return `Math.floor(${num})`;
      }
      case 'ceiling': {
        return `Math.ceil(${num})`;
      }
      case 'sqrt': {
        return `Math.sqrt(${num})`;
      }
      case 'sin': {
        return `Math.sin(${num})`;
      }
      case 'cos': {
        return `Math.cos(${num})`;
      }
      case 'tan': {
        return `Math.tan(${num})`;
      }
      case 'asin': {
        return `Math.asin(${num})`;
      }
      case 'acos': {
        return `Math.acos(${num})`;
      }
      case 'atan': {
        return `Math.atan(${num})`;
      }
      case 'ln': {
        return `Math.log(${num})`;
      }
      case 'log': {
        return `Math.log10(${num})`;
      }
      case 'e ^': {
        return `Math.exp(${num})`;
      }
      case '10 ^': {
        return `Math.pow(10, ${num})`;
      }
      default: {
        return '';
      }
    }
  },
  // control
  operator_equals: ({ value }) =>
    `(parseFloat(${value('OPERAND1')}, 10) === parseFloat(${value(
      'OPERAND1',
    )}, 10))`,
  operator_lt: ({ value }) =>
    `(parseFloat(${value('OPERAND1')}, 10) < parseFloat(${value(
      'OPERAND1',
    )}, 10))`,
  operator_gt: ({ value }) =>
    `(parseFloat(${value('OPERAND1')}, 10) > parseFloat(${value(
      'OPERAND1',
    )}, 10))`,
  control_if: ({ value, statement }) => [
    `if (${value('CONDITION')}) {`,
    statement('SUBSTACK'),
    '}',
  ],
  control_if_else: ({ value, statement }) => [
    `if (${value('CONDITION')}) {`,
    statement('SUBSTACK'),
    '} else {',
    statement('SUBSTACK2'),
    '}',
  ],
  control_forever: ({ statement }) => [
    'while (true) {',
    statement('SUBSTACK'),
    '}',
  ],
  control_repeat: ({ value, statement }) => {
    const tmpName = getTmpName();
    return [
      `for (let ${tmpName} = 1; ${tmpName} <= ${value(
        'TIMES',
      )}; ${tmpName}++) {`,
      statement('SUBSTACK'),
      '}',
    ];
  },
  control_repeat_until: ({ value, statement }) => [
    `while (!${value('CONDITION')}) {`,
    statement('SUBSTACK'),
    '}',
  ],
  // variable
  data_setvariableto: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value} = ${value('VALUE')};`;
  },
  data_changevariableby: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value} += ${value('VALUE')};`;
  },
  data_showvariable: ({ field }) => `/* showVar(${field.value}); */`,
  data_hidevariable: ({ field }) => `/* hideVar(${field.value}); */`,
  data_addtolist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}.push(${value('ITEM')});`;
  },
  data_deleteoflist: ({ value, field }) => {
    const tmpName = getTmpName();
    usingVariable(field.value!);
    return `${field.value} = ${
      field.value
    }.filter((_, ${tmpName}) => (${tmpName}+1) !== ${value('INDEX')});`;
  },
  data_deletealloflist: ({ field }) => {
    usingVariable(field.value!);
    return `${field.value} = [];`;
  },
  data_insertatlist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value} = [...${field.value}.slice(0, ${value(
      'INDEX',
    )} - 1), ${value('ITEM')}, ...${field.value}.slice(${value('INDEX')})];`;
  },
  data_replaceitemoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}[${value('INDEX')} + 1] = ${value('ITEM')};`;
  },
  data_itemoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}[${value('INDEX')}]`;
  },
  data_itemnumoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `Math.max(0, ${field.value}.indexOf(${value('ITEM')}))`;
  },
  data_lengthoflist: ({ field }) => {
    usingVariable(field.value!);
    return `${field.value}.length`;
  },
  data_listcontainsitem: ({ value, field }) => {
    usingVariable(field.value!);
    return `(${field.value}.indexOf(${value('ITEM')}) > -1)`;
  },
  data_showlist: ({ field }) => `/* showList(${field.value}); */`,
  data_hidelist: ({ field }) => `/* hideList(${field.value}); */`,
};

let inEvent = false;
let inlineMode = false;
let indentLevel = 0;
const indentUnit = '    ';
const indentTextMap: Record<number, string> = {};
const makeIndent = (text: string | string[]): string => {
  if (indentTextMap[indentLevel] === undefined) {
    const tmp = [];
    for (let i = 0; i < indentLevel; i++) {
      tmp.push(indentUnit);
    }
    indentTextMap[indentLevel] = tmp.join('');
  }
  const indentText = indentTextMap[indentLevel];
  const lines = isArray(text)
    ? (text as string[])
    : (text as string).split('\n');
  return lines
    .map(line => `${indentText}${line.replace(/\t/g, indentUnit).trim()}`)
    .join('\n');
};

const recursiveCodeGenerator = (node: Element): string => {
  switch (node.tagName.toUpperCase()) {
    case 'XML': {
      const { length } = node.children;
      for (let i = 0; i < length; i++) {
        recursiveCodeGenerator(node.children[i]);
      }
      const singleVars = getVariables({ single: true });
      const listVars = getVariables({ list: true });
      return [
        singleVars.length > 0 ? `let ${singleVars.join(', ')};` : '',
        listVars.length > 0
          ? `let ${listVars.map(s => `${s} = []`).join(', ')};`
          : '',
        getBlocks('event_whenflagclicked')
          .map(obj => obj.code)
          .join('\n'),
      ]
        .filter(s => s !== '')
        .join('\n');
    }
    case 'VARIABLES': {
      const { length } = node.children;
      for (let i = 0; i < length; i++) {
        recursiveCodeGenerator(node.children[i]);
      }
      return '';
    }
    case 'VARIABLE': {
      switch (node.getAttribute('type')?.toLowerCase()) {
        case 'list': {
          registerVariable(node.textContent!, 'list');
          break;
        }
        default: {
          registerVariable(node.textContent!, 'single');
          break;
        }
      }
      return '';
    }
    case 'BLOCK': {
      const values: Record<string, Element> = {};
      const statements: Record<string, Element> = {};
      let field: IBlockField = {};
      let next: Element | undefined;
      const { length } = node.children;
      for (let i = 0; i < length; i++) {
        const child = node.children[i];
        switch (child.tagName.toUpperCase()) {
          case 'VALUE': {
            values[child.getAttribute('name') ?? ''] = child;
            break;
          }
          case 'FIELD': {
            field = {
              name: child.getAttribute('name')?.toUpperCase(),
              variabletype: child.getAttribute('variabletype')?.toLowerCase(),
              value: child.textContent ?? undefined,
            };
            break;
          }
          case 'STATEMENT': {
            statements[child.getAttribute('name') ?? ''] = child.children[0];
            break;
          }
          case 'NEXT': {
            next = child.children[0];
            break;
          }
          default: {
            break;
          }
        }
      }
      const type = node.getAttribute('type') ?? '';
      const generator = blockCodeGenerators[type];
      if (generator) {
        const _inlineMode = inlineMode;
        inlineMode = true;
        const _inEvent = inEvent;
        inEvent = true;
        const error = (message: string) => {
          throw new Error(`Error from ${type}: ${message}`);
        };
        const _cachedValues: Record<string, string> = {};
        const _cachedStatements: Record<string, string> = {};
        const _code = generator({
          type,
          field,
          error,
          value: (name: string) => {
            if (values[name] === undefined) {
              error(`Missing value: ${name}`);
              return '';
            }
            if (_cachedValues[name] === undefined) {
              _cachedValues[name] = recursiveCodeGenerator(values[name]);
            }
            return _cachedValues[name];
          },
          statement: (name: string) => {
            if (_cachedStatements[name] === undefined) {
              const _inlineMode: boolean = inlineMode;
              inlineMode = true;
              indentLevel++;
              if (statements[name] === undefined) {
                _cachedStatements[name] = makeIndent('');
              } else {
                _cachedStatements[name] = recursiveCodeGenerator(
                  statements[name],
                );
              }
              indentLevel--;
              inlineMode = _inlineMode;
            }
            return _cachedStatements[name];
          },
        });
        inlineMode = _inlineMode;
        let code: (string | undefined)[];
        if (isArray(_code)) {
          code = _code as (string | undefined)[];
        } else if (_code) {
          code = [_code as string];
        } else {
          code = [];
        }
        const len = code.length;
        const parts = [];
        for (let i = 0; i < len; i++) {
          const codeLine = code[i];
          if (codeLine !== undefined) {
            parts.push(
              i % 2 === 0 && inlineMode ? makeIndent(codeLine) : codeLine,
            );
          }
        }
        if (next) {
          parts.push(recursiveCodeGenerator(next));
        }
        inEvent = _inEvent;
        if (inEvent) {
          return parts.join('\n');
        } else {
          pushBlocks(type, parts.join('\n'));
          return '';
        }
      } else {
        throw new Error(`Code generator of block '${type}' is not defined.`);
      }
    }
    case 'VALUE': {
      return recursiveCodeGenerator(node.children[node.children.length - 1]);
    }
    case 'SHADOW': {
      switch (node.getAttribute('type')?.toLowerCase() ?? '') {
        case 'math_number':
        case 'math_whole_number':
        case 'math_positive_number':
        case 'math_integer':
        case 'math_angle': {
          return node.children[0].textContent ?? '';
        }
        default: {
          return `'${node.children[0].textContent?.replace(/'/g, "'") ?? ''}'`;
        }
      }
    }
    default: {
      return '';
    }
  }
};

export default {
  generateFromXml: (xml: Element) => {
    indentLevel = 0;
    inEvent = false;
    inlineMode = false;
    resetUtils();
    return recursiveCodeGenerator(xml);
  },
  registerBlock: (blockType: string, generator: BlockCodeGenerator) =>
    (blockCodeGenerators[blockType] = generator),
};
