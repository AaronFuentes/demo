import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey, primary, secondary } from '../styles/colors';
import TextInput from '../UI/TextInput';
import ProductForm from './ProductForm';
import BasicButton from '../UI/BasicButton';
import QRCode from 'qrcode.react';
import { withRouter } from 'react-router-dom';
import { addDays } from 'date-fns';
import { MainAppContext } from '../containers/App';

const TRANSPORTER_ADDRESS = '0c83b1bdf97ae4fa09185a44127696464be6c77b';

/* const account = {
    "address":"0c83b1bdf97ae4fa09185a44127696464be6c77b",
    "crypto":{
        "cipher":"aes-128-ctr",
        "ciphertext":"13602ab00b17bd8c71a9ee1c1845a50b7863cdb077a1f5dae51cc84c3bef01fd",
        "cipherparams":{
            "iv":"41aff11a107c4d19e76e89ec46acc7ac"
        },
        "kdf":"scrypt",
        "kdfparams":{
            "dklen":32,
            "n":262144,
            "p":1,
            "r":8,
            "salt":"4c9bc4332f396cb499ff43b816db5e39c0593be405578504b6b8dcf2b5994c59"
        },
        "mac":"8c624fa51c9e507d87f00f82c6219c8d26275ec7d5532e3ad39eeab06770d2a1"
    },
    "id":"f474beac-033f-4a71-ae0f-76d76e3dfd65",
    "version":3
};
 */
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

        /*TODO enter a url with the hash*/
        setCode(JSON.stringify(`http://localhost:3000/tracking/${response.product_hash}`));
    }

    const searchCodeData = () => {
        if(code === '1234'){
            const response = {
                name: 'Ejemplo de producto',
                expirationDate: new Date(),
                description: 'Descripción'
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
                    REGISTRO DE PRODUCTO
                </h3>

                <TextInput
                    floatingText="Código del producto"
                    value={code}
                    id="text-input"
                    autoFocus={true}
                    onChange={setBarcode}
                />

                <ProductForm product={product} />

                <div style={{display: 'flex'}}>
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
                    <QRCode value={generatedCode} />
                }
            </Paper>
        </div>
    )
}

/*
    body {
        data: (string) Datos del producto,
        signature: 
    }
*/

const sendRegisterTransaction = async (data, account) => {

    const signedMessage = account.sign(JSON.stringify(data));

    console.log(signedMessage);

    console.log(signedMessage.message);
    console.log(signedMessage.signature);

    const response = await fetch('http://172.18.2.99:8080/api/v1.0/products', {
        method: 'POST',
        body: JSON.stringify({
            message: signedMessage.message,
            signature: signedMessage.signature
        })
    })

    console.log(response);

    const json = await response.json();
    console.log(json);
    return json;


/*     return new Promise((resolve, reject) => {
        resolve({
            placeholder: 'asdjhakjsdhaskjdhaskdjashd'
        });
    }) */
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
