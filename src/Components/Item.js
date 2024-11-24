import React from 'react';
import { Paper } from '@mui/material';

function Item({ item }) {
    return (
        <Paper 
            style={{ 
                textAlign: 'center', 
                overflow: 'hidden' // Evita que las imágenes se salgan del contenedor
            }}
        >
            <img 
                src={item.image} 
                alt={item.alt || 'Imagen de carrusel'}
                style={{ 
                    width: '100%', 
                    height: 'auto', // Cambia la altura para que se adapte automáticamente
                    maxHeight: '70vh', // Limita la altura máxima en pantallas grandes
                    objectFit: 'cover' // Asegura que la imagen se ajuste bien al contenedor
                }} 
            />
        </Paper>
    );
}

export default Item;
