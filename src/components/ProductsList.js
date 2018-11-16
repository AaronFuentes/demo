import React from 'react';
import Grid from '../UI/Grid';
import GridItem from '../UI/GridItem';

const ProductsList = ({ products }) => {
    const productsArray = Array.from(products.entries());

    return (
        <Grid style={{width: '100%'}}>
        <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Hash del producto
            </GridItem>
            <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Artículo
            </GridItem>
            <GridItem xs={4} md={4} lg={4} style={{fontWeight: '700'}}>
                Transacción de carga
            </GridItem>
            {productsArray.map(product =>
                <React.Fragment key={`product_hash_${product[0]}`}>
                    <GridItem xs={4} md={4} lg={4} className="overflowText">
                        {product[0]}
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4}>
                        {product[1].data.name}
                    </GridItem>
                    <GridItem xs={4} md={4} lg={4} className="truncate">
                        <a
                            href={`https://alastria-explorer.councilbox.com/transaction/${product[1].tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {product[1].tx_hash}
                        </a>
                    </GridItem>
                </React.Fragment>
            )}
        </Grid>
    )
}

export default ProductsList