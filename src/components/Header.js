import React from 'react';
import { HEADER_HEIGHT } from '../constants';
import { darkGrey } from '../styles/colors';
import { MainAppContext } from '../containers/App';
import UserMenu from './UserMenu';
import logo from '../assets/logo-white.png';
import { Link } from 'react-router-dom';

const Header = () => {
    const login = React.useContext(MainAppContext);

    return (
        <header
            style={{
                width: '100%',
                height: HEADER_HEIGHT,
                backgroundColor: darkGrey,
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <div style={{width: '20%'}}>

            </div>
            <div style={{width: '60%'}}>
                <Link to="/"><img src={logo} style={{marginTop: '.5em', height: '2em', width: 'auto'}} alt="demo-logo" /></Link>
            </div>
            <div style={{
                width: '20%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '1.5em'
            }}>
                {!!login.credentials &&
                    <UserMenu
                        user={login.credentials}
                     />
                }
            </div>
        </header>
    )
}

export default Header;
