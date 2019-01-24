import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey, primary, secondary } from '../styles/colors';
import { API_URL, CLIENT_URL } from '../config';
import TextInput from '../UI/TextInput';
import ProductForm from './ProductForm';
import BasicButton from '../UI/BasicButton';
import SelectInput from '../UI/SelectInput';
import { MenuItem } from 'material-ui';
import { withRouter } from 'react-router-dom';
import { MainAppContext } from '../containers/App';
import ProductTag from './ProductTag';
import { createSalt } from '../utils/hashUtils';
import web3 from 'web3';
import LoadingSection from '../UI/LoadingSection';
import bg from '../assets/img/lg-bg.png';
import SentEvidenceDisplay from './SentEvidenceDisplay';
import { createEvidencePDF } from '../utils/documentation';

createSalt();

const initialProductState = {
    expirationDate: new Date().getTime(),
    barcode: '',
    ingredients: '',
    name: '',
    other: '',
    batch: '',
    weight: ''
}

const RegisterPage = ({ history }) => {
    const [fromTX, setFrom] = React.useState('');
    const [evidenceSent, setEvidenceSent] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [product, setProduct] = React.useState(initialProductState);
    const [txHash, setTXHash] = React.useState('');
    const qrValue = React.useRef(null);
    const [generatedCode, setCode] = React.useState(null);
    const mainAppContext = React.useContext(MainAppContext);
    let createdTraces = localStorage.getItem('createdTraces')? JSON.parse(localStorage.getItem('createdTraces')) : [];


    const goBack = () => {
        history.goBack();
    }

    const updateProduct = object => {
        setProduct({
            ...product,
            ...object
        });
    }

    const cleanForm = () => {
        setProduct(initialProductState);
    }

    const registerUnit = async () => {
        setLoading(true);
        const response = await sendRegisterTransaction({
            type: 'NEW_TRACE',
            trace: '0x0000000000000000000000000000000000000000000000000000000000000000',
            fragments: [JSON.stringify({
                data: {
                    ...product
                }})
            ],
            descriptor: [],
            salt: createSalt(),
        }, fromTX, mainAppContext.credentials);
        setLoading(false);
        if(response){
            createdTraces.push(response);
            localStorage.setItem('createdTraces', JSON.stringify(createdTraces));
            qrValue.current.value = response.evhash;
            qrValue.current.select();
            document.execCommand('copy');
            setCode(JSON.stringify(`${CLIENT_URL}/tracking/${response.evhash}`));
            setTXHash(`0x${response.evidence.substring(0, 64)}`);
            setEvidenceSent(response);
        }
        else alert('fallo al guardar la transacción');
    }

    const updateFromTX = event => {
        console.log(event.target.value);
        setFrom(event.target.value);
    }

    const createPDF = () => {
        createEvidencePDF();
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: `url(${bg})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                padding: '1em 0px',
                justifyContent: 'center',
                overflowX: 'hidden',
                overflowY: 'auto'
            }}
        >
            <Paper
                style={{
                    width: '850px',
                    backgroundColor: 'white',
                    padding: '2.2em',
                    paddingTop: '1em',
                    margin: 'auto'
                }}
            >
                <h3>
                    ORDEN DE PRODUCCIÓN
                </h3>
                <SelectInput
                    floatingText="Añadir traza origen"
                    onChange={updateFromTX}
                    value={fromTX}
                >
                    {createdTraces.map(trace => (
                        <MenuItem key={trace.evidence} value={trace.evhash}>
                            {trace.evhash}
                        </MenuItem>
                    ))}
                </SelectInput>

                <ProductForm product={product} updateProduct={updateProduct} />
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
                    <SentEvidenceDisplay evidence={evidenceSent.evidenceSent} />
                }
                {!!generatedCode &&
                    <>
                        <ProductTag
                            evHash={evidenceSent.evHash}
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

const sendRegisterTransaction = async (content, fromTX, account) => {
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
        from: fromTX? [fromTX] : [],
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

    if(response.status === 200){
        const json = await response.json();
        return {
            ...json,
            evidenceSent: evidence
        };
    }

    return null;

}

export default withRouter(RegisterPage);
