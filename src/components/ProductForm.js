import React from 'react';
import TextInput from '../UI/TextInput';

const ProductForm = ({ product }) => {

    return (
        <div style={{marginTop: '3em'}}>
            <TextInput
                floatingText="Nombre del producto"
                value={!!product? product.name : ''}
                disabled
                id="text-input"
            />
            <TextInput
                floatingText="Fecha de caducidad"
                value={!!product? product.expirationDate : ''}
                disabled
                id="text-input"
            />
            <TextInput
                floatingText="Descripción"
                value={!!product? product.description : ''}
                disabled
                id="text-input"
            />
        </div>
    )
}

export default ProductForm;