import React from 'react';
import { lightGrey } from '../styles/colors';
import Footer from './Footer';
import Dashboard from './Dashboard';
import bg from '../assets/img/lg-bg.png';

const MainPage = () => {
    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: lightGrey,
                background: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
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