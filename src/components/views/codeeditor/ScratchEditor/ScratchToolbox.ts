export default `<xml id="toolbox-categories" style="display: none">
<category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC">
    <block type="function::MoveForward" id="function::MoveForward"></block>
    <block type="function::MoveBackward" id="function::MoveBackward"></block>
    <block type="function::TurnRight" id="function::TurnRight"></block>
    <block type="function::TurnLeft" id="function::TurnLeft"></block>
    <block type="function::Collect" id="function::Collect"></block>
    <block type="function::UnlockScreen" id="function::UnlockScreen">
        <next>
            <block type="grammar::InputInteger" id="grammar::InputInteger"></block>
        </next>
    </block>
    <block type="grammar::InputInteger" id="grammar::InputInteger"></block>
    <block type="grammar::InputFloat" id="grammar::InputFloat"></block>
    <block type="grammar::InputString" id="grammar::InputString"></block>
    <block type="function::Hack" id="function::Hack">
        <value name="VALUE">
            <shadow type="text">
                <field name="TEXT">Hello World</field>
            </shadow>
        </value>
    </block>
    <block type="function::Toggle" id="function::Toggle"></block>
    <block type="function::Attack" id="function::Attack"></block>
</category>
<category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
    <block type="event_whenflagclicked" id="event_whenflagclicked"></block>
</category>
<category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">
    <block type="control_repeat" id="control_repeat">
        <value name="TIMES">
            <shadow type="math_whole_number">
                <field name="NUM">10</field>
            </shadow>
        </value>
    </block>
    <block type="control_forever" id="control_forever"></block>
    <block type="control_if" id="control_if"></block>
    <block type="control_if_else" id="control_if_else"></block>
    <block type="control_repeat_until" id="control_repeat_until"></block>
    <block type="control_stop" id="control_stop"></block>
</category>
<category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
    <block type="function::IsOn" id="function::IsOn"></block>
    <block type="function::IsOnOpenSwitch" id="function::IsOnOpenSwitch"></block>
    <block type="function::IsOnClosedSwitch" id="function::IsOnClosedSwitch"></block>
    <block type="function::IsExistAhead" id="function::IsExistAhead"></block>
</category>
<category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">
    <block type="operator_add" id="operator_add">
        <value name="NUM1">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
        <value name="NUM2">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_subtract" id="operator_subtract">
        <value name="NUM1">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
        <value name="NUM2">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_multiply" id="operator_multiply">
        <value name="NUM1">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
        <value name="NUM2">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_divide" id="operator_divide">
        <value name="NUM1">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
        <value name="NUM2">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_random" id="operator_random">
        <value name="FROM">
            <shadow type="math_number">
                <field name="NUM">1</field>
            </shadow>
        </value>
        <value name="TO">
            <shadow type="math_number">
                <field name="NUM">10</field>
            </shadow>
        </value>
    </block>
    <block type="operator_lt" id="operator_lt">
        <value name="OPERAND1">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
        <value name="OPERAND2">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_equals" id="operator_equals">
        <value name="OPERAND1">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
        <value name="OPERAND2">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_gt" id="operator_gt">
        <value name="OPERAND1">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
        <value name="OPERAND2">
            <shadow type="text">
                <field name="TEXT"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_and" id="operator_and"></block>
    <block type="operator_or" id="operator_or"></block>
    <block type="operator_not" id="operator_not"></block>
    <block type="operator_join" id="operator_join">
        <value name="STRING1">
            <shadow type="text">
                <field name="TEXT">hello</field>
            </shadow>
        </value>
        <value name="STRING2">
            <shadow type="text">
                <field name="TEXT">world</field>
            </shadow>
        </value>
    </block>
    <block type="operator_letter_of" id="operator_letter_of">
        <value name="LETTER">
            <shadow type="math_whole_number">
                <field name="NUM">1</field>
            </shadow>
        </value>
        <value name="STRING">
            <shadow type="text">
                <field name="TEXT">world</field>
            </shadow>
        </value>
    </block>
    <block type="operator_length" id="operator_length">
        <value name="STRING">
            <shadow type="text">
                <field name="TEXT">world</field>
            </shadow>
        </value>
    </block>
    <block type="operator_contains" id="operator_contains">
        <value name="STRING1">
            <shadow type="text">
                <field name="TEXT">hello</field>
            </shadow>
        </value>
        <value name="STRING2">
            <shadow type="text">
                <field name="TEXT">world</field>
            </shadow>
        </value>
    </block>
    <block type="operator_mod" id="operator_mod">
        <value name="NUM1">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
        <value name="NUM2">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_round" id="operator_round">
        <value name="NUM">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
    <block type="operator_mathop" id="operator_mathop">
        <value name="NUM">
            <shadow type="math_number">
                <field name="NUM"></field>
            </shadow>
        </value>
    </block>
</category>
<category name="%{BKY_CATEGORY_VARIABLES}" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="VARIABLE"></category>
</xml>
`;
