import React from 'react';
import Chip from '@mui/material/Chip';
import VerifiedIcon from '@mui/icons-material/Verified';
import ApiIcon from '@mui/icons-material/Api';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

interface IBadgeProps {
  type:
    | '峡谷新秀'
    | '代码峡谷'
    | '作业打卡'
    | 'C++练习生'
    | 'Python练习生'
    | 'Scratch练习生'
    | string;
}

export const SupportedBadgeType = [
  '峡谷新秀',
  '代码峡谷',
  '作业打卡',
  'C++练习生',
  'Python练习生',
  'Scratch练习生',
];

export default React.memo<IBadgeProps>(({ type = '' }) => {
  switch (type) {
    case '峡谷新秀': {
      return (
        <Chip
          label="峡谷新秀"
          variant="outlined"
          color="warning"
          icon={<VerifiedIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case '代码峡谷': {
      return (
        <Chip
          label="代码峡谷"
          variant="outlined"
          color="info"
          icon={<ApiIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case '作业打卡': {
      return (
        <Chip
          label="作业打卡"
          variant="outlined"
          color="success"
          icon={<AssignmentTurnedInIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case 'C++练习生': {
      return (
        <Chip
          label="C++练习生"
          variant="outlined"
          color="error"
          icon={<SchoolIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case 'Python练习生': {
      return (
        <Chip
          label="Python练习生"
          variant="outlined"
          color="error"
          icon={<SchoolIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case 'Scratch练习生': {
      return (
        <Chip
          label="Scratch练习生"
          variant="outlined"
          color="error"
          icon={<SchoolIcon />}
          sx={{ border: 'none' }}
        />
      );
    }
    case '': {
      return <></>;
    }
    default: {
      return (
        <Chip
          label={type}
          variant="outlined"
          color="primary"
          size="small"
          sx={{ border: 'none' }}
        />
      );
    }
  }
});
