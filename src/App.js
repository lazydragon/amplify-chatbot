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

import { Layout, Menu, message, Avatar, List, Drawer, Card } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

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
};



class App extends Component {
  state = {
    reservations:[], 
    visible: false,
    drawer: {}
  }
  
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
          var reservation = {
            id: item.id.S,
            type: item.ReservationType.S,
            location: item.Location && item.Location.S,
            nights: item.Nights && item.Nights.N,
            roomtype: item.RoomType && item.RoomType.S,
            checkin: item.CheckInDate && item.CheckInDate.S,
            cartype: item.CarType && item.CarType.S,
            pickupcity: item.PickUpCity && item.PickUpCity.S,
            pickupdate: item.PickUpDate && item.PickUpDate.S,
            returndate: item.ReturnDate && item.ReturnDate.S,
          }
          reservations.push(reservation)
        })
        
        this.setState({reservations: reservations})
      })
      
  }
  
  showDrawer = (id) => {
      this.setState({
        visible: true,
        drawer: this.state.reservations.filter(item => item.id == id) && this.state.reservations.filter(item => item.id == id)[0]
      });
    };
    
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

  handleComplete(err, confirmation) {
    if (err) {
      message.error("Please don't mess up with me!")
      return;
    }
    
    this.getReservations()
    message.success('Trip successfully booked!')
    return 'Trip booked. Thank you! what would you like to do next?';
  }

  render() {
    const { reservations, drawer } = this.state
    
    return (
      <div className="App">
        <Layout>
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['2']}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">Order Flower</Menu.Item>
              <Menu.Item key="2">Book Trip</Menu.Item>
              <Menu.Item key="3">Free Chat</Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div style={{ margin: '32px 0' }}/>
            <Layout style={{ padding: '24px 0', background: '#fff' }}>
              <Sider width={500} style={{ background: '#fff' }}>
                {
                  reservations && 
                  (<List
                      itemLayout="horizontal"
                      style={{paddingLeft: '130px'}}
                      dataSource={reservations}
                      renderItem={item => (
                        <List.Item onClick={() => this.showDrawer(item.id)}>
                          <List.Item.Meta
                            avatar={item.type == "Hotel" ? 
                                <Avatar size="large" style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>H</Avatar> 
                              : <Avatar size="large" style={{ color: 'rgb(17, 0, 245)', backgroundColor: 'rgb(207, 223, 253)' }}>C</Avatar>}
                            title={<a href="#">{item.type == "Hotel" ? "Hotel Reservation" : "Car reservation"}</a>}
                            description={item.type == "Hotel" ? "Have a good day!" : "The Fast and the Furious..."}
                          />
                        </List.Item>
                      )}
                    />)
                }
                {
                  drawer && 
                  (<Drawer
                          title=""
                          width={720}
                          placement="right"
                          onClose={this.onClose}
                          maskClosable={true}
                          visible={this.state.visible}
                          style={{
                            height: 'calc(100% - 55px)',
                            overflow: 'auto',
                            paddingBottom: 53,
                          }}
                        >
                        { (drawer.type == "Hotel") ?
                          (<Card title="Hotel Reservation">
                            <Card type="inner" title="Location" >
                              {drawer.location}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Checkin Date" >
                              {drawer.checkin}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Nights" >
                              {drawer.nights}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Room Type" >
                              {drawer.roomtype}
                            </Card>
                          </Card>) :
                          (<Card title="Car Reservation">
                            <Card type="inner" title="Pick Up City" >
                              {drawer.pickupcity}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Pick Up Date" >
                              {drawer.pickupdate}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Return Date" >
                              {drawer.returndate}
                            </Card>
                            <Card style={{ marginTop: 16 }} type="inner" title="Car Type" >
                              {drawer.cartype}
                            </Card>
                          </Card>)
                        }
                   </Drawer>)
                }
              </Sider>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                <ChatBot
                  title="My Bot"
                  theme={myTheme}
                  botName={bot.name}
                  welcomeMessage="Welcome, how can I help you today?"
                  onComplete={this.handleComplete.bind(this)}
                  clearOnComplete={true}
                />
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            AWS Demo & Solutions Architect
          </Footer>
        </Layout>
      </div>
    );
  }
}


// app with amplify auth
export default withAuthenticator(App);