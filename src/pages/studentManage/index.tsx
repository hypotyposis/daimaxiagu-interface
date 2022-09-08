import React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button, CardContent, Typography } from '@mui/material';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import {
  fetchClasses,
  addClass,
  modifyClass,
  fetchStudentRealname,
  setStudentRealname,
} from '@/utils/redux/studentManage/slice';
import './style.css';

interface Class {
  id: number;
  name: string;
  students: Array<number>;
}

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const classList = useSelector(state => state.studentManage.classList);
  const [studentId, setStudentId] = React.useState<number>();
  const [studentRealname, updateStudentRealname] = React.useState<string>();
  const [className, setClassName] = React.useState<string>();
  const [studentListString, setStudentListString] = React.useState<string>();
  const [studentListToSetString, setStudentListToSetString] =
    React.useState<string>();
  const [studentListToDeleteString, setStudentListToDeleteString] =
    React.useState<string>();
  const [studentListToAddString, setStudentListToAddString] =
    React.useState<string>();
  const [idOfClassToModify, setIdOfClassToModify] = React.useState<string>();
  const studentRealnameMap = useSelector(
    state => state.studentManage.StudentRealnameMap,
  );
  React.useEffect(() => {
    dispatch(fetchClasses({ students: 1 }));
    dispatch(fetchStudentRealname());
  }, []);

  return (
    <div className="main">
      <h1>student manage</h1>
      <div className="card-container">
        {classList.map((value, index) => (
          <Card key={index} sx={{ minWidth: 200, maxWidth: 375 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {value.id}
                {bull}
                {value.name}
              </Typography>
              {value.students.map((value, index) => (
                <div
                  key={index}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Typography>{value.id}</Typography>
                  <Typography>{value.realname}</Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <TextField
          id="outlined-error"
          label="班级名称"
          defaultValue=""
          onChange={event => {
            setClassName(event.target.value);
          }}
        />
        <TextField
          id="outlined-error-helper-text"
          label="学生ID 空格隔开"
          defaultValue=""
          onChange={event => {
            setStudentListString(event.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (studentListString?.length === 0) {
              dispatch(
                addClass({
                  name: className!,
                }),
              );
            } else {
              const studentList = studentListString?.split(' ');
              dispatch(
                addClass({
                  name: className!,
                  students: studentList?.map((v, k) => {
                    return Number(v);
                  }),
                }),
              );
            }
            setTimeout(() => {
              dispatch(fetchClasses({ students: 1 }));
            }, 1000);
          }}
        >
          新建班级
        </Button>
      </div>
      <div>
        <TextField
          id="outlined-error"
          label="班级ID"
          defaultValue=""
          onChange={event => {
            setIdOfClassToModify(event.target.value);
          }}
        />
        <TextField
          id="outlined-error-helper-text"
          label="覆盖学生ID列表 空格隔开"
          defaultValue=""
          onChange={event => {
            setStudentListToSetString(event.target.value);
          }}
        />
        <TextField
          id="outlined-error-helper-text"
          label="添加学生ID列表 空格隔开"
          defaultValue=""
          onChange={event => {
            setStudentListToAddString(event.target.value);
          }}
        />
        <TextField
          id="outlined-error-helper-text"
          label="删除学生ID列表 空格隔开"
          defaultValue=""
          onChange={event => {
            setStudentListToDeleteString(event.target.value);
          }}
        />
        <Button
          variant="contained"
          onClick={() => {
            dispatch(
              modifyClass({
                id: Number(idOfClassToModify),
                set_students:
                  studentListToSetString?.length === 0
                    ? undefined
                    : studentListToSetString?.split(' ').map((v, k) => {
                        return Number(v);
                      }),
                add_students:
                  studentListToAddString?.length === 0
                    ? undefined
                    : studentListToAddString?.split(' ').map((v, k) => {
                        return Number(v);
                      }),
                remove_students:
                  studentListToDeleteString?.length === 0
                    ? undefined
                    : studentListToDeleteString?.split(' ').map((v, k) => {
                        return Number(v);
                      }),
              }),
            );
            setTimeout(() => {
              dispatch(fetchClasses({ students: 1 }));
            }, 1000);
          }}
        >
          更新班级信息
        </Button>
      </div>
      <div>
        {Object.keys(studentRealnameMap).map((v, k) => {
          return (
            <div key={k}>
              <span>{v}</span>
              <span>{studentRealnameMap[Number(v)]}</span>
            </div>
          );
        })}
      </div>
      <Box
        component="form"
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined-error"
            label="Student ID"
            defaultValue=""
            onChange={event => {
              setStudentId(Number(event.target.value));
            }}
          />
          <TextField
            id="outlined-error-helper-text"
            label="Student Realname"
            defaultValue=""
            onChange={event => {
              updateStudentRealname(event.target.value);
            }}
          />
          <Button
            variant="contained"
            // disabled={(studentId && studentRealname )? false : true}
            onClick={() => {
              dispatch(
                setStudentRealname({
                  id: studentId!,
                  realname: studentRealname!,
                }),
              );
              setTimeout(() => {
                dispatch(fetchStudentRealname());
              }, 1000);
            }}
          >
            添加学生真名
          </Button>
        </div>
      </Box>
    </div>
  );
});
