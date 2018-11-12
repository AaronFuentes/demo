import React from 'react';
import { lightGrey } from '../styles/colors';
import { Paper } from 'material-ui';
import Footer from './Footer';
import { LoginContext } from '../containers/App';
import Dashboard from './Dashboard';

const MainPage = () => {
    const userContext = React.useContext(LoginContext);

    const width = window.innerWidth < 600? '100%' : '600px';
    navigator.geolocation.getCurrentPosition(location => console.log(location));

    const sendSigned = () => {
        console.log(userContext.credentials);
        const signed = userContext.credentials.sign(JSON.stringify({
            prueba: 'con cosas'
        }));

        console.log(signed);
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: lightGrey,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column'
            }}
        >
            <div style={{width: '90%', marginTop: '8em', marginBottom: '2em'}}>
                <Dashboard />
            </div>
            <Footer />
        </div>
    )
}

export default MainPage;