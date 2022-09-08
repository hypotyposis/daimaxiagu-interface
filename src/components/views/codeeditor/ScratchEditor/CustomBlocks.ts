/* eslint-disable @babel/no-invalid-this */
// Note: this (in Blocks definitions) = Blockly.Block
import ScratchBlocks from 'scratch-blocks';
import python from './CodeGenerator/python';
import javascript from './CodeGenerator/javascript';

const EntityType = [
  ['晶体管', 'transistor'],
  ['开关', 'switch'],
  ['激光', 'leser'],
  ['出口', 'exit'],
  ['终端', 'inputSource'],
  ['密码门', 'passwordDoor'],
  ['传送门', 'portal'],
  ['坏掉的机器人', 'brokenRobot'],
];

ScratchBlocks.Blocks['function::MoveForward'] = {
  init() {
    this.jsonInit({
      message0: '前进',
      tooltip: '让角色前进一步',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::MoveForward', () => `move_forward()`);
javascript.registerBlock('function::MoveForward', () => `moveForward();`);

ScratchBlocks.Blocks['function::MoveBackward'] = {
  init() {
    this.jsonInit({
      message0: '后退',
      tooltip: '后撤步~ 777',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::MoveBackward', () => `move_backward()`);
javascript.registerBlock('function::MoveBackward', () => `moveBackward();`);

ScratchBlocks.Blocks['function::TurnRight'] = {
  init() {
    this.jsonInit({
      message0: '右转 %1',
      tooltip: '让角色右转',
      args0: [
        {
          type: 'field_image',
          src: `${ScratchBlocks.mainWorkspace.options.pathToMedia}rotate-right.svg`,
          width: 24,
          height: 24,
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::TurnRight', () => `turn_right()`);
javascript.registerBlock('function::TurnRight', () => `turnRight();`);

ScratchBlocks.Blocks['function::TurnLeft'] = {
  init() {
    this.jsonInit({
      message0: '左转 %1',
      tooltip: '让角色左转',
      args0: [
        {
          type: 'field_image',
          src: `${ScratchBlocks.mainWorkspace.options.pathToMedia}rotate-left.svg`,
          width: 24,
          height: 24,
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::TurnLeft', () => `turn_left()`);
javascript.registerBlock('function::TurnLeft', () => `turnLeft();`);

ScratchBlocks.Blocks['function::TurnLeft'] = {
  init() {
    this.jsonInit({
      message0: '左转 %1',
      tooltip: '让角色左转',
      args0: [
        {
          type: 'field_image',
          src: `${ScratchBlocks.mainWorkspace.options.pathToMedia}rotate-left.svg`,
          width: 24,
          height: 24,
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::TurnLeft', () => `turn_left()`);
javascript.registerBlock('function::TurnLeft', () => `turnLeft();`);

ScratchBlocks.Blocks['function::Collect'] = {
  init() {
    this.jsonInit({
      message0: '收集',
      tooltip: '让角色收集物品',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::Collect', () => `collect()`);
javascript.registerBlock('function::Collect', () => `collect();`);

ScratchBlocks.Blocks['function::UnlockScreen'] = {
  init() {
    this.jsonInit({
      message0: '解锁屏幕',
      tooltip: '解锁屏幕以便输入',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::UnlockScreen', () => `unlock_screen()`);
javascript.registerBlock('function::UnlockScreen', () => `unlockScreen();`);

ScratchBlocks.Blocks['grammar::InputInteger'] = {
  init() {
    this.jsonInit({
      message0: '从解锁的屏幕读取整数到变量 %1',
      tooltip: '读取数据并存入变量',
      args0: [
        {
          type: 'field_variable',
          name: 'VARIABLE',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock(
  'grammar::InputInteger',
  ({ field }) => `${field.value} = int(input())`,
);
javascript.registerBlock('grammar::InputInteger', () => ``);

ScratchBlocks.Blocks['grammar::InputFloat'] = {
  init() {
    this.jsonInit({
      message0: '从解锁的屏幕读取实数到变量 %1',
      tooltip: '读取数据并存入变量',
      args0: [
        {
          type: 'field_variable',
          name: 'VARIABLE',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock(
  'grammar::InputFloat',
  ({ field }) => `${field.value} = float(input())`,
);
javascript.registerBlock('grammar::InputFloat', () => ``);

ScratchBlocks.Blocks['grammar::InputString'] = {
  init() {
    this.jsonInit({
      message0: '从解锁的屏幕读取字符串到变量 %1',
      tooltip: '读取数据并存入变量',
      args0: [
        {
          type: 'field_variable',
          name: 'VARIABLE',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock(
  'grammar::InputString',
  ({ field }) => `${field.value} = input()`,
);
javascript.registerBlock('grammar::InputString', () => ``);

ScratchBlocks.Blocks['function::Hack'] = {
  init() {
    this.jsonInit({
      message0: '使用 %1 骇入面前的密码门',
      tooltip: '输出结果, 打开面前的密码门',
      args0: [
        {
          type: 'input_value',
          name: 'VALUE',
        },
      ],
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock(
  'function::Hack',
  ({ value }) => `print(${value('VALUE')})\nhack('passwordDoor')`,
);
javascript.registerBlock(
  'function::Hack',
  ({ value }) => `console.log(${value('VALUE')});\nhack('passwordDoor');`,
);

ScratchBlocks.Blocks['function::Toggle'] = {
  init() {
    this.jsonInit({
      message0: '开启/关闭开关',
      tooltip: '让角色开启/关闭开关',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::Toggle', () => `toggle('switch')`);
javascript.registerBlock('function::Toggle', () => `toggle('switch');`);

ScratchBlocks.Blocks['function::Attack'] = {
  init() {
    this.jsonInit({
      message0: '攻击',
      tooltip: '让角色攻击障碍物或者敌人',
      category: ScratchBlocks.Categories.motion,
      extensions: ['colours_motion', 'shape_statement'],
    });
  },
};
python.registerBlock('function::Attack', () => `attack()`);
javascript.registerBlock('function::Attack', () => `attack();`);

ScratchBlocks.Blocks['function::IsOn'] = {
  init() {
    this.jsonInit({
      message0: '当前位置有 %1 ?',
      tooltip: '检测当前位置是否有某种类型的实体',
      args0: [
        {
          type: 'field_dropdown',
          name: 'ENTITY_TYPE',
          options: EntityType,
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};
python.registerBlock(
  'function::IsOn',
  ({ field }) => `is_on('${field.value}')`,
);
javascript.registerBlock(
  'function::IsOn',
  ({ field }) => `isOn('${field.value}')`,
);

ScratchBlocks.Blocks['function::IsOnOpenSwitch'] = {
  init() {
    this.jsonInit({
      message0: '脚下是打开的开关?',
      tooltip: '检测脚下是否有打开的开关',
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};
python.registerBlock('function::IsOnOpenSwitch', () => `is_on_open_switch()`);
javascript.registerBlock('function::IsOnOpenSwitch', () => `isOnOpenSwitch()`);

ScratchBlocks.Blocks['function::IsOnClosedSwitch'] = {
  init() {
    this.jsonInit({
      message0: '脚下有关闭的开关?',
      tooltip: '检测脚下是否有关闭的开关',
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};
python.registerBlock(
  'function::IsOnClosedSwitch',
  () => `is_on_closed_switch()`,
);
javascript.registerBlock(
  'function::IsOnClosedSwitch',
  () => `isOnClosedSwitch()`,
);

ScratchBlocks.Blocks['function::IsExistAhead'] = {
  init() {
    this.jsonInit({
      message0: '前方有 %1 ?',
      tooltip: '检测前方位置是否有某种类型的实体',
      args0: [
        {
          type: 'field_dropdown',
          name: 'ENTITY_TYPE',
          options: EntityType,
        },
      ],
      category: ScratchBlocks.Categories.sensing,
      extensions: ['colours_sensing', 'output_boolean'],
    });
  },
};
python.registerBlock(
  'function::IsExistAhead',
  ({ field }) => `is_exist_ahead('${field.value}')`,
);
javascript.registerBlock(
  'function::IsExistAhead',
  ({ field }) => `isExistAhead('${field.value}')`,
);

/* eslint-enable @babel/no-invalid-this */
