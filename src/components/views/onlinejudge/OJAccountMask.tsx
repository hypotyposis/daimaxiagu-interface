import React from 'react';
import { UserRole } from '@/types/auth.d';
import { setOJAccount } from '@/utils/api/oj';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const username = useSelector(state => state.user.username);
  const userRole = useSelector(state => state.user.userRole);
  React.useEffect(() => {
    if (userRole === UserRole.ANONYMOUS) {
      setOJAccount(undefined);
    } else {
      setOJAccount(username);
    }
  }, [username, userRole]);
  return <></>;
});
