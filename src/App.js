import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// configs
import bot from "./Config";

// config amplify
import Amplify, {API}  from "aws-amplify";
import awsmobile from './aws-exports';

// include amplify UI components
import { withAuthenticator, ChatBot, AmplifyTheme } from 'aws-amplify-react';

// config amplify
Amplify.configure(awsmobile)
// config bots
const bots = {}
bots[bot.name] = {
  "alias": bot.alias,
  "region": bot.region,
}
      
Amplify.configure({
  Interactions: {
    bots: bots
  }
});

// Imported default theme can be customized by overloading attributes
const myTheme = {
  ...AmplifyTheme,
  sectionHeader: {
    ...AmplifyTheme.sectionHeader,
    backgroundColor: '#ff6600'
  }
};



class App extends Component {
  state = {reservations:[]}
  
  constructor(props){
    super(props)
    this.getReservations()
  }

  getReservations() { 
      let apiName = 'listreservations'
      let path = '/reservations'
      let myInit = { // OPTIONAL
          headers: {} // OPTIONAL
      }
      API.get(apiName, path, myInit).then(response => {
        var reservations = []
        response && response.Items.map(item =>{
          var info = ""
          for (var i in item){
            info = info + i + ":" + item[i].S + "  "
          }
          reservations.push({info: info})
        })
        
        this.setState({reservations: reservations})
      })
      
  }

  handleComplete(err, confirmation) {
    if (err) {
      return;
    }
    
    this.getReservations()

    return 'Trip booked. Thank you! what would you like to do next?';
  }

  render() {
    const { reservations } = this.state
    
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to ChatBot Demo</h1>
        </header>
        {
          reservations && 
          (<div className="reservations">
            {reservations.map(reservation =>
              <li>{reservation.info}</li>
            )}
          </div>)
        }
        <ChatBot
          title="My Bot"
          theme={myTheme}
          botName={bot.name}
          welcomeMessage="Welcome, how can I help you today?"
          onComplete={this.handleComplete.bind(this)}
          clearOnComplete={true}
        />
      </div>
    );
  }
}


// app with amplify auth
export default withAuthenticator(App);