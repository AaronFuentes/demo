import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { Paper } from 'material-ui';
import { withRouter } from 'react-router-dom';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import ProductsList from './ProductsList';
import { MainAppContext, getLoadedItems } from '../containers/App';
import { API_URL } from '../config';

let loadCounter = 0;
let unloadCounter = 5;
let timeout = null;
let location;
navigator.geolocation.getCurrentPosition(result => location = result);

const ShippingPage = ({ history }) => {

    const [products, updateProducts] = React.useState(getLoadedItems());
    const [qrCode, updateQRcode] = React.useState('');
    const mainApp = React.useContext(MainAppContext);
    console.log(mainApp);


    const setQRCode = event => {
        clearTimeout(timeout);
        const value = event.target.value;
        updateQRcode(event.target.value);
        timeout = setTimeout(() => searchQRData(value), 450);
    }

    const goBack = () => {
        history.goBack();
    }

    const confirmDeparture = () => {
        mainApp.startInTransit();
    }

    const confirmArrive = () => {
        mainApp.stopInTransit();
    }

    const searchQRData = async qr => {
        const hash = extractHash(qr);
        if(products.has(hash)){
            products.delete(hash);
            updateProducts(new Map(products.entries()));
            const response = await sendProductLoadIn(hash, mainApp.credentials, 'delivered');
            console.log(response);
            localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
            unloadCounter--;
        } else {
            //EN LA RESPUESTA NECESITO LOS DATOS DEL PRODUCTO
            const response = await sendProductLoadIn(hash, mainApp.credentials, 'loadUp');
            if(response){
                console.log(response);
                products.set(hash, response);
                localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
                updateProducts(new Map(products.entries()));
                loadCounter++;
            }
        }
    }

    const simulateRead = () => {
        searchQRData('123423423');
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
                    MÓDULO DE PICKING
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

                <ProductsList products={products} />
                <BasicButton
                    text="Volver"
                    type="flat"
                    textStyle={{fontWeight: '700', color: 'black'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={goBack}
                />
                <BasicButton
                    text={mainApp.inTransit? "Confirmar llegada" : "Confirmar salida"}
                    color={primary}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={mainApp.inTransit? confirmArrive : confirmDeparture}
                />
            </Paper>
        </div>
    )
}

const sendProductLoadIn = async (data, account, type) => {

    navigator.geolocation.getCurrentPosition(result => location = result);

    const signedMessage = account.sign(JSON.stringify({
        data: {
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
        },
        type: type
    }));

    console.log(signedMessage.message);
    console.log(signedMessage.signature);

    const response = await fetch(`${API_URL}/api/v1.0/product/${data}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: signedMessage.message,
            signature: signedMessage.signature
        })
    })

    const json = await response.json();
    console.log(json);
    return json;
}

/*
data:{
    barcode: "3123567678"
    batch: "AE23GH"
    euCode: "EU/1233446/27"
    expirationDate: "2018-11-28T18:08:13.230Z"
    ingredients: "Cosas, y más"
    name: "Queso"
    other: ""
    producer: "Queseria"
    weight: "400gr"
}
tx_hash: "0x0069134cfd9043dfddfa303f99d0cec0dfb9699aff9a92562b7aece73446df80"

*/

const extractHash = url => {
    return url;
    const index = url.indexOf('0x');
    let hash = url.substr(index);
    return hash;
}

export default withRouter(ShippingPage);