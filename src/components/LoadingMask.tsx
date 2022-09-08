import React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface ILoadingMaskArguments {
  show?: boolean;
  loadingIcon?: React.ReactNode;
  content?: React.ReactNode;
  managerRef?: React.MutableRefObject<ILoadingMask | undefined>;
  style?: React.CSSProperties;
  children?: any;
}

interface ILoadingMask {
  show: boolean;
  loadingIcon: React.ReactNode;
  content: React.ReactNode;
}

const LoadingMaskContext = React.createContext<ILoadingMask>({
  show: false,
  loadingIcon: true,
  content: undefined,
});

const LoadingMask: React.FC<ILoadingMaskArguments> = ({
  children,
  loadingIcon = true,
  show = true,
  content = undefined,
  managerRef,
  style = {},
}) => {
  const [_show, setShow] = React.useState(false);
  const [_content, setContent] = React.useState<React.ReactNode>();
  const [_loadingIcon, setLoadingIcon] =
    React.useState<React.ReactNode>(loadingIcon);
  const LoadingMaskRef = React.useRef<ILoadingMask>({
    get show() {
      return _show;
    },
    set show(value: boolean) {
      setShow(value);
    },
    get content() {
      return _content;
    },
    set content(value: React.ReactNode) {
      setContent(value);
    },
    get loadingIcon(): React.ReactNode {
      return _loadingIcon;
    },
    set loadingIcon(value: React.ReactNode) {
      setLoadingIcon(value);
    },
  });
  React.useEffect(() => {
    setShow(show);
  }, [show]);
  React.useEffect(() => {
    setContent(content);
  }, [content]);
  React.useEffect(() => {
    if (managerRef) {
      managerRef.current = LoadingMaskRef.current;
    }
  }, [managerRef]);
  const __loadingIcon = React.useMemo<React.ReactNode>(() => {
    if (_loadingIcon === true) {
      return <CircularProgress color="inherit" sx={{ marginBottom: '10px' }} />;
    } else if (_loadingIcon === false) {
      return <></>;
    } else {
      return _loadingIcon;
    }
  }, [_loadingIcon]);
  const __content = React.useMemo<React.ReactNode>(() => {
    return typeof _content === 'string' ? <Box>{_content}</Box> : _content;
  }, [_content]);
  return (
    <LoadingMaskContext.Provider value={LoadingMaskRef.current}>
      <Backdrop
        sx={{
          zIndex: 1000,
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0',
          bottom: '0',
          left: '0',
          right: '0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
          overflow: 'hidden',
          ...style,
        }}
        open={_show}
      >
        {__loadingIcon}
        {__content}
      </Backdrop>
      {children}
    </LoadingMaskContext.Provider>
  );
};

export default LoadingMask;
