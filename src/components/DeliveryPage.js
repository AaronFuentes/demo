import React from 'react';
import { lightGrey } from '../styles/colors';
import { Paper } from 'material-ui';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { withRouter } from 'react-router-dom';

/*
Cod. trazabilidad

*/

const DeliveryPage = ({ history }) => {

    const goBack = () => {
        history.goBack();
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                backgroundColor: lightGrey,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper
                style={{
                    width: '850px',
                    height: '85%',
                    backgroundColor: 'white',
                    padding: '2.2em',
                    paddingTop: '1em',
                }}
            >
                <h3>
                    CONFIRMACION DE RECIBO
                </h3>
                <BasicButton
                    text="Simular lectura"
                />

                <TextInput
                    floatingText="Código del producto"
                    id="text-input"
                    autoFocus={true}
                />
                <BasicButton
                    text="Volver"
                    type="flat"
                    textStyle={{fontWeight: '700', color: 'black'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={goBack}
                />
            </Paper>
        </div>
    )
}

export default withRouter(DeliveryPage);