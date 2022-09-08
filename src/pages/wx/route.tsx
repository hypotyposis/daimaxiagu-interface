import React from 'react';
import { Switch, Route, Redirect } from '@modern-js/runtime/router';

import ExamGallery from './examGallery';
import Exam from './examGallery/exam';
// eslint-disable-next-line import/no-useless-path-segments
import Index from './index';

export default React.memo(() => {
  const inWX = React.useMemo(
    () => window.__wxjs_environment === 'miniprogram',
    [window],
  );

  if (!inWX) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route exact path="/wx/index" component={Index} />
      <Route exact path="/wx/exams/:type" component={ExamGallery} />
      <Route exact path="/wx/exam-csp/:id" component={Exam} />
      <Route path="*">
        <Redirect to="/wx/index" />
      </Route>
    </Switch>
  );
});
