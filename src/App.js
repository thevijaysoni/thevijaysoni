import React from 'react';
import { BrowserRouter as Router, Switch, Route, } from 'react-router-dom'
import './css/App.css';
import './css/CustomNavbar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import HomePage from './pages/HomePage'

import CommonNavBar from './common/navbar'

function App() {
  return (
    <div>
      <CommonNavBar />
      <Router>
        <Switch>
          <Route exact path='/' component={HomePage} />
        </Switch>
      </Router>

    </div>

  );
}

export default App;
