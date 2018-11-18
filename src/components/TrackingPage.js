import React from 'react';
import { Timeline } from 'antd';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';
import { withRouter } from 'react-router-dom';
import EnterTrackingHashForm from './EnterTrackingHashForm';
import LoadingSection from '../UI/LoadingSection';
import BasicButton from '../UI/BasicButton';
import { API_URL } from '../config';
import ReactJson from 'react-json-view'
/*
 Replace the geolocation generation for the data in the transaction
*/

const TrackingPage = ({ match, history }) => {
    const [loading, updateLoading] = React.useState(true);
    const [rawData, updateRawData] = React.useState(false);
    const [data, setData] = React.useState(null);
    React.useEffect(async () => {
        if(match.params.hash){
            const response = await fetch(`${API_URL}/api/v1.0/product/${match.params.hash}`);
            const json = await response.json();
            console.log(json);
            setData(json);
            updateLoading(false);
        }
    }, [match.params.hash]);

    const width = window.innerWidth > 800? '800px' : '100%';
    if(!match.params.hash){
        return (
            <EnterTrackingHashForm />
        )
    }

    const goBack = () => {
        history.goBack();
    }

    const toggleRawData = () => {
        updateRawData(!rawData);
    }

    return (
        <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: lightGrey,
            overflowY: 'auto'
        }}>
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    paddingTop: '1.3em',
                    paddingBottom: '1.3em',
                    justifyContent: 'center',
                }}
            >
                <Paper
                    style={{
                        width: width,
                        padding: '2.3em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        flexDirection: 'column'
                    }}
                >
                    {loading?
                        <div style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            fontSize: '2em',
                            fontWeight: '700'
                        }}>
                            Cargando...
                            <LoadingSection/>
                        </div>
                    :
                        <div style={{maxWidth: '800px', minWidth: '450px'}}>
                            <h3>TRAZA DEL PRODUCTO</h3>
                            <BasicButton
                                text={rawData? 'Ver timeline' : "Ver datos smart contract"}
                                type="flat"
                                textStyle={{fontWeight: '700', color: 'black'}}
                                buttonStyle={{marginRight: '0.3em', marginBottom: '2em'}}
                                onClick={toggleRawData}
                            />
                            {rawData?
                                <div style={{textAlign: 'left !important', display: 'static'}}>
                                    <ReactJson
                                        src={data}
                                        theme="monokai"
                                        collapseStringsAfterLength={width}
                                        enableClipboard={false}
                                        style={{
                                            textAlign: 'left'
                                        }}
                                    />
                                </div>
                            :
                                <Timeline>
                                    {data.trace.map(trace => (
                                        getTraceTimeline(trace)
                                    ))}
                                </Timeline>
                            }
                            <BasicButton
                                text="Volver"
                                type="flat"
                                textStyle={{fontWeight: '700', color: 'black'}}
                                buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                                onClick={goBack}
                            />
                        </div>
                    }

                </Paper>
            </div>
        </div>
    )
}

const TransactionLink = ({ hash, text }) => (
    <a href={`https://alastria-explorer.councilbox.com/transaction/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{marginLeft: '1.2em'}}
    >
        {text}
    </a>
)

const getTraceTimeline = trace => {
    switch(trace.type){
        case 'registration':
            return (
                <Timeline.Item color="green" key={trace.tx_hash}>
                    Alta de producto
                    <TransactionLink
                        hash={trace.tx_hash}
                        text="Ver transacción"
                    />
                </Timeline.Item>
            )
        case 'loadUp':
            return (
                <Timeline.Item dot={<i className="far fa-list-alt"></i>} key={trace.tx_hash}>
                    Carga del producto
                    <TransactionLink
                        hash={trace.tx_hash}
                        text="Ver transacción"
                    />
                </Timeline.Item>
            )
        case 'location':
            return (
                <Timeline.Item dot={<i className="fas fa-truck-moving"></i>} key={trace.tx_hash}>
                    <a href={`https://www.google.com/maps/place/${trace.data.coords.latitude} ${trace.data.coords.longitude}`} target="_blank" rel="noreferrer noopener">
                        En tránsito
                    </a>
                    <TransactionLink
                        hash={trace.tx_hash}
                        text="Ver transacción"
                    />
                </Timeline.Item>
            )

        default:
            return (
                <Timeline.Item dot={<i className="fas fa-check" key={trace.tx_hash}></i>} color="green" key={trace.tx_hash}>
                    Recibido en destino
                    <TransactionLink
                        hash={trace.tx_hash}
                        text="Ver transacción"
                    />
                </Timeline.Item>
            )
    }
}

export default withRouter(TrackingPage);
