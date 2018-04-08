import React from 'react'
import { Switch, Route } from 'react-router-dom'
import LoginPage from './components/LoginPage';
import NewsApp from './components/NewsApp';

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={LoginPage}/>
      <Route path='/home' component={NewsApp}/>
    </Switch>
  </main>
)

export default Main
