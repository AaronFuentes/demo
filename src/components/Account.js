import React from 'react';
import { MainAppContext } from '../containers/App';
import AlertConfirm from '../UI/AlertConfirm';

const Account = ({ open, requestClose }) => {
    const mainAppContext = React.useContext(MainAppContext);

    return (
        <AlertConfirm
            open={open}
            title="Datos de la cuenta"
            bodyText={
                <>
                    <div style={{color: 'black'}}>
                        <span style={{fontWeight: '700'}}>Dirección: </span>{mainAppContext.credentials.address}
                    </div>
                </>
            }
            cancelAction={requestClose}
            buttonCancel="Cerrar"
        />
    );

}

export default Account;