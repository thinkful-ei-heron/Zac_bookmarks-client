import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import EditBookmark from './EditBookmark';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <BrowserRouter>
      <Route path={`/1`}>
        <EditBookmark />
      </Route>
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});