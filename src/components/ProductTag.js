import React from 'react';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import QRCode from 'qrcode.react';
import { format } from 'date-fns';
import { Paper } from 'material-ui';

const ProductTag = ({ product, qr }) => {

    const print = () => {
        const content = document.getElementById("divcontents");
        let pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content.innerHTML);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    return (
        <Paper id="divcontents">
            <Grid style={{borderBottom: '2px solid gainsboro'}}>
                <GridItem xs={12} md={4} lg={4} style={{display: 'flex', flexDirection: 'column', borderRight: '2px solid gainsboro', minHeight: '4em'}}>
                    <div
                        style={{
                            width: '100%',
                            backgroundColor: 'black',
                            height: '1.2em',
                            color: 'white',
                            textAlign: 'center'
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
                            textAlign: 'center'
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
                            textAlign: 'center'
                        }}
                    >
                        FECHA DE CADUCIDAD
                    </div>
                    {format(product.expirationDate, 'DD/MM/YYY')}
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
                            textAlign: 'center'
                        }}
                    >
                        COD. BARRAS
                    </div>
                    {product.barcode}
                </GridItem>
                <GridItem xs={12} md={6} lg={6} style={{display: 'flex', flexDirection: 'column', minHeight: '4em'}}>
                    <div
                        style={{
                            width: '100%',
                            backgroundColor: 'black',
                            height: '1.2em',
                            color: 'white',
                            textAlign: 'center'
                        }}
                        onClick={print}
                    >
                        COD. TRAZABILIDAD
                    </div>
                    <QRCode value={qr} />
                </GridItem>
            </Grid>
        </Paper>
    )
}

export default ProductTag;