import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import {Navigation} from '../navigation';
import {Register} from '../register';
import {LandingPage} from '../landing-page';
import {Login} from '../login';
import {Chat} from '../chat';
import {Chats} from '../chats';
import {Footer} from '../footer';
import {NotFound} from '../not-found';
import styles from './app.module.css';
import {ModalContextProvider} from '../../lib/context/modal';
import {ModalRegistry} from '../modal-registry';
import {ModalsTest} from '../modals-test';
import {Events} from '../events';
import {authService} from '../../lib/services/auth-service';
import {PrivateComponent} from './private-component';
import socketIOClient from 'socket.io-client';

export const App = () => {
  let socket = socketIOClient('http://localhost:8000', {
    transport: ['websocket', 'polling', 'flashsocket'],
  });
  return (
    <ModalContextProvider>
      <Router>
        <ModalRegistry />
        <Navigation />
        <div className={styles.mainContainer}>
          <Switch>
            <Route path="/" exact>
              {authService().isUserLoggedIn() ? (
                <Redirect to="/chats" />
              ) : (
                <LandingPage />
              )}
            </Route>
            <Route path="/register" exact>
              <Register />
            </Route>
            <Route path="/events" exact>
              <PrivateComponent>
                <Events />
              </PrivateComponent>
            </Route>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/modals-test" exact>
              <ModalsTest />
            </Route>
            <Route path="/chat/:chatId" exact>
              <PrivateComponent>
                <Chat socket={socket} />
              </PrivateComponent>
            </Route>
            <Route path="/chats" exact>
              <PrivateComponent>
                <Chats socket={socket} />
              </PrivateComponent>
            </Route>
            <Route path="/404" exact>
              <NotFound />
            </Route>
            <Redirect to="/404" />
          </Switch>
        </div>
        <Footer />
      </Router>
    </ModalContextProvider>
  );
};
