import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey, primary, secondary } from '../styles/colors';
import { API_URL, CLIENT_URL } from '../config';
import TextInput from '../UI/TextInput';
import ProductForm from './ProductForm';
import BasicButton from '../UI/BasicButton';
import { withRouter } from 'react-router-dom';
import { addDays } from 'date-fns';
import { MainAppContext } from '../containers/App';
import ProductTag from './ProductTag';

const TRANSPORTER_ADDRESS = '0c83b1bdf97ae4fa09185a44127696464be6c77b';

const RegisterPage = ({ history }) => {
    const [code, updateBarcode] = React.useState('');
    const [product, setProduct] = React.useState(null);
    const [generatedCode, setCode] = React.useState(null);
    const mainAppContext = React.useContext(MainAppContext);

    let timeout = null;

    const setBarcode = event => {
        clearTimeout(timeout);
        updateBarcode(event.target.value);
        timeout = setTimeout(searchCodeData, 450);
    }

    const goBack = () => {
        history.goBack();
    }

    const cleanForm = () => {
        setProduct(null);
        updateBarcode('');
        setCode(null)
    }

    //AÑADIR UUID GENERATION
    const registerUnit = async () => {
        const response = await sendRegisterTransaction({
            data: {
                expirationDate: addDays(new Date(), 15),
                barcode: '3123567678',
                batch: 'AE23GH',
                euCode: 'EU/1233446/27',
                ingredients: 'Cosas, y más',
                name: 'Queso',
                other: '',
                producer: 'Queseria',
                weight: '400gr'
            },
            type: 'registration',
            transporter: TRANSPORTER_ADDRESS
        }, mainAppContext.credentials);

        setCode(JSON.stringify(`${CLIENT_URL}/tracking/${response.product_hash}`));
    }

    const searchCodeData = () => {
        if(code === '1234'){
            const response = {
                expirationDate: addDays(new Date(), 30),
                barcode: '3123567678',
                batch: 'AE23GH',
                euCode: 'EU/1233446/27',
                ingredients: 'Cosas, y más',
                name: 'Queso',
                other: '',
                producer: 'Queseria',
                weight: '400gr'
            }

            setProduct(response);
        } else {
            setProduct(null);
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
                    ORDEN DE PRODUCCIÓN
                </h3>

                <TextInput
                    floatingText="Código del producto"
                    value={code}
                    id="text-input"
                    autoFocus={true}
                    onChange={setBarcode}
                />

                <ProductForm product={product} />

                <div style={{display: 'flex', marginBottom: '1em'}}>
                    <BasicButton
                        text="Volver"
                        type="flat"
                        textStyle={{fontWeight: '700', color: 'black'}}
                        buttonStyle={{marginRight: '0.3em'}}
                        onClick={goBack}
                    />
                    <BasicButton
                        text="Limpiar"
                        color={secondary}
                        textStyle={{fontWeight: '700', color: 'white'}}
                        buttonStyle={{marginRight: '0.3em'}}
                        onClick={cleanForm}
                    />
                    <BasicButton
                        text="Registrar"
                        color={primary}
                        type="raised"
                        textStyle={{fontWeight: '700', color: 'white'}}
                        disabled={!product}
                        onClick={registerUnit}
                    />
                </div>
                {!!generatedCode &&
                    <ProductTag
                        product={product}
                        qr={generatedCode}
                    />
                }
            </Paper>
        </div>
    )
}

const sendRegisterTransaction = async (data, account) => {

    const signedMessage = account.sign(JSON.stringify(data));
/* 
    console.log(signedMessage);

    console.log(signedMessage.message);
    console.log(signedMessage.signature); */

    const response = await fetch(`${API_URL}/api/v1.0/products`, {
        method: 'POST',
        body: JSON.stringify({
            message: signedMessage.message,
            signature: signedMessage.signature
        })
    })

    //console.log(response);

    const json = await response.json();
    console.log(json);
    return json;
}

export default withRouter(RegisterPage);

    /*SEND
        {
            barcode: 
            batch: 
            euCode: 
            expirationDate: 
            ingredients: String
            name:
            other: 
            uuid: 
            producer: 
            type
            weight: 
        },
        type: 'registration'


        /product POST

        /product/id PUT
        {
            signature:
            data: string({
                coords: {
                    latitude: asdasd,
                    longitude: asdasdas 
                }

            }),
            type: 'location'
        }

        /product/id PUT
        {
            signature:
            data: string({
                coords: {
                    latitude: asdasd,
                    longitude: asdasdas 
                }

            }),
            type: 'delivered'
        }

        /product/id PUT
        {
            signature:
            data: string({
                coords: {
                    latitude: asdasd,
                    longitude: asdasdas 
                }

            }),
            type: 'deliveryConfirmation'
        }
    */

    /*
        /product/hash GET
        {
            productInfo: '',
            trace: []
        }
    */
