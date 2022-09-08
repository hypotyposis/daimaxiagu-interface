import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import { useHistory } from '@modern-js/runtime/router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import HelpDialog from '../HelpDialog';
import CollectionTOC from './CollectionTOC';
import {
  SidebarContainer,
  SidebarTopPad,
  SidebarIconButton,
} from './SidebarContainer';

import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const history = useHistory();
  const username = useSelector(state => state.user.username);
  const collectionData = useSelector(state => state.gameLevel.collectionData);
  const [sidebarVisible, setSidebarVisible] = React.useState<boolean>(false);
  const [openHelpDialog, setOpenHelpDialog] = React.useState<boolean>(false);
  React.useEffect(() => {
    let repeat = 10;
    const id = setInterval(() => {
      window.dispatchEvent(new Event('resize'));
      if (repeat-- <= 0) {
        clearInterval(id);
      }
    }, 50);
  }, [sidebarVisible]);

  return (
    <>
      <HelpDialog
        open={openHelpDialog}
        onClose={() => {
          setOpenHelpDialog(false);
        }}
      />
      <SidebarContainer variant="permanent" open={sidebarVisible}>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexWrap: 'nowrap',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '50px',
              flexShrink: 0,
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Tooltip title="返回主页面" placement="right">
                <SidebarIconButton
                  onClick={() => {
                    history.push('/dashboard');
                  }}
                  sx={{
                    padding: '11px 8px 10px 8px',
                  }}
                >
                  <CloseIcon />
                </SidebarIconButton>
              </Tooltip>
              <Tooltip title="关卡目录" placement="right">
                <SidebarIconButton
                  focusRipple
                  onClick={() => {
                    setSidebarVisible(!sidebarVisible);
                  }}
                >
                  <ListAltIcon />
                </SidebarIconButton>
              </Tooltip>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {username ? (
                <Tooltip title={`用户名: ${username}`} placement="right">
                  <Avatar
                    alt="User"
                    sx={{
                      borderRadius: '50% !important',
                      height: '30px',
                      width: '30px',
                      fontSize: '15px',
                      marginBottom: '10px',
                    }}
                  >
                    {username[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
              ) : (
                <Tooltip title="登录" placement="right">
                  <SidebarIconButton
                    onClick={() => {
                      history.push('/login');
                    }}
                  >
                    <AccountCircleIcon />
                  </SidebarIconButton>
                </Tooltip>
              )}
              <Tooltip title="提交记录" placement="right">
                <SidebarIconButton
                  onClick={() => {
                    window.open(`/submit-history/${username}`, '_blank');
                  }}
                >
                  <HistoryIcon />
                </SidebarIconButton>
              </Tooltip>
              <Tooltip title="帮助" placement="right">
                <SidebarIconButton
                  onClick={() => {
                    setOpenHelpDialog(true);
                  }}
                >
                  <HelpIcon />
                </SidebarIconButton>
              </Tooltip>
            </Box>
          </Box>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              overflowY: 'scroll',
              overflowX: 'hidden',
              flexGrow: 1,
            }}
          >
            <SidebarTopPad
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                background: '#121212AA',
                backdropFilter: 'blur(3px)',
              }}
            >
              <h3 style={{ userSelect: 'none' }}>
                {collectionData?.title ?? ''}
              </h3>
            </SidebarTopPad>
            <CollectionTOC />
          </Box>
        </Box>
      </SidebarContainer>
    </>
  );
});
