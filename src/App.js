import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// config amplify
import Amplify, {Auth}  from "aws-amplify";
import awsmobile from './aws-exports';

// include amplify UI components
import { withAuthenticator } from 'aws-amplify-react';

// config amplify
Amplify.configure(awsmobile)

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}


// app with amplify auth
export default withAuthenticator(App);