import React from 'react';
import { HEADER_HEIGHT } from '../constants';
import { darkGrey } from '../styles/colors';
import { MainAppContext } from '../containers/App';
import UserMenu from './UserMenu';
import logo from '../assets/logo.svg';

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
                <img src={logo} style={{height: `2.7em`, width: 'auto'}} alt="demo-logo" />
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