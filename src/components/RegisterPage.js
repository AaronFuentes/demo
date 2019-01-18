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
import { createSalt } from '../utils/hashUtils';
import web3 from 'web3';
import LoadingSection from '../UI/LoadingSection';
import bg from '../assets/img/lg-bg.png';
import SentEvidenceDisplay from './SentEvidenceDisplay';

createSalt();

const RegisterPage = ({ history }) => {
    const [code, updateBarcode] = React.useState('');
    const [evidenceSent, setEvidenceSent] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState({
        expirationDate: "1544896572",
        barcode: code,
        batch: 'AE23GH',
        euCode: 'EU/1233446/27',
        ingredients: 'Leche pasteurizada de vaca, sal, cuajo y fermentos lácticos.',
        name: 'Queso de mezcla madurado',
        other: '',
        producer: 'Quesos CBX',
        weight: '400gr'
    });
    const [txHash, setTXHash] = React.useState('');
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
            type: 'NEW_TRACE', //ADD_EVENT
            trace: '0x0000000000000000000000000000000000000000000000000000000000000000',
            fragments: [JSON.stringify({
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
                }})
            ],
            descriptor: [],
            salt: createSalt(),
        }, mainAppContext.credentials);
        setLoading(false);
        console.log(response);
        qrValue.current.value = response.evhash;
        qrValue.current.select();
        document.execCommand('copy');
        setCode(JSON.stringify(`${CLIENT_URL}/tracking/${response.evhash}`));
        setTXHash(`0x${response.evidence.substring(0, 64)}`);
        setEvidenceSent(response.evidenceSent);
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
                background: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
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
                        //disabled={!product}
                        onClick={registerUnit}
                    />
                </div>
                {loading &&
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <LoadingSection />
                    </div>

                }
                {evidenceSent &&
                    <SentEvidenceDisplay evidence={evidenceSent} />
                }
                {!!generatedCode &&
                    <>
                        <ProductTag
                            product={product}
                            qr={generatedCode}
                            txHash={txHash}
                        />
                    </>
                }
            </Paper>
        </div>
    )
}

const sendRegisterTransaction = async (content, account) => {
    const contentBeforeHash = JSON.stringify({
        type: content.type,
        trace: content.trace,
        fragment_hashes: content.fragments.map(fragment => web3.utils.keccak256(fragment).substring(2)),
        descriptor: content.descriptor,
        salt: content.salt
    });
    const contentHash = web3.utils.keccak256(contentBeforeHash);
    const dataToSign = JSON.stringify({
        version: 1,
        nodecode: 0,
        from: ['070899d6831eec8c5ee3c80e0f7c881de093d5c15de744a5a92618e379fca457'],
        content_hash: contentHash.substring(2)
    });

    const signedContent = account.sign(dataToSign);

    const evidence = JSON.stringify({
        event_tx: signedContent.message,
        content,
        signature: signedContent.signature.substring(2)
    })

    const response = await fetch(`${API_URL}/api/v1.0/products`, {
        method: 'POST',
        body: evidence
    });

    const json = await response.json();
    return {
        ...json,
        evidenceSent: evidence
    };
}

export default withRouter(RegisterPage);
