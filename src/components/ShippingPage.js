import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { LOCATION_INTERVAL } from '../config';
import { Paper } from 'material-ui';
import { withRouter } from 'react-router-dom';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import ProductsList from './ProductsList';

let loadCounter = 0;
let unloadCounter = 5;
let interval = null;
let timeout = null;

const ShippingPage = ({ history }) => {

    const [products, updateProducts] = React.useState(new Map());
    const [qrCode, updateQRcode] = React.useState('');
    const [inTransit, updateInTransit] = React.useState(false);


    const setQRCode = event => {
        clearTimeout(timeout);
        updateQRcode(event.target.value);
        timeout = setTimeout(searchQRData, 450);
    }

    const goBack = () => {
        history.goBack();
    }

    const confirmDeparture = () => {
        interval = setInterval(() => navigator.geolocation.getCurrentPosition(location => console.log(location)), LOCATION_INTERVAL);
        updateInTransit(true);
    }

    const confirmArrive = () => {
        clearInterval(interval);
        updateInTransit(false);
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

                <ProductsList products={Array.from(products.values())} />
                <BasicButton
                    text="Volver"
                    type="flat"
                    textStyle={{fontWeight: '700', color: 'black'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={goBack}
                />
                <BasicButton
                    text={inTransit? "Confirmar llegada" : "Confirmar salida"}
                    color={primary}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={inTransit? confirmArrive : confirmDeparture}
                />
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
            loadDate: new Date(),
            hash: '#12345' + loadCounter
        })
    })
}

export default withRouter(ShippingPage);