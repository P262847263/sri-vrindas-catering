import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  MenuItem as MuiMenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Stack,
  FormControlLabel,
  Switch,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../services/api';
import type { MenuItem } from '../types';

const AdminMenuPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '',
    menuGroup: '',
    category: '',
    price: 0,
    isAvailable: true,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });
  const [adding, setAdding] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id?: string }>({ open: false });

  const menuCategories = [
    // Regular Menu
    'Starters / Snacks',
    'Main Course – Curries & Gravies',
    'Rice & Biryani',
    'Indian Breads',
    'South Indian Specialties',
    // Party Menu
    'Welcome Drinks',
    'Starters',
    'Main Course (Heavy Dishes)',
    'Indian Breads',
    'Sides',
    'Desserts',
    // Birthday Menu
    'Cakes',
    'Heavy Dishes',
    'Chinese',
    'Dessert',
    'Ice Cream',
    'Italian',
    // Upvas Menu
    'Drinks',
    'Snacks / Starters',
    'Main Dishes',
    'Sides',
    'Sweets / Desserts',
    // Cloud Kitchen
    'Daily Tiffin Service',
    'Breakfast Menu',
    'Lunch Menu',
    'Dinner Menu',
    'Starters & Snacks',
    'Sweets & Desserts',
    'Beverages & Add-Ons',
  ];

  const menuGroups: Record<string, string[]> = {
    All: menuCategories,
    Regular: [
      'Starters / Snacks', 'Main Course – Curries & Gravies', 'Rice & Biryani', 'Indian Breads', 'South Indian Specialties', 'Desserts', 'Beverages'
    ],
    Party: [
      'Welcome Drinks','Starters','Main Course (Heavy Dishes)','Indian Breads','Sides','Desserts'
    ],
    Upvas: [
      'Drinks','Snacks / Starters','Main Dishes','Sides','Sweets / Desserts'
    ],
    'Cloud Kitchen': [
      'Daily Tiffin Service','Breakfast Menu','Lunch Menu','Dinner Menu','Starters & Snacks','Sweets & Desserts','Beverages & Add-Ons'
    ]
  };

  const menuGroupOptions = ['Upvas', 'Regular', 'Party', 'Cloud Kitchen'];
  const categoryOptions = form.menuGroup ? menuGroups[form.menuGroup] || [] : menuCategories;

  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  // edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Partial<MenuItem> | null>(null);

  const openEditDialog = (item: MenuItem) => {
    setEditItem({ ...item });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
    setEditItem(null);
  };

  const submitEdit = () => {
    if (!editItem || !editItem._id) return closeEditDialog();
    const payload: Partial<MenuItem> = {
      name: editItem.name,
      menuGroup: editItem.menuGroup,
      category: editItem.category,
      price: Number(editItem.price || 0),
      isAvailable: !!editItem.isAvailable,
    };
    updateMutation.mutate({ id: String(editItem._id), payload });
    closeEditDialog();
  };

  const {
    data: menuItems,
    isLoading,
  } = useQuery<MenuItem[]>({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const res = await menuApi.getAll();
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: Partial<MenuItem> | FormData) => {
      // menuApi.add accepts JSON or FormData
      const res = await menuApi.add(newItem as any);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
      // clear the form only after success so user sees the item was added
      setForm({ name: '', menuGroup: '', category: '', price: 0, isAvailable: true });
    },
    onError: (err: any) => setSnackbar({ open: true, message: err?.response?.data?.error || err?.message || 'Failed to add item', severity: 'error' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await menuApi.delete(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setSnackbar({ open: true, message: 'Menu item deleted', severity: 'success' });
    },
    onError: (err: any) => setSnackbar({ open: true, message: err?.response?.data?.error || err?.message || 'Failed to delete item', severity: 'error' }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<MenuItem> }) => {
      const res = await menuApi.update(id, payload as any);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
      setSnackbar({ open: true, message: 'Item updated', severity: 'success' });
    },
    onError: (err: any) => setSnackbar({ open: true, message: err?.response?.data?.error || err?.message || 'Failed to update item', severity: 'error' }),
  });

  const handleConfirmDelete = (id: string) => {
    setDeleteDialog({ open: true, id });
  };

  const handleDeleteDialogClose = (confirmed = false) => {
    if (confirmed && deleteDialog.id) deleteMutation.mutate(deleteDialog.id);
    setDeleteDialog({ open: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCategoryChange = (e: SelectChangeEvent) => {
    setForm((prev) => ({
      ...prev,
      category: e.target.value as string,
    }));
  };

  const handleMenuGroupChange = (e: SelectChangeEvent) => {
    setForm((prev) => ({ ...prev, menuGroup: e.target.value as string, category: '' }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.menuGroup || !form.category) return;
    const payload = {
      name: form.name,
      menuGroup: form.menuGroup,
      category: form.category,
      price: Number(form.price || 0),
      isAvailable: form.isAvailable,
    } as Partial<MenuItem>;
    // show an immediate info snackbar so user knows the add is in progress
    setSnackbar({ open: true, message: 'Adding item...', severity: 'info' });
    setAdding(true);
    addMutation.mutate(payload as any, { onSettled: () => setAdding(false) });
  };


  const handleCloseSnackbar = (_?: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbar(s => ({ ...s, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 6, px: 2 }}>
      <Stack spacing={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <MenuBookIcon />
          </Avatar>
          <Box>
            <Typography variant="h4">Admin Menu Management</Typography>
            <Typography variant="body2" color="text.secondary">Add, edit and remove menu items for your site.</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <Paper sx={{ p: 3, height: '100%' }} elevation={3}>
              <Typography variant="h6" gutterBottom>Add Menu Item</Typography>
              <form onSubmit={handleAdd}>
                <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField label="Price (₹)" name="price" value={form.price} onChange={handleChange} fullWidth margin="normal" type="number" />
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="menu-group-label">Menu</InputLabel>
                  <Select
                    labelId="menu-group-label"
                    value={form.menuGroup}
                    label="Menu"
                    onChange={handleMenuGroupChange}
                  >
                    {menuGroupOptions.map((group) => (
                      <MuiMenuItem key={group} value={group}>{group}</MuiMenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={form.category}
                    label="Category"
                    onChange={handleCategoryChange}
                    disabled={!form.menuGroup}
                  >
                    {categoryOptions.map((cat) => (
                      <MuiMenuItem key={cat} value={cat}>{cat}</MuiMenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControlLabel control={<Switch checked={form.isAvailable} name="isAvailable" onChange={handleChange as any} />} label="Available" />
                <Divider sx={{ my: 2 }} />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }} fullWidth disabled={adding}>
                  {adding ? 'Adding...' : 'Add Item'}
                </Button>
              </form>
            </Paper>
          </Box>

          <Box sx={{ width: { xs: '100%', md: '67%' } }}>
              <Paper sx={{ p: 2 }} elevation={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>Menu Items</Typography>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="group-select-label">Group</InputLabel>
                  <Select labelId="group-select-label" value={selectedGroup} label="Group" onChange={(e) => setSelectedGroup(String(e.target.value))}>
                    {Object.keys(menuGroups).map(g => (<MuiMenuItem key={g} value={g}>{g}</MuiMenuItem>))}
                  </Select>
                </FormControl>
              </Box>
              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {menuItems?.filter((it: MenuItem) => {
                    if (selectedGroup === 'All') return true;
                    const allowed = menuGroups[selectedGroup] || [];
                    if (it.menuGroup && String(it.menuGroup).toLowerCase() === selectedGroup.toLowerCase()) return true;
                    return allowed.some(c => String(it.category || '').toLowerCase().includes(String(c || '').toLowerCase()));
                  }).map((item: MenuItem) => (
                    <Box key={item._id}>
                      <Card elevation={2}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main' }}>
                              <LocalDiningIcon />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{item.category} • ₹{Number(item.price || 0).toFixed(0)}</Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                <Chip size="small" label={item.isAvailable ? 'Available' : 'Unavailable'} color={item.isAvailable ? 'primary' : 'default'} />
                              </Stack>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button size="small" onClick={() => openEditDialog(item)} startIcon={<MenuBookIcon />}>Edit</Button>
                          <Button size="small" onClick={() => handleConfirmDelete(item._id)} startIcon={<DeleteIcon />}>Delete</Button>
                        </CardActions>
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
            </Paper>
          </Box>
        </Box>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Dialog open={deleteDialog.open} onClose={() => handleDeleteDialogClose(false)}>
          <DialogTitle>Delete Menu Item</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this menu item? This action cannot be undone.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDeleteDialogClose(false)}>Cancel</Button>
            <Button color="error" onClick={() => handleDeleteDialogClose(true)}>Delete</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={editDialogOpen} onClose={closeEditDialog} fullWidth maxWidth="sm">
          <DialogTitle>Edit Menu Item</DialogTitle>
          <DialogContent>
            {editItem && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                <TextField label="Name" value={editItem.name || ''} onChange={(e) => setEditItem(s => s ? ({ ...s, name: e.target.value }) : s)} fullWidth />
                <TextField label="Price (₹)" type="number" value={Number(editItem.price || 0)} onChange={(e) => setEditItem(s => s ? ({ ...s, price: Number(e.target.value) }) : s)} fullWidth />
                <FormControl fullWidth>
                  <InputLabel id="edit-menu-group-label">Menu</InputLabel>
                  <Select labelId="edit-menu-group-label" value={editItem.menuGroup || ''} label="Menu" onChange={(e) => setEditItem(s => s ? ({ ...s, menuGroup: String(e.target.value) as MenuItem['menuGroup'] }) : s)}>
                    {menuGroupOptions.map(group => (<MuiMenuItem key={group} value={group}>{group}</MuiMenuItem>))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="edit-category-label">Category</InputLabel>
                  <Select labelId="edit-category-label" value={editItem.category || ''} label="Category" onChange={(e) => setEditItem(s => s ? ({ ...s, category: String(e.target.value) as any }) : s)}>
                    {menuCategories.map(c => (<MuiMenuItem key={c} value={c}>{c}</MuiMenuItem>))}
                  </Select>
                </FormControl>
                <FormControlLabel control={<Switch checked={!!editItem.isAvailable} onChange={(e) => setEditItem(s => s ? ({ ...s, isAvailable: e.target.checked }) : s)} />} label="Available" />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button variant="contained" onClick={submitEdit}>Save</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
};

export default AdminMenuPage;
