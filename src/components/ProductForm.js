import React from 'react';
import TextInput from '../UI/TextInput';
import { format, addDays } from 'date-fns';

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
                value={!!product? format(addDays(product.expirationDate, 30), 'DD/MM/YYYY - HH:mm:ss') : ''}
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