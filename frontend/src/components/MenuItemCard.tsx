import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import type { MenuItem } from '../types';
import { useCart } from '../context/CartContext';

const MenuItemCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const { addToCart, setCartOpen } = useCart();
  const handleAdd = () => {
    addToCart(item);
    setCartOpen(true);
  };
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1, borderRadius: 2 }}>
      <CardMedia component="img" image={item.image || '/images/food1.jpg'} sx={{ width: 110, height: 110, borderRadius: 1, objectFit: 'cover' }} />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" fontWeight={700}>{item.name}</Typography>
        <Typography variant="body2" color="text.secondary">{item.category}</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>₹{item.price}</Typography>
          <Button variant="contained" size="small" onClick={handleAdd}>Add</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;
