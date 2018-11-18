import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey, primary, secondary } from '../styles/colors';
import { API_URL, CLIENT_URL } from '../config';
import TextInput from '../UI/TextInput';
import ProductForm from './ProductForm';
import BasicButton from '../UI/BasicButton';
import { withRouter } from 'react-router-dom';
import { MainAppContext } from '../containers/App';
import ProductTag from './ProductTag';
import web3 from 'web3';
import LoadingSection from '../UI/LoadingSection';
const TRANSPORTER_ADDRESS = '0x15947aC4B9f0f66fF17C2AA6510e3671f385Dd4e';

const RegisterPage = ({ history }) => {
    const [code, updateBarcode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(null);
    const qrValue = React.useRef(null);
    const [barcodeError, setBarcodeError] = React.useState('');
    const [generatedCode, setCode] = React.useState(null);
    const mainAppContext = React.useContext(MainAppContext);

    const goBack = () => {
        history.goBack();
    }

    const cleanForm = () => {
        setProduct(null);
        updateBarcode('');
        setCode(null)
    }

    const registerUnit = async () => {
        setLoading(true);
        const response = await sendRegisterTransaction({
            type: 'registration',
            transporter: TRANSPORTER_ADDRESS,
            origin: mainAppContext.credentials.address,
            productType: "9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658",
            data: {
                expirationDate: "1544896572",
                barcode: code,
                batch: 'AE23GH',
                euCode: 'EU/1233446/27',
                ingredients: 'Leche pasteurizada de vaca, sal, cuajo y fermentos lácticos.',
                name: 'Queso de mezcla madurado',
                other: '',
                producer: 'Quesos CBX',
                weight: '400gr'
            }
        }, mainAppContext.credentials);
        setLoading(false);
        qrValue.current.value = response.product_hash;
        qrValue.current.select();
        document.execCommand('copy');
        setCode(JSON.stringify(`${CLIENT_URL}/tracking/${response.product_hash}`));
    }

    const handleEnter = event => {
        const key = event.nativeEvent;

        if(key.keyCode === 13){
            searchCodeData(event.target.value);
        }
    }

    const checkValidBarcode = bc => {
        if(bc < 2980236002700 || bc > 2980236002799){
            setBarcodeError('El código introducido no es válido');
            return false;
        }
        setBarcodeError('');
        return true;
    }

    const searchCodeData = bc => {
        if(checkValidBarcode(bc)){
            const response = {
                expirationDate: "1544896572",
                barcode: bc,
                batch: 'AE23GH',
                euCode: 'EU/1233446/27',
                ingredients: 'Leche pasteurizada de vaca, sal, cuajo y fermentos lácticos.',
                name: 'Queso de mezcla madurado',
                other: '',
                producer: 'Quesos CBX',
                weight: '400gr'
            }

            updateBarcode(bc);
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
                justifyContent: 'center',
                overflowX: 'hidden'
            }}
        >
            <Paper
                style={{
                    width: '850px',
                    minHeight: '85%',
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
                    id="text-input"
                    errorText={barcodeError}
                    autoFocus={true}
                    onKeyUp={handleEnter}
                />

                <ProductForm product={product} />
                <input
                    type="input"
                    style={{visibility: 'hidden'}}
                    id="qrValue"
                    ref={qrValue}
                />

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
                        text="Producir"
                        loading={loading}
                        color={primary}
                        type="raised"
                        textStyle={{fontWeight: '700', color: 'white'}}
                        disabled={!product}
                        onClick={registerUnit}
                    />
                </div>
                {loading &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <LoadingSection />
                    </div>

                }
                {!!generatedCode &&
                    <>
                        <ProductTag
                            product={product}
                            qr={generatedCode}
                        />
                    </>
                }
            </Paper>
        </div>
    )
}

const sendRegisterTransaction = async (data, account) => {
    const dataString = JSON.stringify(data);
    const hashedMessage = web3.utils.sha3(dataString);
    const signedHash = account.sign(hashedMessage);

    const response = await fetch(`${API_URL}/api/v1.0/products`, {
        method: 'POST',
        body: JSON.stringify({
            message: dataString,
            signature: signedHash.signature
        })
    });

    const json = await response.json();
    return json;
}

export default withRouter(RegisterPage);
