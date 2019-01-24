import React from 'react';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { withRouter } from 'react-router-dom';
import { Paper } from 'material-ui';
import { lightGrey, primary } from '../styles/colors';
import { extractHashFromURL } from '../utils/hashUtils';
import bg from '../assets/img/lg-bg.png';

const EnterTrackingHashForm = ({ history }) => {

    const [hash, updateHash] = React.useState('');

    const enterCode = hash => {
        history.push(`/tracking/${extractHashFromURL(hash)}`);
    }

    const setHashToSearch = event => {
        updateHash(extractHashFromURL(event.target.value));
    }

    const goBack = () => {
        history.goBack();
    }

    const search = () => {
        enterCode(hash.trim());
    }

    const handleKeyUp = (event) => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            enterCode(event.target.value);
        }
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                background: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
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
                <TextInput
                    floatingText="Código del producto"
                    id="text-input"
                    value={hash}
                    autoFocus={true}
                    onChange={setHashToSearch}
                    onKeyUp={handleKeyUp}
                />
                <BasicButton
                    text="Volver"
                    type="flat"
                    textStyle={{fontWeight: '700', color: 'black'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={goBack}
                />
                <BasicButton
                    text="Buscar"
                    color={primary}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={search}
                />
            </Paper>
        </div>
    )
}

export default withRouter(EnterTrackingHashForm);