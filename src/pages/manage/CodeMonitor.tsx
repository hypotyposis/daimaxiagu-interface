import React from 'react';
import {
  MixCodeEditorType,
  IMixCodeEditorInstance,
} from '@/components/views/codeeditor/editor.d';
import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const focusedStudent = useSelector(
    state => state.classroom.activeStudentList[0],
  );
  const editorInstanceRef = React.useRef<IMixCodeEditorInstance>();
  const code = useSelector(
    state => state.classroom.studentSourceCodeMap[focusedStudent] ?? {},
  );

  React.useEffect(() => {
    editorInstanceRef.current?.setValue?.(code.code ?? '');
  }, [code, editorInstanceRef.current]);

  return (
    <MixCodeEditor
      editor={MixCodeEditorType.CodeMirrorNext}
      language={code.language ?? 'cpp'}
      onMount={(instance: IMixCodeEditorInstance) => {
        editorInstanceRef.current = instance;
      }}
      readOnly
    />
  );
});
