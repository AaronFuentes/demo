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
import LoadingSection from '../UI/LoadingSection';

let location;
navigator.geolocation.getCurrentPosition(result => location = result);

const ShippingPage = ({ history }) => {
    const [loading, setLoading] = React.useState(false);
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
        if(loading){
            return;
        }
        const hash = extractHashFromURL(qr);
        if(products.has(hash)){
            setLoading(true);
            await sendProductStatusUpdate(hash, mainApp.credentials, 'delivered');
            products.delete(hash);
            updateProducts(new Map(products.entries()));
            updateQRcode('');
            setLoading(false);
            localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
        } else {
            const response = await sendProductStatusUpdate(hash, mainApp.credentials, 'loadUp');
            setLoading(true);
            if(response){
                products.set(hash, response);
                localStorage.setItem('loadedItems', JSON.stringify(Array.from(products.entries())));
                updateProducts(new Map(products.entries()));
                updateQRcode('');
                setLoading(false);
            }
        }
    }

    const handleEnter = event => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            searchQRData(extractHashFromURL(event.target.value));
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
                {loading &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <LoadingSection />
                    </div>
                }
                <BasicButton
                    text="Volver"
                    type="flat"
                    textStyle={{fontWeight: '700', color: 'black'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={goBack}
                />
                <BasicButton
                    text={mainApp.inTransit? "Parar tracking" : "Empezar tracking"}
                    color={primary}
                    textStyle={{fontWeight: '700', color: 'white'}}
                    buttonStyle={{marginRight: '0.3em', marginTop: '2em'}}
                    onClick={mainApp.inTransit? confirmArrive : confirmDeparture}
                />
                <br />
            </Paper>
        </div>
    )
}

const sendProductStatusUpdate = async (data, account, type) => {

    navigator.geolocation.getCurrentPosition(result => location = result);
    const dataString = JSON.stringify({
        type: type,
        data: {
            productId: data,
            coords: {
                latitude: location? location.coords.latitude : "41.656265795658165",
                longitude: location? location.coords.longitude : "-4.737810528601315"
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
