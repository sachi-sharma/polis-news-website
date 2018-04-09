import React, { Component } from 'react';
import './../css/App.css';
import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'

const creds = require('./../data/db.json');
const adapter = new LocalStorage('db')
const db = low(adapter)

class App extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: ''
    };
  }

  componentWillMount() {
      db.defaults(creds).write()
      console.log(db.value())
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
 }

  login = (e) => {
    e.preventDefault();
    var isValidCreds = db.get('users')
                         .find({ username: this.state.username , password: this.state.password}).value();
    if(isValidCreds)
        this.props.history.push('/home/'+this.state.username);
    else
        alert("Incorrect username/password");
  }

  render () {
    const { username, password} = this.state;
    return (
      <div className="account_login">
        <div className="account_login_form">
          <h1>Login</h1>
          <input type="text" placeholder="Username" name = "username" value = {username} onChange={this.onChange} required />
          <br/>
          <input type="password" placeholder="Password" name = "password" value = {password} onChange={this.onChange} required />
          <br/>
          <button type="submit" onClick={this.login}> LOGIN </button>
        </div>
      </div>
    );
  }
}

export default App;
