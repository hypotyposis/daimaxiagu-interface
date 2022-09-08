import { CodeLanguageType } from '@/types/data';

export interface SnippetItem {
  id: string;
  iconTitle: string;
  title: string;
  document?: string;
  snippet: string;
  icon?: React.ReactNode;
}

const Snippets: Record<CodeLanguageType, SnippetItem[]> = {
  cpp: [
    {
      id: 'function::MoveForward',
      iconTitle: '向前',
      title: 'void moveForward()',
      snippet: '\nmoveForward();\n',
    },
    {
      id: 'function::MoveBackward',
      iconTitle: '向后',
      title: 'void moveBackward()',
      snippet: '\nmoveBackward();\n',
    },
    {
      id: 'function::TurnLeft',
      iconTitle: '左转',
      title: 'void turnLeft()',
      snippet: '\nturnLeft();\n',
    },
    {
      id: 'function::TurnRight',
      iconTitle: '右转',
      title: 'void turnRight()',
      snippet: '\nturnRight();\n',
    },
    {
      id: 'function::Collect',
      iconTitle: '收集',
      title: 'void collect()',
      snippet: '\ncollect();\n',
    },
    {
      id: 'function::UnlockScreen',
      iconTitle: '解锁',
      title: 'void unlock_screen()',
      snippet: '\nunlockScreen();\n',
    },
    {
      id: 'function::Hack',
      iconTitle: '骇入',
      title: 'void hack(entityType: string)',
      snippet: '\nhack("passwordDoor");\n',
    },
    {
      id: 'function::Toggle',
      iconTitle: '开关',
      title: 'void toggle(entityType: string)',
      snippet: '\ntoggle("switch");\n',
    },
    {
      id: 'function::Attack',
      iconTitle: '攻击',
      title: 'void attack()',
      snippet: '\nattack();\n',
    },
    {
      id: 'function::IsOn',
      iconTitle: '检查脚下',
      title: 'bool isOn(entityType: string)',
      snippet: 'isOn("switch")',
    },
    {
      id: 'function::IsOnOpenSwitch',
      iconTitle: '检查开关',
      document: '检测脚下是否有打开的开关',
      title: 'bool isOnOpenSwitch()',
      snippet: 'isOnOpenSwitch()',
    },
    {
      id: 'function::IsOnClosedSwitch',
      iconTitle: '检查开关',
      document: '检测脚下是否有关闭的开关',
      title: 'bool isOnClosedSwitch()',
      snippet: 'isOnClosedSwitch()',
    },
    {
      id: 'function::IsExistAhead',
      iconTitle: '检查前方',
      title: 'bool isExistAhead(entityType: string)',
      snippet: 'isExistAhead("switch")',
    },
    {
      id: 'grammar::If',
      iconTitle: 'if',
      title: '单分支条件判断',
      snippet: '\nif (/* 判断条件 */) {\n    /* 代码块 */\n}\n',
    },
    {
      id: 'grammar::IfElse',
      iconTitle: 'if..else',
      title: '双分支条件判断',
      snippet:
        '\nif (/* 判断条件 */) {\n    /* 代码块 */\n} else {\n    /* 代码块 */\n}\n',
    },
    {
      id: 'grammar::For',
      iconTitle: 'for',
      title: 'for循环',
      snippet:
        '\nfor (/* 初始化 */; /* 循环条件 */; /* 循环更新 */) {\n    /* 代码块 */\n}\n',
    },
    {
      id: 'grammar::While',
      iconTitle: 'while',
      title: 'while循环',
      snippet: '\nwhile (/* 循环条件 */) {\n    /* 代码块 */\n}\n',
    },
    {
      id: 'grammar::Function',
      iconTitle: '函数',
      title: '定义一个函数',
      snippet: '\nvoid func(/* 参数 */) {\n    /* 代码块 */\n}\n',
    },
  ],
  python: [
    {
      id: 'function::MoveForward',
      iconTitle: '向前',
      title: 'move_forward() -> None',
      snippet: '\nmove_forward()\n',
    },
    {
      id: 'function::MoveBackward',
      iconTitle: '向后',
      title: 'move_backward() -> None',
      snippet: '\nmove_backward()\n',
    },
    {
      id: 'function::TurnLeft',
      iconTitle: '左转',
      title: 'turn_left() -> None',
      snippet: '\nturn_left()\n',
    },
    {
      id: 'function::TurnRight',
      iconTitle: '右转',
      title: 'turn_right() -> None',
      snippet: '\nturn_right()\n',
    },
    {
      id: 'function::Collect',
      iconTitle: '收集',
      title: 'void collect()',
      snippet: '\ncollect()\n',
    },
    {
      id: 'function::UnlockScreen',
      iconTitle: '解锁',
      title: 'unlock_screen() -> None',
      snippet: '\nunlock_screen()\n',
    },
    {
      id: 'function::Hack',
      iconTitle: '骇入',
      title: 'hack(entity_type: str) -> None',
      snippet: '\nhack("passwordDoor")\n',
    },
    {
      id: 'function::Toggle',
      iconTitle: '开关',
      title: 'toggle(entity_type: str) -> None',
      snippet: '\ntoggle("switch")\n',
    },
    {
      id: 'function::Attack',
      iconTitle: '攻击',
      title: 'attack() -> None',
      snippet: '\nattack()\n',
    },
    {
      id: 'function::IsOn',
      iconTitle: '检查脚下',
      title: 'is_on(entity_type: str) -> boolean',
      snippet: 'is_on("passwordDoor")',
    },
    {
      id: 'function::IsOnOpenSwitch',
      iconTitle: '检查开关',
      document: '检测脚下是否有打开的开关',
      title: 'is_on_open_switch() -> boolean',
      snippet: 'is_on_open_switch()',
    },
    {
      id: 'function::IsOnClosedSwitch',
      iconTitle: '检查开关',
      document: '检测脚下是否有关闭的开关',
      title: 'is_on_closed_switch() -> boolean',
      snippet: 'is_on_closed_switch()',
    },
    {
      id: 'function::IsExistAhead',
      iconTitle: '检查前方',
      title: 'is_exist_ahead(entity_type: str) -> boolean',
      snippet: 'is_exist_ahead("passwordDoor")',
    },
    {
      id: 'grammar::If',
      iconTitle: 'if',
      title: '单分支条件判断',
      snippet: '\nif """判断条件""":\n    # 代码块\n',
    },
    {
      id: 'grammar::IfElse',
      iconTitle: 'if..else',
      title: '双分支条件判断',
      snippet: '\nif """判断条件""":\n    # 代码块\nelse:\n    # 代码块\n',
    },
    {
      id: 'grammar::For',
      iconTitle: 'for',
      title: 'for循环',
      snippet: '\nfor i in range("""循环次数"""):\n    # 代码块\n',
    },
    {
      id: 'grammar::While',
      iconTitle: 'while',
      title: 'while循环',
      snippet: '\nwhile """循环条件""":\n    # 代码块\n',
    },
    {
      id: 'grammar::Function',
      iconTitle: '函数',
      title: '定义一个函数',
      snippet: '\ndef func("""参数"""):\n    # 代码块\n',
    },
  ],
  scratch: [],
  go: [],
};

export default Snippets;
