import React from 'react';
import TextInput from '../UI/TextInput';
import { format, addDays } from 'date-fns';

const ProductForm = ({ product, updateProduct }) => {
    return (
        <div style={{marginTop: '3em'}}>
            <TextInput
                floatingText="Código del producto"
                id="text-input"
                onChange={event => updateProduct({ barcode: event.target.value })}
                value={!!product? product.barcode : ''}
            />
            <TextInput
                floatingText="Nombre del producto"
                onChange={event => updateProduct({ name: event.target.value })}
                value={!!product? product.name : ''}
                id="text-input"
            />
            <TextInput
                floatingText="Fecha de caducidad"
                onChange={event => updateProduct({ expirationDate: event.target.value })}
                value={!!product? format(addDays(product.expirationDate * 1000, 30), 'DD/MM/YYYY - HH:mm:ss') : ''}
                id="text-input"
            />
            <TextInput
                floatingText="Lote"
                onChange={event => updateProduct({ batch: event.target.value })}
                value={!!product? product.batch : ''}
                id="text-input"
            />
            <TextInput
                floatingText="Peso neto"
                onChange={event => updateProduct({ weight: event.target.value })}
                value={!!product? product.weight : ''}
                id="text-input"
            />
            <TextInput
                floatingText="Ingredientes"
                multiline
                onChange={event => updateProduct({ ingredients: event.target.value })}
                value={!!product? product.ingredients : ''}
                id="text-input"
            />
            <TextInput
                floatingText="Otros"
                multiline
                onChange={event => updateProduct({ other: event.target.value })}
                value={!!product? product.other : ''}
                id="text-input"
            />
        </div>
    )
}

export default ProductForm;

//2980236002700 - 2980236002700