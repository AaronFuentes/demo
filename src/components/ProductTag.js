import React from 'react';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { Card } from 'material-ui';
import html2canvas from 'html2canvas';
import ReactToPrint from "react-to-print";
import Barcode from 'react-barcode';
import { secondary } from '../styles/colors';
import { extractHashFromURL } from '../utils/hashUtils';
import ExplorerLink from './ExplorerLink';

const setCanvasToPrint = () => {
    html2canvas(document.querySelector("#divcontents")).then(canvas => {
        const dataUrl = canvas.toDataURL();
        const img = document.getElementById('canvas');
        img.src = dataUrl;
    });
}


class ProductTag extends React.Component {

    componentDidMount() {
        setCanvasToPrint();
    }


    render() {
        const { product, qr } = this.props;
        return (
            <div style={{width: '100%', overflow: 'hidden',}}>
                <Grid style={{textAlign: 'left', marginBottom: '1em'}}>
                    <GridItem xs={12} md={4} lg={3} stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        <span style={{fontWeight: '700'}}>DOCUMENTO:</span>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={9} stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        <a href={`${window.location.origin}/document/${extractHashFromURL(qr).slice(0, extractHashFromURL(qr).length - 1)}`}>Ver documento de trazabilidad</a>
                    </GridItem>
                    <GridItem xs={12} md={4} lg={3} stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        <span style={{fontWeight: '700'}}>EV. HASH:</span>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={9} stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        {extractHashFromURL(qr).slice(0, extractHashFromURL(qr).length - 1)}<br />
                    </GridItem>
                    <GridItem xs={12} md={4} lg={3} stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        <span style={{fontWeight: '700'}}>TX. HASH: </span>
                    </GridItem>
                    <GridItem xs={12} md={8} lg={9} className="truncate" stlye={{display: 'flex', justifyContent: 'flex-start'}}>
                        <ExplorerLink
                            txHash={this.props.txHash}
                        />
                    </GridItem>
                </Grid>
                <ReactToPrint
                    trigger={() => <span onClick={this.print} style={{color: secondary, cursor: 'pointer'}}>Imprimir etiqueta</span>}
                    content={() => this.tagRef}
                />
                <img alt="print-screen" id="canvas" ref={ref => this.tagRef = ref} style={{position: 'absolute', zIndex: '-1', maxWidth: window.innerWidth}} />
                <Card id="divcontents" style={{ padding: '1em', margin: '0.5em'}}>
                    <Grid style={{borderBottom: '2px solid gainsboro'}}>
                        <GridItem xs={12} md={4} lg={4} style={{display: 'flex', flexDirection: 'column', borderRight: '2px solid gainsboro', minHeight: '4em'}}>
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: '1.2em',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                PESO NETO
                            </div>
                            {product.weight}
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4} style={{display: 'flex', flexDirection: 'column', borderRight: '2px solid gainsboro', minHeight: '4em'}}>
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: '1.2em',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                LOTE
                            </div>
                            {product.batch}
                        </GridItem>
                        <GridItem xs={12} md={4} lg={4} style={{display: 'flex', flexDirection: 'column', minHeight: '4em'}}>
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: '1.2em',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                FECHA DE CADUCIDAD
                            </div>
                            {format(product.expirationDate * 1000, 'DD/MM/YYYY')}
                        </GridItem>
                    </Grid>
                    <Grid>
                        <GridItem xs={12} md={6} lg={6} style={{display: 'flex', flexDirection: 'column', borderRight: '2px solid gainsboro', minHeight: '4em'}}>
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: '1.2em',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                COD. BARRAS
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Barcode value={product.barcode} />
                            </div>
                        </GridItem>
                        <GridItem xs={12} md={6} lg={6} style={{display: 'flex', flexDirection: 'column', minHeight: '4em'}}>
                            <div
                                style={{
                                    width: '100%',
                                    backgroundColor: 'black',
                                    height: '1.2em',
                                    color: 'white',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={this.print}
                            >
                                COD. TRAZABILIDAD
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '1em', flexDirection: 'column'}}>
                                <QRCode value={qr} />
                            </div>
                        </GridItem>
                    </Grid>
                </Card>
            </div>
        )
    }
}

export default ProductTag;
