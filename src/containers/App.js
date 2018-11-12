import React from 'react';
import '../styles/App.css';
import Header from '../components/Header';
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import MainPage from '../components/MainPage';
import LoginPage from '../components/LoginPage';
import { HEADER_HEIGHT } from '../constants';
import ThemeProvider from '../UI/ThemeProvider';
import TrackingPage from '../components/TrackingPage';
import RegisterPage from '../components/RegisterPage';
import ShippingPage from '../components/ShippingPage';
import DeliveryPage from '../components/DeliveryPage';
export const LoginContext = React.createContext();
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();



class App extends React.Component {

    state = {
        credentials: null
    }

    goToRoot = () => <Redirect to="/" />

    componentDidMount(){
        const creds = localStorage.getItem('creds');
        if(creds){
            const json = JSON.parse(creds);
            const decrypted = accounts.decrypt(json, 'local');
            this.setState({
                credentials: decrypted
            });
        }
    }

    loginUser = creds => {
        this.setState({
            credentials: creds
        });
        localStorage.setItem('creds', JSON.stringify(creds.encrypt('local')));
    }

    logoutUser = () => {
        console.log('logout');
        this.setState({
            credentials: null
        });
        localStorage.removeItem('creds');
    }

    render() {
        return (
            <ThemeProvider>
                <LoginContext.Provider value={{
                    credentials: this.state.credentials,
                    loginUser: this.loginUser,
                    logoutUser: this.logoutUser
                }}>
                    <div className="App">
                        <Header />
                        <div style={{height: `calc(100% - ${HEADER_HEIGHT})`, width: '100%'}}>
                            <BrowserRouter>
                                    {this.state.credentials?
                                        <Switch>
                                            <Route exact path="/" component={MainPage} />
                                            <Route path="/register" component={RegisterPage} />
                                            <Route path="/shipping" component={ShippingPage} />
                                            <Route path="/delivery" component={DeliveryPage} />
                                            <Route path="/tracking" component={TrackingPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    :
                                        <Switch>
                                            <Route exact path="/" component={LoginPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    }
                            </BrowserRouter>
                        </div>
                    </div>
                </LoginContext.Provider>
            </ThemeProvider>
        );
    }
}

export default App;
