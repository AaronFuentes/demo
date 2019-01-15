import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { Paper } from 'material-ui';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import { Link } from 'react-router-dom';
import { MainAppContext } from '../containers/App';
import web3 from 'web3';
import { createSalt } from '../utils/hashUtils';
import { API_URL } from '../config';
import LoadingSection from '../UI/LoadingSection';
import ExplorerLink from './ExplorerLink';


const initialState = {
    traceId: '',
    eventType: '',
    eventData: ''
}

const EventPage = () => {

    const [formData, setFormData] = React.useState(initialState);
    const [loading, setLoading] = React.useState(false);
    const [event, setEvent] = React.useState({
        txHash: '',
        evHash: ''
    });
    const mainAppContext = React.useContext(MainAppContext);

    const updateTraceID = event => {
        setFormData({
            ...formData,
            traceId: event.target.value.trim()
        });
    }

    const updateEventType = event => {
        setFormData({
            ...formData,
            eventType: event.target.value.trim()
        });
    }

    const updateEventData = event => {
        setFormData({
            ...formData,
            eventData: event.target.value.trim()
        });
    }

    const sendEvent = async () => {
        setLoading(true);
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
        //LINK A LA URL DE LA TRAZA
        //setCode(JSON.stringify(`${CLIENT_URL}/tracking/${response.evhash}`));
        setEvent({
            txHash: `0x${response.evidence.substring(0, 64)}`,
            evHash: response.evhash
        });
        setLoading(false);
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
                    loading={loading}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={sendEvent}
                />
                <div style={{marginTop: '10px'}}>
                    {loading &&
                        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                            <LoadingSection />
                        </div>
                    }
                    {event.txHash &&
                        <>
                            Link al explorador de bloques:<br />
                            <ExplorerLink
                                txHash={event.txHash}
                            />
                            <br/>
                            Link al visualizador de traza: <br/>
                            <Link to={`/tracking/${formData.traceId}`}>{formData.traceId}</Link>
                        </>
                    }
                </div>
            </Paper>
        </div>
    )
}

const addEventToTrace = async (content, account) => {
    const dataString = JSON.stringify(content);
    const contentBeforeHash = JSON.stringify({
        type: content.type,
        trace: content.trace,
        fragment_hashes: content.fragments.map(fragment => web3.utils.keccak256(fragment).substring(2)),
        descriptor: content.descriptor,
        salt: content.salt
    });
    const contentHash = web3.utils.keccak256(contentBeforeHash);
    const dataToSign = JSON.stringify({
        version: 1,
        nodecode: 1,
        from: [content.trace],
        content_hash: contentHash.substring(2)
    });
    const signedContent = account.sign(dataToSign);

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
}

export default EventPage;