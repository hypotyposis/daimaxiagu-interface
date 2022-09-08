import { memo, useMemo } from 'react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Switch, Route, Redirect } from '@modern-js/runtime/router';

import Login from '@/pages/login';
import Level from '@/pages/level';
import Paper from '@/pages/paper';
import Slide from '@/pages/slide';
import Question from '@/pages/question';
import Registry from '@/pages/registry';
import Dashboard from '@/pages/dashboard';
import CocosDebugger from '@/pages/debug';
import Collection from '@/pages/collection';
import ManagementPage from '@/pages/manage';
import AgoraMask from '@/components/AgoraMask';
import VideoSharePage from '@/pages/share/video';
import SubmitHistory from '@/pages/submitHistory';
import StudentManagePage from '@/pages/studentManage';
import JWTVerifier from '@/components/auth/JWTVerifier';
import OJAccountMask from '@/components/views/onlinejudge/OJAccountMask';
import rootStore from '@/utils/redux/store';
import WXRoute from '@/pages/wx/route';

import '@/styles/global.css';

export default memo(() => {
  const theme = useMemo(() => createTheme({ palette: { mode: 'dark' } }), []);
  return (
    <Provider store={rootStore.store}>
      <PersistGate persistor={rootStore.persistor}>
        <AgoraMask />
        <OJAccountMask />
        <JWTVerifier />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            <Route path="/wx/*" component={WXRoute} />
            <Route
              path="/collection/:collectionId/:tocId?"
              component={Collection}
            />
            <Route path="/level/:levelId" component={Level} />
            <Route path="/paper/:paperId" component={Paper} />
            <Route path="/slide/:slideId" component={Slide} />
            <Route path="/question/:questionId?" component={Question} />
            <Route path="/debug/:cocosUri" component={CocosDebugger} />
            <Route
              path="/submit-history/:username?"
              component={SubmitHistory}
            />
            <Route path="/share/levelvideo/:id" component={VideoSharePage} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/manage" component={ManagementPage} />
            <Route exact path="/sm" component={StudentManagePage} />
            <Route exact path="/registry" component={Registry} />
            <Route exact path="/login" component={Login} />
            <Route path="*">
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
});
