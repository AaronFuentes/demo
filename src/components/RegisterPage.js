import React from 'react';
import { Paper } from 'material-ui';
import { lightGrey } from '../styles/colors';
import TextInput from '../UI/TextInput';

const RegisterPage = () => {
    const [code, updateCode] = React.useState('');
    const [product, setProduct] = React.useState(null);

    let timeout = null;

    const setCode = event => {
        clearTimeout(timeout);
        updateCode(event.target.value);
        timeout = setTimeout(searchCodeData, 450);
    }

    const searchCodeData = () => {
        if(code === '1234'){
            const response = {
                name: 'Ejemplo de producto'
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
                    onChange={setCode}
                />

                <div style={{marginTop: '3em'}}>
                    <TextInput
                        floatingText="Nombre del producto"
                        value={!!product? product.name : ''}
                        disabled
                        id="text-input"
                    />
                </div>

            </Paper>
        </div>
    )
}

export default RegisterPage;