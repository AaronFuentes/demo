import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey, primary, secondary } from '../styles/colors';
import TextInput from '../UI/TextInput';
import ProductForm from './ProductForm';
import BasicButton from '../UI/BasicButton';
import QRCode from 'qrcode.react';
import { withRouter } from 'react-router-dom';

const RegisterPage = ({ history }) => {
    const [code, updateBarcode] = React.useState('');
    const [product, setProduct] = React.useState(null);
    const [generatedCode, setCode] = React.useState(null);

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

    const registerUnit = async () => {
        const response = await sendRegisterTransaction({
            product
        });

        setCode(JSON.stringify(response));
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

const sendRegisterTransaction = () => {
    return new Promise((resolve, reject) => {
        resolve({
            placeholder: 'asdjhakjsdhaskjdhaskdjashd'
        });
    })
}

export default withRouter(RegisterPage);