import React from 'react';
import '../styles/App.css';
import Header from '../components/Header';
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import MainPage from '../components/MainPage';
import LoginPage from '../components/LoginPage';
import { LOCATION_INTERVAL, API_URL } from '../config';
import { HEADER_HEIGHT } from '../constants';
import ThemeProvider from '../UI/ThemeProvider';
import web3 from 'web3';
import TrackingPage from '../components/TrackingPage';
import RegisterPage from '../components/RegisterPage';
import ShippingPage from '../components/ShippingPage';
import DeliveryPage from '../components/DeliveryPage';
import PDFPreviewPage from '../components/PDFPreviewPage';
import ValidatePage from '../components/ValidatePage';
import EventPage from '../components/EventPage';
import "antd/dist/antd.css";
export const MainAppContext = React.createContext();
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();
let location;
navigator.geolocation.getCurrentPosition(result => location = result);

/* const string = '8775816576c7c78a0112a69180adcba77989dd4fb23b3af76e3958f9ed238ed20b5c6d410c9f9707875a6865912184350c12ea1a80dc4f5ae1d7fe162544685d'.substring(0, 64);
console.log(string); */

class App extends React.Component {

    state = {
        credentials: null,
        inTransit: false,
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
        console.log(this.state);
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
                        <BrowserRouter>
                            <>
                                <Header />
                                <div style={{height: `calc(100% - ${HEADER_HEIGHT})`, width: '100%'}}>
                                    {this.state.credentials?
                                        <Switch>
                                            <Route exact path="/" component={MainPage} />
                                            <Route path="/register" component={RegisterPage} />
                                            {/* <Route path="/shipping" component={ShippingPage} /> */}
                                            <Route path="/events" component={EventPage} />
                                            <Route path="/delivery" component={DeliveryPage} />
                                            <Route path="/validate" component={ValidatePage} />
                                            <Route path="/tracking/:hash?" component={TrackingPage} />
                                            <Route path="/document/:hash?" component={PDFPreviewPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    :
                                        <Switch>
                                            <Route exact path="/" component={LoginPage} />
                                            <Route path="/tracking/:hash?" component={TrackingPage} />
                                            <Route path="/document/:hash?" component={PDFPreviewPage} />
                                            <Route path="*" component={this.goToRoot} />
                                        </Switch>
                                    }
                                </div>
                            </>
                        </BrowserRouter>
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
    interval = setInterval(() => {
        const items = getLoadedItems();
        if(items.length === 0){
            return;
        }
        for(let item of items){
            sendProductLocationUpdate(item[0], account, 'location')
        }
    }, LOCATION_INTERVAL);
}

const sendProductLocationUpdate = async (productHash, account, type) => {
    navigator.geolocation.getCurrentPosition(result => location = result);
    const dataString = JSON.stringify({
        type: type,
        data: {
            productId: productHash,
            coords: {
                latitude: location? location.coords.latitude : "41.656265795658165",
                longitude: location? location.coords.longitude : "-4.737810528601315"
            },
        },
    });
    const hashedMessage = web3.utils.sha3(dataString);
    const signedHash = account.sign(hashedMessage);

    const response = await fetch(`${API_URL}/api/v1.0/product/${productHash}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: dataString,
            signature: signedHash.signature
        })
    })

    const json = await response.json();
    return json;
}


const stopTracking = () => {
    clearInterval(interval);
}

export default App;
