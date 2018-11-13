import React from 'react';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { withRouter } from 'react-router-dom';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';

const EnterTrackingHashForm = ({ history }) => {

    const [hash, updateHash] = React.useState('');

    const enterCode = hash => {
        history.push(`/tracking/${hash}`);
    }

    const simulateRead = () => {
        enterCode('0x12323123');
    }

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
                    INTRODUCIR HASH
                </h3>
                <BasicButton
                    text="Simular lectura"
                    onClick={simulateRead}
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

export default withRouter(EnterTrackingHashForm);