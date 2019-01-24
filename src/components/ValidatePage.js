import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { Link } from 'react-router-dom';
import { MainAppContext } from '../containers/App';
import web3 from 'web3';
import { createSalt } from '../utils/hashUtils';
import { API_URL, EXPLORER_API } from '../config';
import LoadingSection from '../UI/LoadingSection';
import ExplorerLink from './ExplorerLink';
import bg from '../assets/img/lg-bg.png';
import { createEvhash, checkContentHash } from '../utils/hashUtils';
import { Grid } from 'material-ui';


const initialState = {
    content: '',
    txHash: ''
}

const ValidatePage = () => {

    const [formData, setFormData] = React.useState(initialState);
    const [message, setMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [event, setEvent] = React.useState({
        txHash: '',
        evHash: ''
    });
    const mainAppContext = React.useContext(MainAppContext);

    const updateContent = event => {
        setFormData({
            ...formData,
            content: event.target.value
        });
    }

    const updateTxHash = event => {
        setFormData({
            ...formData,
            txHash: event.target.value
        });
    }

    const checkEvidence = async () => {
        if(!checkContentHash(formData.content)){
            setMessage({
                text: 'El contenido no coincide con el firmado',
                status: 'no_match'
            });
            setLoading(false);
            return;
        }
        const evHash = createEvhash(formData.content, mainAppContext.credentials);
        console.log(evHash);
        setLoading(true);

        const response = await fetch(`${EXPLORER_API}transaction?value=${formData.txHash}`);
        if(response.status === 200){
            const json = await response.json();
            const savedEvhash = json.result.cbx_data["0"].evhash
            console.log(savedEvhash);
            if(savedEvhash === evHash){
                setMessage({
                    text: 'Contenido validado',
                    status: 'ok'
                });
            } else {
                setMessage({
                    text: 'El contenido no coincide',
                    status: 'no_match'
                });
            }
        } else {
            setMessage({
                text: 'Transacción no válida',
                status: 'not_found'
            });
        }
        setLoading(false);
    }

    console.log(message);

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
                justifyContent: 'center',
                overflowX: 'hidden'
            }}
        >
            <Paper
                style={{
                    width: '850px',
                    minHeight: '85%',
                    backgroundColor: 'white',
                    padding: '2.2em',
                    paddingTop: '1em',
                }}
            >
                <h3>
                    COMPROBAR EVIDENCIA
                </h3>
                <TextInput
                    floatingText="Contenido a validar"
                    autoFocus={true}
                    multiline
                    value={formData.content}
                    onChange={updateContent}
                />
                <TextInput
                    floatingText="Transacción"
                    autoFocus={true}
                    multiline
                    value={formData.txHash}
                    onChange={updateTxHash}
                />
                <Link to="/">
                    <BasicButton
                        text="Volver"
                        type="flat"
                        textStyle={{fontWeight: '700', color: 'black'}}
                        buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    />
                </Link>

                <BasicButton
                    text={'Comprobar'}
                    color={primary}
                    loading={loading}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={checkEvidence}
                />
                <div style={{marginTop: '10px'}}>
                    {loading &&
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <LoadingSection />
                        </div>
                    }
                    {message && <MessageCard message={message} />}
                </div>
            </Paper>
        </div>
    )
}

const MessageCard = ({ message }) => {
    return (
        <Paper
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1.2em'
            }}
        >
            <div style={{fontSize: '1.2em', fontWeight: '700'}}>
                {message.text}
            </div>
            <div style={{height: '3em'}}>
                <StatusIcon status={message.status} />
            </div>
        </Paper>
    )
}

const StatusIcon = ({ status }) => {

    switch (status) {
        case 'ok':
            return <i className="fas fa-check-double" style={{ fontSize: '3em', color: 'green', animation: 'enterIcon 0.7s'}}></i>
        case 'no_match':
            return <i className="fas fa-not-equal" style={{ fontSize: '3em', color: 'red', animation: 'enterIcon 0.7s'}}></i>
        default:
            return <i className="fas fa-times" style={{ fontSize: '3em', color: 'red', animation: 'enterIcon 0.7s'}}></i>
    }
}


export default ValidatePage;