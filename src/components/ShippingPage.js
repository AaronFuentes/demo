import React from 'react';
import { lightGrey, primary } from '../styles/colors';
import { Paper } from 'material-ui';
import { withRouter } from 'react-router-dom';
import TextInput from '../UI/TextInput';
import BasicButton from '../UI/BasicButton';
import web3 from 'web3';
import ProductsList from './ProductsList';
import { MainAppContext, getLoadedItems } from '../containers/App';
import { API_URL } from '../config';
import { extractHashFromURL } from '../utils/hashUtils';

let location;
navigator.geolocation.getCurrentPosition(result => location = result);

const ShippingPage = ({ history }) => {

    const [products, updateProducts] = React.useState(getLoadedItems());
    const [qrCode, updateQRcode] = React.useState('');
    const mainApp = React.useContext(MainAppContext);

    const setQRCode = event => {
        const value = event.target.value;
        updateQRcode(extractHashFromURL(value));
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
        const hash = extractHashFromURL(qr);
        if(products.has(hash)){
            products.delete(hash);
            updateProducts(new Map(products.entries()));
            await sendProductLoadIn(hash, mainApp.credentials, 'delivered');
            updateQRcode('');
            localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
        } else {
            const response = await sendProductLoadIn(hash, mainApp.credentials, 'loadUp');
            if(response){
                products.set(hash, response);
                localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
                updateProducts(new Map(products.entries()));
                updateQRcode('');
            }
        }
    }

    const handleEnter = event => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            searchQRData(event.target.value);
        }
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

                <TextInput
                    floatingText="Código del producto"
                    value={qrCode}
                    id="text-input"
                    autoFocus={true}
                    onChange={setQRCode}
                    onKeyUp={handleEnter}
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
    const dataString = JSON.stringify({
        type: type,
        data: {
            coords: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            },
        },
    });
    const hashedMessage = web3.utils.sha3(dataString);
    const signedHash = account.sign(hashedMessage);

    const response = await fetch(`${API_URL}/api/v1.0/product/${data}`, {
        method: 'PUT',
        body: JSON.stringify({
            message: dataString,
            signature: signedHash.signature
        })
    })

    const json = await response.json();
    return json;
}

export default withRouter(ShippingPage);