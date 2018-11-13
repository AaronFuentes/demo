import React from 'react';
import { lightGrey, primary, secondary } from '../styles/colors';
import { Paper } from 'material-ui';
import { withRouter } from 'react-router-dom';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import ProductsList from './ProductsList';
import { MainAppContext, getLoadedItems } from '../containers/App';

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
        if(products.has('#12345' + unloadCounter)){
            products.delete('#12345' + unloadCounter);
            updateProducts(new Map(products.entries()));
            const response = await sendProductLoadIn(extractHash(`c5ce2e6f3b05333009d473523815000225b6e11218ca4d0a2df79c2096d679d1`), mainApp.credentials, 'delivered');
            localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
            unloadCounter--;
        } else {
            //EN LA RESPUESTA NECESITO LOS DATOS DEL PRODUCTO
            const response = await sendProductLoadIn(extractHash(qrCode), mainApp.credentials, 'loadUp');
            if(response){
                products.set(response.hash, response);
                localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
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

    const response = await fetch(`http://172.18.2.99:8080/api/v1.0/product/${data}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: signedMessage.message,
            signature: signedMessage.signature
        })
    })

    const json = await response.json();
    console.log(json);

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

const extractHash = url => {
    return url;
    const index = url.indexOf('0x');
    let hash = url.substr(index);
    return hash;
}

export default withRouter(ShippingPage);