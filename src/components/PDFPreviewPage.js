import React from 'react';
import { Card, Divider } from 'material-ui';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import ExplorerLink from './ExplorerLink';
import LoadingSection from '../UI/LoadingSection';
import { API_URL } from '../config';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { format } from 'date-fns';

const PDFPreviewPage = ({ match }) => {
    const [data, setData] = React.useState(null);
    const [loading, updateLoading] = React.useState(true);

    React.useEffect(async () => {
        if(match.params.hash){
            try {
                updateLoading(true);
                const response = await fetch(`${API_URL}/api/v1.0/products/${match.params.hash}`);
                const json = await response.json();
                setData(json);
                updateLoading(false);
            } catch (error){
                console.log(error);
            }
        }
    }, [match.params.hash]);

    let content;

    if(!loading){
        content = JSON.parse(data.content.fragments[0]);
    }

    console.log(data);

    return (
        <div style={{width: '100%', backgroundColor: 'lightgrey', minHeight: '100vh', overflow: 'auto'}}>
            <Card style={{width: '20cm', minHeight: '90vh', padding: '1em', margin: 'auto', marginTop: '2em'}}>
                {loading?
                    <div style={{width: '100%', height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <LoadingSection />
                    </div>
                :
                    <>
                        <img src={logo} style={{height: '2.6em', width: 'auto', selfAlign: 'left', marginBottom: '0.6em'}} />
                        <Card style={{padding: '0.6em'}}>
                            <h3>Datos del producto</h3>
                            {Object.keys(content.data).map(key => (
                                key === 'expirationDate'?
                                    <Grid key={`content_${key}`}>
                                        <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>{fieldsTranslations[key] || key}</GridItem>
                                        <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}}>{format(content.data[key], 'DD/MM/YYYY')}</GridItem><br/>
                                    </Grid>
                                :
                                    <Grid key={`content_${key}`}>
                                        <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>{fieldsTranslations[key] || key}</GridItem>
                                        <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}}>{content.data[key]}</GridItem><br/>
                                    </Grid>
                            ))}
                        </Card>
                        <Card style={{padding: '0.6em', marginTop: '0.8em'}}>
                            <h3>Datos de la evidencia</h3>
                            <Grid>
                                <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Evidencia</GridItem>
                                <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                    {`${data.tx_hash}${data.evhash}`}
                                </GridItem><br/>
                                <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>TX. Hash</GridItem>
                                <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                    <ExplorerLink
                                        txHash={data.tx_hash}
                                    />
                                </GridItem><br/>
                                <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Event Hash</GridItem>
                                <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                    <a href={`${window.location.origin}/tracking/${data.evhash}`}>{data.evhash}</a>
                                </GridItem><br/>
                            </Grid>
                        </Card>
                        {data.event_tx.from.length > 0 &&
                            <Card style={{padding: '0.6em', marginTop: '0.8em'}}>
                            <h3>Datos de origen</h3>
                            <Grid>
                                {data.event_tx.from.map((origin, index) => (
                                    <>
                                        {index > 0 &&
                                                <GridItem xs={12} md={12} lg={12}><Divider /></GridItem>
                                            }
                                        {Object.keys(JSON.parse(origin.content.fragments[0]).data).map(key => (
                                            key === 'expirationDate'?
                                                <Grid key={`content_${key}`}>
                                                    <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>{fieldsTranslations[key] || key}</GridItem>
                                                    <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}}>{format(content.data[key], 'DD/MM/YYYY')}</GridItem><br/>
                                                </Grid>
                                            :
                                                <Grid key={`content_${key}`}>
                                                    <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>{fieldsTranslations[key] || key}</GridItem>
                                                    <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}}>{content.data[key]}</GridItem><br/>
                                                </Grid>
                                        ))}
                                        <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Evidencia</GridItem>
                                        <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                            {`${origin.tx_hash}${origin.evhash}`}
                                        </GridItem><br/>
                                        <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>TX. Hash</GridItem>
                                        <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                            <ExplorerLink
                                                txHash={origin.tx_hash}
                                            />
                                        </GridItem><br/>
                                        <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Event Hash</GridItem>
                                        <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                            <a href={`${window.location.origin}/tracking/${origin.evhash}`}>{origin.evhash}</a>
                                        </GridItem><br/>
                                    </>
                                ))}
                            </Grid>
                        </Card>
                        }
                        {data.events &&
                            <Card style={{padding: '0.6em', marginTop: '0.8em'}}>
                                <h3>Eventos registrados</h3>
                                <Grid>
                                    {data.events.map((event, index) => (
                                        <React.Fragment key={`event_${event.evhash}`}>
                                            {index > 0 &&
                                                <GridItem xs={12} md={12} lg={12}><Divider /></GridItem>
                                            }
                                            <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Tipo de evento</GridItem>
                                            <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                                {`${JSON.parse(event.content.fragments[0]).data.eventType}`}
                                            </GridItem><br/>
                                            <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Contenido del evento</GridItem>
                                            <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                                {`${JSON.parse(event.content.fragments[0]).data.eventData}`}
                                            </GridItem><br/>
                                            <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Evidencia</GridItem>
                                            <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                                {`${event.tx_hash}${event.evhash}`}
                                            </GridItem><br/>
                                            <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>TX. Hash</GridItem>
                                            <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                                <ExplorerLink
                                                    txHash={event.tx_hash}
                                                />
                                            </GridItem><br/>
                                            <GridItem xs={6} md={3} lg={3} style={{fontWeight: '700'}}>Event Hash</GridItem>
                                            <GridItem xs={6} md={9} lg={9} style={{whiteSpace: 'pre-wrap'}} className="overflowText">
                                                <a href={`${window.location.origin}/tracking/${event.evhash}`}>{event.evhash}</a>
                                            </GridItem><br/>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </Card>
                        }
                    </>
                }
            </Card>
        </div>
    )
}

const fieldsTranslations = {
    ingredients: 'Ingredientes',
    batch: 'Lote',
    name: 'Nombre',
    barcode: 'Código',
    other: 'Otros',
    weight: 'Peso',
    expirationDate: 'Fecha de caducidad'
}

export default PDFPreviewPage;