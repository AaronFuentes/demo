import React from 'react';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { Paper } from 'material-ui';
import html2canvas from 'html2canvas';
import ReactToPrint from "react-to-print";
import Barcode from 'react-barcode';


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
            <div style={{width: '100%', overflow: 'hidden'}}>
                <ReactToPrint
                    trigger={() => <a onClick={this.print}>Imprimir</a>}
                    content={() => this.tagRef}
                />
                <img id="canvas" ref={ref => this.tagRef = ref} style={{position: 'absolute', zIndex: '-1', maxWidth: window.innerWidth}} />
                <Paper id="divcontents" style={{ padding: '1em', border: '1px solid gainsboro'}}>
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
                            {format(product.expirationDate, 'DD/MM/YYYY')}
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
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '1em'}}>
                                <QRCode value={qr} />
                            </div>
                        </GridItem>
                    </Grid>
                </Paper>
            </div>
        )
    }
}

export default ProductTag;