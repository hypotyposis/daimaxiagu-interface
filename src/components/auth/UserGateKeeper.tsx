import React from 'react';
import { useHistory } from '@modern-js/runtime/router';
import { UserRole } from '@/types/auth.d';
import { useSelector } from '@/utils/redux/hooks';

interface IUserGateKeeperProps {
  admin?: boolean;
  student?: boolean;
  anonymous?: boolean;
  bot?: boolean;
  redirectTo?: string;
  goBack?: boolean;
  children?: any;
  emptyContent?: any;
}

const UserGateKeeper: React.FC<IUserGateKeeperProps> = ({
  admin = false,
  student = false,
  anonymous = false,
  bot = false,
  goBack = false,
  children,
  redirectTo,
  emptyContent,
}) => {
  const history = useHistory();
  const userRole = useSelector(state => state.user.userRole);
  const pass = React.useMemo<boolean>(() => {
    switch (userRole) {
      case UserRole.ADMIN: {
        return admin;
      }
      case UserRole.STUDENT: {
        return student;
      }
      case UserRole.ANONYMOUS: {
        return anonymous;
      }
      case UserRole.BOT: {
        return bot;
      }
      default: {
        return false;
      }
    }
  }, [admin, student, anonymous, bot, userRole]);

  if (pass) {
    return <>{children}</>;
  } else {
    if (goBack) {
      history.goBack();
    } else if (redirectTo) {
      if (history.location.pathname !== redirectTo) {
        history.push(redirectTo);
      }
    }
    return <>{emptyContent}</>;
  }
};

export default UserGateKeeper;
