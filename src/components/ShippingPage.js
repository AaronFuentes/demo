import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { Paper } from 'material-ui';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';

let loadCounter = 0;
let unloadCounter = 5;

const ShippingPage = () => {

    const [products, updateProducts] = React.useState(new Map());
    const [qrCode, updateQRcode] = React.useState('');

    let timeout = null;

    const setQRCode = event => {
        clearTimeout(timeout);
        updateQRcode(event.target.value);
        timeout = setTimeout(searchQRData, 450);
    }

    const searchQRData = async () => {
        if(products.has('#12345' + unloadCounter)){
            products.delete('#12345' + unloadCounter);
            updateProducts(new Map(products.entries()));
            unloadCounter--;
        } else {
            const response = await getProduct();
            if(response){
                products.set(response.hash, response);
                updateProducts(new Map(products.entries()));
                loadCounter++;
            }
        }
    }

    const simulateRead = () => {
        searchQRData();
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                backgroundColor: lightGrey,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Paper
                style={{
                    width: '850px',
                    height: '85%',
                    backgroundColor: 'white',
                    padding: '2.2em',
                    paddingTop: '1em',
                }}
            >
                <h3>
                    REGISTRO DE CARGA / DESCARGA
                </h3>
                <BasicButton
                    onClick={simulateRead}
                    text="Simular lectura"
                />

                <TextInput
                    floatingText="Código del producto"
                    value={qrCode}
                    id="text-input"
                    autoFocus={true}
                    onChange={setQRCode}
                />

                {Array.from(products.values()).map(product =>
                    <div style={{fontWeight: '700'}}>
                        {product.name}
                    </div>
                )}
            </Paper>
        </div>
    )
}

const getProduct = qr => {
    return new Promise((resolve, reject) => {
        resolve({
            name: 'Ejemplo de producto',
            expirationDate: new Date(),
            description: 'Descripción',
            hash: '#12345' + loadCounter
        })
    })
}

export default ShippingPage;