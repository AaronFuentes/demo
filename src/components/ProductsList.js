import React from 'react';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';
import { format } from 'date-fns';


const ProductsList = ({ products }) => {

    return (
        <Grid style={{width: '100%'}}>
        <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Código
            </GridItem>
            <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Artículo
            </GridItem>
            <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Fecha de carga
            </GridItem>
            {products.map(product =>
                <React.Fragment key={`product_hash_${product.hash}`}>
                    <GridItem xs={4} md={4} lg={4} className="overflowText">
                        {product.hash}
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4}>
                        {product.name}
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4}>
                        {format(product.loadDate, 'DD/MM/YYYY - HH:mm:ss:SSS')}
                    </GridItem>
                </React.Fragment>
            )}
        </Grid>
    )
}

export default ProductsList