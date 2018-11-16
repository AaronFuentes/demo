import React from 'react';
import DropDownMenu from '../UI/DropDownMenu';
import { secondary, primary, lightGrey } from '../styles/colors';
import { Paper, MenuItem } from 'material-ui';
import { MainAppContext } from '../containers/App';
import { withRouter } from 'react-router-dom';
import Account from './Account';


const UserMenu = ({ history }) => {
    const userContext = React.useContext(MainAppContext);
    const [accountModal, setAccountModal] = React.useState(false);

    const toggleAccountModal = () => {
        setAccountModal(!accountModal);
    }

    const callLogout = () => {
        userContext.logoutUser();
        history.push('/')
    }

	return (
        <React.Fragment>
            <Account
                open={accountModal}
                requestClose={toggleAccountModal}
            />
            <DropDownMenu
                color="transparent"
                id={'user-menu-trigger'}
                text={
                    <Paper
                        style={{
                            height: '2em',
                            borderRadius: '10px',
                            padding: '0.2em 1em',
                            backgroundColor: lightGrey,
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <i className="fas fa-shipping-fast" style={{color: secondary, fontSize: '1.8em'}}></i>
                        <div
                            style={{
                                width: '2.2em',
                                height: '2.2em',
                                marginLeft: '1.6em',
                                fontSize: '12px',
                                color: 'white',
                                borderRadius: '1.1em',
                                backgroundColor: primary,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            BM
                        </div>
                    </Paper>
                }
                textStyle={{ color: secondary }}
                type="flat"
                items={
                    <React.Fragment>
                        <MenuItem
                            onClick={toggleAccountModal}
                        >
                            <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                    id={'user-menu-logout'}
                                >
                                    <i className="fas fa-user-circle" style={{fontSize: '1.2em'}}></i>
                                    <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                        Cuenta
                                    </span>
                                </div>
                        </MenuItem>
                        <MenuItem
                            onClick={callLogout}
                        >
                            <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}
                                    id={'user-menu-logout'}
                                >
                                    <i className="fas fa-external-link-alt"></i>
                                    <span style={{marginLeft: '2.5em', marginRight: '0.8em'}}>
                                        Cerrar sesión
                                    </span>
                                </div>
                        </MenuItem>
                    </React.Fragment>
                }
            />
        </React.Fragment>
	);
}

export default withRouter(UserMenu);