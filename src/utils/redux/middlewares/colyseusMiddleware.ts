import { Middleware } from 'redux';
import * as Colyseus from 'colyseus.js';

import {
  connectionEstablished,
  startConnecting,
  sendMessage,
  activateStudent,
  inviteStudentToAudioChat,
  kickStudentOffAudioChat,
  askStudentToShareScreen,
  cancelStudentShareScreen,
  disconnect,
  teacherStartShareScreen,
  teacherFinishShareScreen,
  muteStudentAudioChat,
  unmuteStudentAudioChat,
} from '../colyseusClient/slice';
import {
  classroomSlice,
  StudentIdSourceCodePair,
  UserIdUsernamePair,
} from '../classroom/slice';
import { CLASSROOM_WS_BASE } from '@/utils/config';

const colyseusMiddleware: Middleware = store => {
  const client = new Colyseus.Client(CLASSROOM_WS_BASE);
  let room: Colyseus.Room;

  const heartbeatCheck = () => {
    setInterval(() => {
      console.log("heartbeat")
      room.send("heartbeat")
    }, 1000)
  }

  return next => async action => {
    const isConnectionEstablished =
      client && room && store.getState().colyseusClient.isConnected;
    if (startConnecting.match(action)) {
      try {
        room = await client.joinOrCreate('classroom', {
          uid: action.payload.uid,
          username: action.payload.username,
          role: action.payload.role,
        });

        heartbeatCheck()

        store.dispatch(connectionEstablished());

        room.onStateChange((_state: any) => {
          /* */
          // console.log({ _state })
        });

        room.state.studentList.onAdd = (entity: any, _key: any) => {
          store.dispatch(classroomSlice.actions.addToStudentList(entity));
        };

        room.state.studentList.onRemove = (entity: any, _key: any) => {
          store.dispatch(classroomSlice.actions.removeFromStudentList(entity));
        };

        room.state.activeStudentList.onAdd = (entity: any, _key: any) => {
          store.dispatch(classroomSlice.actions.addToActiveStudentList(entity));
        };

        room.state.activeStudentList.onRemove = (entity: any, _key: any) => {
          store.dispatch(
            classroomSlice.actions.removeFromActiveStudentList(entity),
          );
        };

        room.state.studentInAudioChat.onAdd = (entity: any, _key: any) => {
          store.dispatch(
            classroomSlice.actions.addToStudentInAudioChat(entity),
          );
        };

        room.state.studentInAudioChat.onRemove = (entity: any, _key: any) => {
          store.dispatch(
            classroomSlice.actions.removeFromStudentInAudioChat(entity),
          );
        };

        room.state.studentMicrophoneMuteList.onAdd = (
          entity: number,
          _key: number,
        ) => {
          store.dispatch(
            classroomSlice.actions.addToStudentMicrophoneMuteList(entity),
          );
        };

        room.state.studentMicrophoneMuteList.onRemove = (
          entity: number,
          _key: number,
        ) => {
          store.dispatch(
            classroomSlice.actions.removeFromStudentMicrophoneMuteList(entity),
          );
        };

        room.state.studentShareScreen.onAdd = (entity: any, _key: any) => {
          store.dispatch(
            classroomSlice.actions.addToStudentShareScreen(entity),
          );
        };

        room.state.studentShareScreen.onRemove = (entity: any, _key: any) => {
          store.dispatch(
            classroomSlice.actions.removeFromStudentShareScreen(entity),
          );
        };

        room.state.activeStudentSourceCodeMap.onAdd = (
          entity: string,
          key: string,
        ) => {
          store.dispatch(
            classroomSlice.actions.addToStudentSourceCodeMap({
              studentId: Number(key),
              sourceCode: entity,
            } as StudentIdSourceCodePair),
          );
        };

        room.state.activeStudentSourceCodeMap.onChange = (
          entity: string,
          key: string,
        ) => {
          store.dispatch(
            classroomSlice.actions.updateStudentSourceCodeMap({
              studentId: Number(key),
              sourceCode: entity,
            } as StudentIdSourceCodePair),
          );
        };

        room.state.activeStudentSourceCodeMap.onRemove = (
          entity: string,
          key: string,
        ) => {
          store.dispatch(
            classroomSlice.actions.removeFromStudentSourceCodeMap(Number(key)),
          );
        };

        room.state.userIdUsernameMap.onAdd = (entity: string, key: string) => {
          store.dispatch(
            classroomSlice.actions.addToUserIdUsername({
              userId: Number(key),
              username: entity,
            } as UserIdUsernamePair),
          );
        };

        room.state.userIdUsernameMap.onRemove = (
          _entity: string,
          key: string,
        ) => {
          store.dispatch(
            classroomSlice.actions.removeFromUserIdUsernameMap(Number(key)),
          );
        };

        room.state.listen(
          'teacherIsSharingScreen',
          (currentValue: boolean, previousValue: boolean) => {
            store.dispatch(
              classroomSlice.actions.updateTeacherIsSharingScreen(currentValue),
            );
          },
        );

        room.onLeave(async (code: any) => {
          /* */
          console.log("onLeave: ", code)
          try {
            room = await client.reconnect(room.id, room.sessionId)
            console.log("joined successfully", room);
          } catch (e) {
            console.error(e)
          }

        });

        room.onError((code: any) => {
          console.error('onError: ', code);
        });
      } catch (e) {
        console.error(e);
      }
    }

    if (sendMessage.match(action) && isConnectionEstablished) {
      room.send('push source code', action.payload);
    }

    if (activateStudent.match(action) && isConnectionEstablished) {
      room.send('activate student', action.payload);
    }

    if (inviteStudentToAudioChat.match(action) && isConnectionEstablished) {
      room.send('invite student to audio chat', action.payload);
    }

    if (kickStudentOffAudioChat.match(action) && isConnectionEstablished) {
      room.send('kick student off audio chat', action.payload);
    }

    if (muteStudentAudioChat.match(action) && isConnectionEstablished) {
      room.send('mute student audio chat', action.payload);
    }

    if (unmuteStudentAudioChat.match(action) && isConnectionEstablished) {
      room.send('unmute student audio chat', action.payload);
    }

    if (askStudentToShareScreen.match(action) && isConnectionEstablished) {
      room.send('ask student to share screen', action.payload);
    }

    if (cancelStudentShareScreen.match(action) && isConnectionEstablished) {
      room.send('cancel student share screen', action.payload);
    }

    if (disconnect.match(action) && isConnectionEstablished) {
      room.leave();
    }

    if (teacherStartShareScreen.match(action) && isConnectionEstablished) {
      room.send('teacher start share screen', action.payload);
    }

    if (teacherFinishShareScreen.match(action) && isConnectionEstablished) {
      room.send('teacher finish share screen', action.payload);
    }

    next(action);
  };
};

export default colyseusMiddleware;
