import React from 'react';
import Box from '@mui/material/Box';
import SignalCellularOffIcon from '@mui/icons-material/SignalCellularOff';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';
import { AgoraSliceActions } from '@/utils/redux/agora/slice';

interface ITeacherRTCControllerProps {
  audioChannel?: string;
  studentScreenChannel?: string;
  teacherScreenChannel?: string;
}

export default React.memo<ITeacherRTCControllerProps>(
  ({
    audioChannel = 'audio',
    studentScreenChannel = 'student-host',
    teacherScreenChannel = 'teacher-host',
  }) => {
    const dispatch = useAppDispatch();
    const audioChannelId = useSelector(state => state.agora.audioChannelId);
    const studentScreenChannelId = useSelector(
      state => state.agora.studentScreenChannelId,
    );
    const teacherScreenChannelId = useSelector(
      state => state.agora.teacherScreenChannelId,
    );
    const teacherIsSharingScreen = useSelector(
      state => state.classroom.teacherIsSharingScreen,
    );
    const microphoneMute = useSelector(state => state.agora.microphoneMute);

    return (
      <Box
        sx={{
          width: '100%',
          height: '120px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff1',
          justifyContent: 'space-between',
          boxShadow: '#0006 0 -1px 10px',
          padding: '8px 5px',
        }}
      >
        <Box
          sx={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            overflow: 'hidden',
            fontSize: '13px',
          }}
        >
          {audioChannelId ? (
            <SignalCellularAltIcon
              color="success"
              sx={{ marginRight: '5px' }}
            />
          ) : (
            <SignalCellularOffIcon
              color="warning"
              sx={{ marginRight: '5px' }}
            />
          )}
          <Box sx={{ flexGrow: 1 }}>
            {audioChannelId ? '语音已连接;' : '语音未连接;'}
            {studentScreenChannelId ? '监控已连接;' : '监控未连接;'}
            {teacherScreenChannelId ? '可以进行投屏;' : '无法进行投屏;'}
          </Box>
          <IconButton sx={{ marginLeft: '5px' }} color="primary">
            <DisplaySettingsIcon />
          </IconButton>
          <IconButton sx={{ marginLeft: '5px' }} color="primary">
            <VolumeUpIcon />
          </IconButton>
        </Box>
        <Box sx={{ fontSize: '14px', paddingLeft: '5px' }}>全局课堂</Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <Button
            startIcon={
              teacherIsSharingScreen ? (
                <StopScreenShareIcon />
              ) : (
                <ScreenShareIcon />
              )
            }
            color={(teacherIsSharingScreen ? 'info' : 'grey') as any}
            variant="contained"
            size="small"
            sx={{
              fontSize: '6px',
              overflow: 'hidden',
              maxHeight: '29px',
              whiteSpace: 'nowrap',
              width: '100%',
              margin: '0 5px',
            }}
            onClick={() => {
              dispatch(
                teacherIsSharingScreen
                  ? AgoraSliceActions.stopSharingScreen(undefined)
                  : AgoraSliceActions.startSharingScreen(undefined),
              );
            }}
          >
            {teacherIsSharingScreen ? '取消共享' : '共享屏幕'}
          </Button>
          <Button
            startIcon={microphoneMute ? <MicOffIcon /> : <MicIcon />}
            color={(microphoneMute ? 'grey' : 'info') as any}
            variant="contained"
            size="small"
            sx={{
              fontSize: '6px',
              overflow: 'hidden',
              maxHeight: '29px',
              whiteSpace: 'nowrap',
              width: '100%',
              margin: '0 5px',
            }}
            onClick={() => {
              dispatch(
                microphoneMute
                  ? AgoraSliceActions.unmuteMicrophone(undefined)
                  : AgoraSliceActions.muteMicrophone(undefined),
              );
            }}
          >
            麦克风
          </Button>
          <Button
            startIcon={audioChannelId ? <CallIcon /> : <CallEndIcon />}
            color={audioChannelId ? 'error' : 'success'}
            variant="contained"
            size="small"
            sx={{
              fontSize: '6px',
              overflow: 'hidden',
              maxHeight: '29px',
              whiteSpace: 'nowrap',
              width: '100%',
              margin: '0 5px',
            }}
            onClick={() => {
              dispatch(
                AgoraSliceActions.setAudioChannelId(
                  audioChannelId && studentScreenChannelId ? '' : audioChannel,
                ),
              );
              dispatch(
                AgoraSliceActions.setStudentScreenChannelId(
                  audioChannelId && studentScreenChannelId
                    ? ''
                    : studentScreenChannel,
                ),
              );
              dispatch(
                AgoraSliceActions.setTeacherScreenChannelId(
                  teacherScreenChannelId ? '' : teacherScreenChannel,
                ),
              );
            }}
          >
            {audioChannelId ? '退出课堂' : '进入课堂'}
          </Button>
        </Box>
      </Box>
    );
  },
);
