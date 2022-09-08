export const play = (src: string) => {
  const audioDom = document.querySelector<HTMLAudioElement>(
    'audio#daimaxiagu-global-audio',
  );
  if (audioDom === null) {
    return;
  }
  audioDom.pause();
  audioDom.src = src;
  audioDom.play();
};
