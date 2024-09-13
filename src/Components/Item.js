import React from 'react';
import { Paper, Button } from '@mui/material';

function Item({ item }) {
    return (
        <Paper style={{ textAlign: 'center' }}>
            <img 
                src={item.image} 
                style={{ width: '100%', height: '70vh'}} 
            />
        </Paper>
    );
}

export default Item;
