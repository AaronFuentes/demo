import React from 'react';
import '../styles/App.css';
import Header from '../components/Header';
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import MainPage from '../components/MainPage';
import LoginPage from '../components/LoginPage';
import { LOCATION_INTERVAL, API_URL } from '../config';
import { HEADER_HEIGHT } from '../constants';
import ThemeProvider from '../UI/ThemeProvider';
import TrackingPage from '../components/TrackingPage';
import RegisterPage from '../components/RegisterPage';
import ShippingPage from '../components/ShippingPage';
import DeliveryPage from '../components/DeliveryPage';
import "antd/dist/antd.css";
export const MainAppContext = React.createContext();
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();



class App extends React.Component {

    state = {
        credentials: null,
        inTransit: false
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

    startInTransit = () => {
        startTracking(this.state.credentials);
        this.setState({
            inTransit: true
        });
    }

    stopInTransit = () => {
        stopTracking();
        this.setState({
            inTransit: false
        });
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
                <MainAppContext.Provider value={{
                    credentials: this.state.credentials,
                    inTransit: this.state.inTransit,
                    loginUser: this.loginUser,
                    logoutUser: this.logoutUser,
                    startInTransit: this.startInTransit,
                    stopInTransit: this.stopInTransit
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
                                            <Route path="/tracking/:hash?" component={TrackingPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    :
                                        <Switch>
                                            <Route exact path="/" component={LoginPage} />
                                            <Route path="/tracking/:hash?" component={TrackingPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    }
                            </BrowserRouter>
                        </div>
                    </div>
                </MainAppContext.Provider>
            </ThemeProvider>
        );
    }
}

export const getLoadedItems = () => {
    const stored = localStorage.getItem('loadedItems');
    if(!stored){
        return new Map();
    }else{
        return new Map(JSON.parse(stored));
    }
}

let interval = null;
const startTracking = account => {
    const items = getLoadedItems();
    interval = setInterval(() => {
        for(let item of items){
            sendProductLocationUpdate(item.product_hash, account, 'location')
        }
        navigator.geolocation.getCurrentPosition(location => console.log(location))
    }, LOCATION_INTERVAL);

}

let location = navigator.geolocation.getCurrentPosition(result => location = result);
const sendProductLocationUpdate = async (data, account, type) => {
    console.log(data, account, type);

    location = navigator.geolocation.getCurrentPosition(result => location = result);

    const signedMessage = account.sign(JSON.stringify({
        data: {
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
        },
        type: type
    }));

    console.log(signedMessage.message);
    console.log(signedMessage.signature);

    const response = await fetch(`${API_URL}/api/v1.0/product/${data}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: signedMessage.message,
            signature: signedMessage.signature
        })
    })

    const json = await response.json();
    console.log(json);
    return json;
}


const stopTracking = () => {
    clearInterval(interval);
}

export default App;
