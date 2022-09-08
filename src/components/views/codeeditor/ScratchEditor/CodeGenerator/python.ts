import { BlockCodeGenerator, IBlockField, IBlockArguments } from './type';
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

interface IPythonBlockArguments extends IBlockArguments {
  importPackage: (packageName: string) => void;
}

const blockCodeGenerators: Record<
  string,
  BlockCodeGenerator<IPythonBlockArguments>
> = {
  // common
  data_variable: ({ field }) => {
    usingVariable(field.value!);
    return field.value!;
  },
  // motion
  motion_movesteps: ({ value }) => `move_steps(${value('STEPS')})`,
  motion_turnright: ({ value }) => `turn_right(${value('DEGREES')})`,
  motion_turnleft: ({ value }) => `turn_left(${value('DEGREES')})`,
  // event
  event_whenflagclicked: () => '',
  // calculate
  operator_add: ({ value }) =>
    `(float(${value('NUM1')}) + float(${value('NUM2')}))`,
  operator_subtract: ({ value }) =>
    `(float(${value('NUM1')}) - float(${value('NUM2')}))`,
  operator_multiply: ({ value }) =>
    `(float(${value('NUM1')}) * float(${value('NUM2')}))`,
  operator_divide: ({ value }) =>
    `(float(${value('NUM1')}) / float(${value('NUM2')}))`,
  operator_random: ({ value, importPackage }) => {
    importPackage('random');
    return `random.randint(int(${value('FROM')}), int(${value('TO')}))`;
  },
  operator_and: ({ value }) =>
    `(${value('OPERAND1')} and ${value('OPERAND2')})`,
  operator_or: ({ value }) => `(${value('OPERAND1')} or ${value('OPERAND2')})`,
  operator_not: ({ value }) => `(not ${value('OPERAND')})`,
  operator_join: ({ value }) => `(${value('STRING1')} + ${value('STRING2')})`,
  operator_letter_of: ({ value }) =>
    `${value('STRING')}[int(${value('LETTER')})]`,
  operator_length: ({ value }) => `len(${value('STRING')})`,
  operator_contains: ({ value }) =>
    `${value('STRING1')}.find(${value('STRING2')})`,
  operator_mod: ({ value }) =>
    `(float(${value('NUM1')}) % float(${value('NUM2')}))`,
  operator_round: ({ value }) => `round(float(${value('NUM')}))`,
  operator_mathop: ({ value, field, importPackage }) => {
    const num = `float(${value('NUM')})`;
    switch (field.value) {
      case 'abs': {
        return `abs(${num})`;
      }
      case 'floor': {
        return `int(${num})`;
      }
      case 'ceiling': {
        importPackage('math');
        return `math.ceil(${num})`;
      }
      case 'sqrt': {
        importPackage('math');
        return `math.sqrt(${num})`;
      }
      case 'sin': {
        importPackage('math');
        return `math.sin(${num})`;
      }
      case 'cos': {
        importPackage('math');
        return `math.cos(${num})`;
      }
      case 'tan': {
        importPackage('math');
        return `math.tan(${num})`;
      }
      case 'asin': {
        importPackage('math');
        return `math.asin(${num})`;
      }
      case 'acos': {
        importPackage('math');
        return `math.acos(${num})`;
      }
      case 'atan': {
        importPackage('math');
        return `math.atan(${num})`;
      }
      case 'ln': {
        importPackage('math');
        return `math.log(${num})`;
      }
      case 'log': {
        importPackage('math');
        return `math.log(${num}, 10)`;
      }
      case 'e ^': {
        importPackage('math');
        return `math.exp(${num})`;
      }
      case '10 ^': {
        return `pow(10, ${num})`;
      }
      default: {
        return '';
      }
    }
  },
  // control
  operator_equals: ({ value }) =>
    `(float(${value('OPERAND1')}) == float(${value('OPERAND2')}))`,
  operator_lt: ({ value }) =>
    `(float(${value('OPERAND1')}) < float(${value('OPERAND2')}))`,
  operator_gt: ({ value }) =>
    `(float(${value('OPERAND1')}) > float(${value('OPERAND2')}))`,
  control_if: ({ value, statement }) => [
    `if ${value('CONDITION')}:`,
    statement('SUBSTACK'),
    undefined,
  ],
  control_if_else: ({ value, statement }) => [
    `if ${value('CONDITION')}:`,
    statement('SUBSTACK'),
    'else:',
    statement('SUBSTACK2'),
    undefined,
  ],
  control_forever: ({ statement }) => [
    'while True:',
    statement('SUBSTACK'),
    undefined,
  ],
  control_repeat: ({ value, statement }) => {
    const tmpName = getTmpName();
    return [
      `for ${tmpName} in range(${value('TIMES')}):`,
      statement('SUBSTACK'),
      undefined,
    ];
  },
  control_repeat_until: ({ value, statement }) => [
    `while not ${value('CONDITION')}:`,
    statement('SUBSTACK'),
    undefined,
  ],
  // variable
  data_setvariableto: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value} = ${value('VALUE')}`;
  },
  data_changevariableby: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value} += ${value('VALUE')}`;
  },
  data_showvariable: ({ field }) => `""" show_var(${field.value}) """`,
  data_hidevariable: ({ field }) => `""" hide_var(${field.value}) """`,
  data_addtolist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}.append(${value('ITEM')})`;
  },
  data_deleteoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `del ${field.value}[${value('INDEX')} - 1]`;
  },
  data_deletealloflist: ({ field }) => {
    usingVariable(field.value!);
    return `${field.value} = []`;
  },
  data_insertatlist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}.insert(${value('INDEX')} - 1, ${value('ITEM')})`;
  },
  data_replaceitemoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}[${value('INDEX')} + 1] = ${value('ITEM')}`;
  },
  data_itemoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}[${value('INDEX')}]`;
  },
  data_itemnumoflist: ({ value, field }) => {
    usingVariable(field.value!);
    return `Math.max(0, ${field.value}.index(${value('ITEM')}))`;
  },
  data_lengthoflist: ({ field }) => {
    usingVariable(field.value!);
    return `len(${field.value})`;
  },
  data_listcontainsitem: ({ value, field }) => {
    usingVariable(field.value!);
    return `${field.value}.find(${value('ITEM')})`;
  },
  data_showlist: ({ field }) => `""" showList(${field.value}) """`,
  data_hidelist: ({ field }) => `""" hideList(${field.value}) """`,
};

let inEvent = false;
let inlineMode = false;
let indentLevel = 0;
let usingPackageNames: Record<string, boolean> = {};
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
    .map(line => `${indentText}${line.replace(/\t/g, indentUnit).trimEnd()}`)
    .join('\n');
};

const importPackage = (packageName: string) => {
  if (!usingPackageNames[packageName]) {
    usingPackageNames[packageName] = true;
  }
};

const recursiveCodeGenerator = (node: Element): string => {
  switch (node.tagName.toUpperCase()) {
    case 'XML': {
      const { length } = node.children;
      for (let i = 0; i < length; i++) {
        recursiveCodeGenerator(node.children[i]);
      }
      const importHeader = Object.keys(usingPackageNames).map(
        packageName => `import ${packageName}`,
      );
      if (importHeader.length > 0) {
        importHeader.push('');
      }

      const listVars = getVariables({ list: true });
      return [
        importHeader.join('\n'),
        listVars.length > 0 ? listVars.map(s => `${s} = []`).join('\n') : '',
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
        const _inEvent = inEvent;
        inEvent = true;
        const _inlineMode = inlineMode;
        inlineMode = true;
        const error = (message: string) => {
          throw new Error(`Error from ${type}: ${message}`);
        };
        const _cachedValues: Record<string, string> = {};
        const _cachedStatements: Record<string, string> = {};
        const _code = generator({
          type,
          field,
          error,
          importPackage,
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
                _cachedStatements[name] = makeIndent('pass');
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
    usingPackageNames = {};
    resetUtils();
    return recursiveCodeGenerator(xml);
  },
  registerBlock: (
    blockType: string,
    generator: BlockCodeGenerator<IPythonBlockArguments>,
  ) => (blockCodeGenerators[blockType] = generator),
};
