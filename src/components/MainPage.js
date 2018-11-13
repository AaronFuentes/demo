import React from 'react';
import { lightGrey } from '../styles/colors';
import Footer from './Footer';
import { MainAppContext } from '../containers/App';
import Dashboard from './Dashboard';

const MainPage = () => {
    const userContext = React.useContext(MainAppContext);
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

/* 
const sendSigned = () => {
    const signed = userContext.credentials.sign(JSON.stringify({
        data: {
            expirationDate: 'DKEDKKEKDKE',
            barcode: '3123567678',
            batch: 'AE23GH',
            euCode: 'EU/1233446/27',
            ingredients: 'Cosas, y más',
            name: 'Queso',
            other: '',
            producer: 'Queseria',
            weight: '400gr'
        },
        type: 'registration'
    }));
    console.log(signed);

} */