import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  open: boolean;
  menuItemName?: string;
  initialQuantity?: number;
  onClose: () => void;
  onConfirm: (opts: { notes: string; quantity: number }) => void;
}

export default function CustomizationDialog({ open, menuItemName, initialQuantity = 1, onClose, onConfirm }: Props) {
  const [notes, setNotes] = React.useState('');
  const [quantity, setQuantity] = React.useState<number>(initialQuantity);

  React.useEffect(() => {
    if (open) {
      setNotes('');
      setQuantity(initialQuantity);
    }
  }, [open, initialQuantity]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">Customize {menuItemName ?? 'item'}</Typography>
        <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small"/></IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Special instructions / notes" multiline minRows={3} value={notes} onChange={(e) => setNotes(e.target.value)} fullWidth />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography>Quantity</Typography>
            <Button size="small" variant="outlined" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</Button>
            <Typography sx={{ minWidth: 28, textAlign: 'center' }}>{quantity}</Typography>
            <Button size="small" variant="outlined" onClick={() => setQuantity((q) => q + 1)}>+</Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onConfirm({ notes, quantity })}>Add with options</Button>
      </DialogActions>
    </Dialog>
  );
}
