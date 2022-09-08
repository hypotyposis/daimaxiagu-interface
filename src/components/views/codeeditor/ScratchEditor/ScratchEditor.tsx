import React from 'react';
import { throttle } from 'lodash';
import ScratchBlocks from 'scratch-blocks';
import {
  IMixCodeEditorArguments,
  MixCodeEditorType,
  IMixCodeEditorInstance,
} from '../editor.d';
import python from './CodeGenerator/python';
import './CustomBlocks';
import toolbox from './ScratchToolbox';
import { OSS_PUBLIC_ASSETS_BASE } from '@/utils/config';

import './style.css';

export class ScratchEditorInstance implements IMixCodeEditorInstance {
  type: MixCodeEditorType = MixCodeEditorType.Scratch;

  instance: any;

  setValue: (value: string) => void;

  constructor(view: any) {
    this.instance = view;
    this.setValue = throttle(
      (value: string) => {
        this.instance.clear();
        this.instance.clearUndo();
        try {
          ScratchBlocks.Xml.domToWorkspace(
            ScratchBlocks.Xml.textToDom(value),
            this.instance,
          );
        } catch (e) {
          console.error(e);
        }
      },
      200,
      { leading: true, trailing: true },
    );
  }

  getValue() {
    return ScratchBlocks.Xml.domToText(
      ScratchBlocks.Xml.workspaceToDom(this.instance),
    );
  }

  getCode() {
    return python.generateFromXml(
      ScratchBlocks.Xml.workspaceToDom(this.instance),
    );
  }
}

export type ScratchOnChange = (xmlString: string) => void;

ScratchBlocks.ScratchMsgs.setLocale('zh-cn');
// ScratchBlocks.FieldColourSlider.activateEyedropper_ =
//   this.props.onActivateColorPicker;
// ScratchBlocks.Procedures.externalProcedureDefCallback =
//   this.props.onActivateCustomProcedures;

export default React.memo<IMixCodeEditorArguments>(
  ({ onMount, onChange, style = {}, readOnly = false, throttleTime = 0 }) => {
    const scratchContainerRef = React.useRef<HTMLDivElement | null>(null);
    const editorInstanceRef = React.useRef<ScratchEditorInstance>();
    const workspaceRef = React.useRef<any>();
    const _onChange = React.useMemo(
      () =>
        throttleTime > 0
          ? throttle(
              () => {
                (onChange as ScratchOnChange)?.(
                  editorInstanceRef.current?.getValue() ?? '',
                );
              },
              500,
              { leading: false, trailing: true },
            )
          : (onChange as ScratchOnChange)?.(
              editorInstanceRef.current?.getValue() ?? '',
            ),
      [onChange, editorInstanceRef.current, throttleTime],
    );
    const onChangeFunctionRef = React.useRef(() => _onChange);
    React.useEffect(() => {
      onChangeFunctionRef.current = () => _onChange;
    }, [_onChange]);

    React.useEffect(() => {
      (async () => {
        if (!scratchContainerRef.current) {
          return;
        }
        const workspace = ScratchBlocks.inject(scratchContainerRef.current, {
          zoom: {
            controls: true,
            wheel: true,
            startScale: 0.675,
            maxScale: 4,
            minScale: 0.25,
            scaleSpeed: 1.1,
          },
          grid: {
            spacing: 40,
            length: 2,
            colour: '#666',
          },
          colours: {
            workspace: '#282C34',
            flyout: '#202329',
            toolbox: '#3C404A',
            toolboxText: '#FFFFFF',
            toolboxSelected: '#202329',
            scrollbar: '#797979',
            scrollbarHover: '#797979',
            insertionMarker: '#FFFFFF',
            insertionMarkerOpacity: 0.3,
            fieldShadow: 'rgba(255, 255, 255, 0.3)',
            dragShadowOpacity: 0.6,
            scrollbarOpacity: 0.4,
          },
          comments: true,
          collapse: true,
          sounds: true,
          media: `${OSS_PUBLIC_ASSETS_BASE}/scratch/media/`,
          toolbox,
          readOnly,
        } as any);
        workspaceRef.current = workspace;
        const flyoutWorkspace = (workspace.getFlyout() as any).getWorkspace();
        flyoutWorkspace.registerButtonCallback('MAKE_A_VARIABLE', () =>
          ScratchBlocks.Variables.createVariable(
            workspaceRef.current,
            null,
            '',
          ),
        );
        flyoutWorkspace.registerButtonCallback('MAKE_A_LIST', () =>
          ScratchBlocks.Variables.createVariable(
            workspaceRef.current,
            null,
            'list',
          ),
        );
        flyoutWorkspace.registerButtonCallback('MAKE_A_PROCEDURE', () => {
          ScratchBlocks.Procedures.createProcedureDefCallback_(
            workspaceRef.current,
          );
        });
        editorInstanceRef.current = new ScratchEditorInstance(workspace);
        onMount?.(editorInstanceRef.current);

        // flyoutWorkspace.addChangeListener(console.warn);
        const onChange = () => onChangeFunctionRef.current()?.();
        workspace.addChangeListener(onChange);
      })();
      return () => {
        workspaceRef.current?.dispose?.();
      };
    }, [scratchContainerRef.current]);
    return (
      <div
        style={{ width: '100%', height: '100%', ...style }}
        ref={scratchContainerRef}
      ></div>
    );
  },
);
