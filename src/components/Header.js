import React from 'react';
import { HEADER_HEIGHT } from '../constants';
import { darkGrey } from '../styles/colors';
import { LoginContext } from '../containers/App';
import UserMenu from './UserMenu';

const Header = () => {
    const login = React.useContext(LoginContext);

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
            <div style={{width: '40%'}}>

            </div>
            <div style={{
                width: '40%',
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