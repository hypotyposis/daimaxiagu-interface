export const isLocalhost = ['localhost', '192.168.3.14'].includes(
  window.location.hostname,
);
export const devMode = window.location.hostname !== 'daimaxiagu.com';

export const transitionStyle = `opacity 400ms ${[
  'box-shadow',
  'border-color',
  'color',
]
  .map(style => `${style} 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms`)
  .join(',')}`;

export const DefaultCode = {
  cpp: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    '',
    'int main(void) {',
    '    ',
    '    return 0;',
    '}',
  ].join('\n'),
  python: '',
  scratch:
    '<xml xmlns="http://www.w3.org/1999/xhtml"><variables></variables><block type="event_whenflagclicked" id="BY|.+LqFW6cJj4JH5n=6" x="129" y="525"></block></xml>',
  go: 'func main() {\n    \n}',
};

export const HOST = isLocalhost
  ? 'dev.daimaxiagu.com'
  : window.location.hostname;
export const COCOS_INDEX: Record<string, string> = {
  MazeRover: `https://${HOST}/cocos/mazerover/index.html`,
  MazeRoverV2: `https://${HOST}/cocos/mazerover/index.html`,
};
export const CODERUNNER_API_BASE = `https://${HOST}/api/code-runner`;
export const CODERUNNER_WS_BASE = `wss://${HOST}/ws/code-runner`;
export const CLASSROOM_WS_BASE = `wss://${HOST}/ws/classroom`;
export const OSS_RESOURCE_BASE = 'https://oss.daimaxiagu.com';
export const OSS_PUBLIC_ASSETS_BASE = 'https://oss.daimaxiagu.com/public';
export const MEDIA_RESOURCE_BASE = 'https://media.daimaxiagu.com';
export const AUTH_API_BASE = `https://${HOST}/api/auth`;
export const AGORA_TOKEN_API_BASE = `https://${HOST}/api/agora-token`;
export const VOD_TOKEN_API_BASE = `https://${HOST}/api/vod`;
export const HIGHLIGHT_API_BASE = `https://${HOST}/api/highlight`;
export const WEIXIN_JSAPI_TICKET_API_BASE = `https://${HOST}/api/wx`;
export const STUDENT_MANAGER_API_BASE = `https://${HOST}/api/student-manager`;
export const IDE_JUDGER_API_BASE = `https://${HOST}/api/ide-judger`;
export const OJ_API_BASE = isLocalhost
  ? `http://${window.location.hostname}/api/oj`
  : `https://${HOST}/api/oj`;

export const AGORA_CONFIG = {
  APP_ID: '4cf3354d9f914579b49d07ac4f5fa1f4',
  CHANNEL_TEST: 'test',
  CHANNEL_STUDENT_HOST: 'student-host',
  CHANNEL_TEACHER_HOST: 'teacher-host',
  CHANNEL_AUDIO: 'audio',
};
export const WEIXIN_APP_ID = 'wx5ae7808267e29706';
