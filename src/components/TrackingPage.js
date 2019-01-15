import React from 'react';
import { Timeline } from 'antd';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';
import { withRouter } from 'react-router-dom';
import EnterTrackingHashForm from './EnterTrackingHashForm';
import LoadingSection from '../UI/LoadingSection';
import BasicButton from '../UI/BasicButton';
import { API_URL } from '../config';
import ReactJson from 'react-json-view';
import GraphContainer from './GraphContainer';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';

/*
 Replace the geolocation generation for the data in the transaction
*/

const TrackingPage = ({ match, history }) => {
    const [loading, updateLoading] = React.useState(false);
    const [rawData, updateRawData] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [focusedNode, setFocusedNode] = React.useState(null);
    React.useEffect(async () => {
        if(match.params.hash){
            try {
                const response = await fetch(`${API_URL}/api/v1.0/products/${match.params.hash}`);
                const json = await response.json();
                setData(json);
                updateLoading(false);
            } catch (error){
                console.log(error);
            }
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


    const nodeData = focusedNode? JSON.parse(focusedNode.fragments) : {};
    console.log(nodeData);

    return (
        <Grid style={{
            height: '100%',
            width: '100%',
            backgroundColor: lightGrey,
            overflowY: 'auto'
        }}>
            <GridItem lg={3}>

            </GridItem>
            <GridItem lg={6}>
                <Paper
                    style={{
                        width: '100%',
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
                                <>
                                    <GraphContainer
                                        trace={data}
                                        focusedNode={focusedNode}
                                        setFocusedNode={setFocusedNode}
                                    />
                                </>
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
            </GridItem>
            <GridItem lg={3}>
                {focusedNode  &&
                    <Paper style={{width: '100%', border: '1px solid gainsboro'}}>
                        <Grid>{Object.keys(nodeData.data).map(key => (
                            <>
                                <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>{key}</GridItem>
                                <GridItem xs={8} md={8} lg={8}>{nodeData.data[key]}</GridItem>
                            </>
                        ))}</Grid>
                    </Paper>
                }
            </GridItem>
        </Grid>
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
