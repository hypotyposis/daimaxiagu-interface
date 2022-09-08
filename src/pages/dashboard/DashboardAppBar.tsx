import React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useHistory } from '@modern-js/runtime/router';

import Logo from './Logo';
import UserCard from './UserCard';

import { UserRole } from '@/types/auth.d';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { setJWT } from '@/utils/redux/user/slice';

const pages = ['首页', 'IDE', 'OJ', '提交记录', '线上课'];
const settings = ['账号信息', '偏好设置'];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IDashboardAppBarArguments {}

const DashboardAppBar = React.memo<IDashboardAppBarArguments>(() => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const userId = useSelector(state => state.user.userId);
  const username = useSelector(state => state.user.username);
  const userRole = useSelector(state => state.user.userRole);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const _pages = React.useMemo(() => {
    const _pages = [];
    const len = pages.length;
    for (let i = 0; i < len; i++) {
      const page = pages[i];
      if (page === '线上课' && userRole !== UserRole.ADMIN) {
        continue;
      }
      if (
        page === '提交记录' &&
        userRole !== UserRole.ADMIN &&
        userRole !== UserRole.STUDENT
      ) {
        continue;
      }
      _pages.push(page);
    }
    return _pages;
  }, [userRole]);

  const handleOpenNavMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElNav(event.currentTarget);
    },
    [],
  );
  const handleOpenUserMenu = React.useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorElUser(event.currentTarget);
    },
    [],
  );

  const handleBarButtonClick = React.useCallback((name: string) => {
    switch (name) {
      case 'OJ': {
        window.open('http://oj.daimaxiagu.com/', '_blank');
        break;
      }
      case 'IDE': {
        window.open('http://ide.daimaxiagu.com/', '_blank');
        break;
      }
      case '线上课': {
        history.push('manage');
        break;
      }
      case '提交记录': {
        history.push('submit-history');
        break;
      }
      default: {
        break;
      }
    }
  }, []);

  const handleCloseNavMenu = React.useCallback(() => {
    setAnchorElNav(null);
  }, []);

  const handleCloseUserMenu = React.useCallback(() => {
    setAnchorElUser(null);
  }, []);

  const userLogout = React.useCallback(() => {
    dispatch(setJWT(undefined));
  }, []);

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {_pages.map(page => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleBarButtonClick(page);
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Logo />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {_pages.map(page => (
              <Button
                key={page}
                onClick={() => {
                  handleBarButtonClick(page);
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box>
            <Tooltip title="打开设置">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {username ? (
                  <Avatar alt="User">{username[0].toUpperCase()}</Avatar>
                ) : (
                  <Avatar alt="User" />
                )}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <UserCard />
              {settings.map(setting => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              {userId ? (
                <MenuItem onClick={userLogout}>
                  <Typography textAlign="center">登出</Typography>
                </MenuItem>
              ) : (
                <MenuItem
                  onClick={() => {
                    history.push('/login');
                  }}
                >
                  <Typography textAlign="center">登录/注册</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
});

export default DashboardAppBar;
