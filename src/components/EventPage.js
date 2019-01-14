import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { Paper } from 'material-ui';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { MainAppContext } from '../containers/App';
import web3 from 'web3';
import { createSalt } from '../utils/hashUtils';
import { API_URL } from '../config';

const initialState = {
    traceId: '',
    eventType: '',
    eventData: ''
}

const EventPage = () => {

    const [formData, setFormData] = React.useState(initialState);
    const mainAppContext = React.useContext(MainAppContext);

    const updateTraceID = event => {
        setFormData({
            ...formData,
            traceId: event.target.value
        });
    }

    const updateEventType = event => {
        setFormData({
            ...formData,
            eventType: event.target.value
        });
    }

    const updateEventData = event => {
        setFormData({
            ...formData,
            eventData: event.target.value
        });
    }

    const sendEvent = async () => {
        const response = await addEventToTrace({
            type: 'ADD_EVENT', //NEW_TRACE
            trace: formData.traceId,
            descriptor: [],
            salt: createSalt(),
            fragments: [JSON.stringify({
                data: {
                    eventType: formData.eventType,
                    eventData: formData.eventData
                }
            })]
        }, mainAppContext.credentials);
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                backgroundColor: lightGrey,
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
                    AÑADIR EVENTO
                </h3>
                <TextInput
                    floatingText="Id de la traza"
                    autoFocus={true}
                    value={formData.traceId}
                    onChange={updateTraceID}
                />
                <TextInput
                    floatingText="Tipo de evento"
                    value={formData.eventType}
                    style={{
                        marginTop: '2em'
                    }}
                    onChange={updateEventType}
                />
                <TextInput
                    floatingText="Contenido"
                    multiline
                    value={formData.eventData}
                    style={{
                        marginTop: '2em'
                    }}
                    onChange={updateEventData}
                />
                <BasicButton
                    text={'Enviar evento'}
                    color={primary}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={sendEvent}
                />
            </Paper>
        </div>
    )
}

const addEventToTrace = async (content, account) => {
    //web3.utils.keccak256

    const dataString = JSON.stringify(content);
    const contentBeforeHash = JSON.stringify({
        type: content.type,
        trace: content.trace,
        fragment_hashes: content.fragments.map(fragment => web3.utils.keccak256(fragment).substring(2)),
        descriptor: content.descriptor,
        salt: content.salt
    });
    console.log(contentBeforeHash);
    const contentHash = web3.utils.keccak256(contentBeforeHash);
    console.log(contentHash);
    const dataToSign = JSON.stringify({
        version: 1,
        nodecode: 1,
        from: [content.trace],
        content_hash: contentHash.substring(2)
    });

    console.log(dataToSign);

    const signedContent = account.sign(dataToSign);

    console.log(signedContent);

    //const hashedMessage = web3.utils.sha3(dataString);
    //const signedHash = account.sign(hashedMessage);


    const response = await fetch(`${API_URL}/api/v1.0/products`, {
        method: 'POST',
        body: JSON.stringify({
            event_tx: signedContent.message,
            content,
            signature: signedContent.signature
        })
    });

    const json = await response.json();
    return json;




    /*const dataString = JSON.stringify({
        type: event.eventType,
        data: event.eventData,
    });
    const hashedMessage = web3.utils.sha3(dataString);
    const signedHash = account.sign(hashedMessage);

    console.log(hashedMessage);
    console.log(signedHash);
    console.log(dataString);

    const response = await fetch(`${API_URL}/api/v1.0/product/${event.traceId}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: dataString,
            signature: signedHash.signature
        })
    }) */

/*     const json = await response.json();
    return json; */
    return '';
}

export default EventPage;