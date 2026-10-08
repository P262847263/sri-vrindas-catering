
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Avatar, Divider, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { userApi } from '../services/api';
import { getLocalFavoritesKey } from '../utils/localFavoritesKey';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
  const res = await userApi.getFavorites();
  if (!mounted) return;
  const serverItems = (res.data as any[]) || [];
  // also include any client-side local favorites (saved by menu pages as ids)
  const localRaw = JSON.parse(localStorage.getItem(getLocalFavoritesKey()) || '[]');
  const localItems: any[] = Array.isArray(localRaw) ? localRaw.map((entry: any) => {
    // if the local entry is already an object, use it
    if (entry && typeof entry === 'object') return entry;
    // otherwise it's an id string like "<category>-<item>" produced by menu pages
    const id = String(entry || '');
    const sep = id.indexOf('-');
    const category = sep > -1 ? id.substring(0, sep) : '';
    const name = sep > -1 ? id.substring(sep + 1) : id;
    return { _id: id, name: name, category: category, image: '' };
  }) : [];

  // merge, dedupe by _id
  const mergedMap = new Map<string, any>();
  for (const it of serverItems) if (it && (it._id || it.id)) mergedMap.set(it._id || it.id, it);
  for (const it of localItems) if (it && (it._id || it.id)) {
    const key = it._id || it.id;
    if (!mergedMap.has(key)) mergedMap.set(key, it);
  }
  setItems(Array.from(mergedMap.values()));
      } catch (e) {
        if (!mounted) return;
        // if fetching server favorites fails (not logged in), still try local favorites
        const localRaw2 = JSON.parse(localStorage.getItem(getLocalFavoritesKey()) || '[]');
        const localItems2: any[] = Array.isArray(localRaw2) ? localRaw2.map((entry: any) => {
          if (entry && typeof entry === 'object') return entry;
          const id = String(entry || '');
          const sep = id.indexOf('-');
          const category = sep > -1 ? id.substring(0, sep) : '';
          const name = sep > -1 ? id.substring(sep + 1) : id;
          return { _id: id, name: name, category: category, image: '' };
        }) : [];
        setItems(localItems2);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ bgcolor: '#fbf7ef', minHeight: '100vh', width: '100%', py: 4 }}>
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: 0, px: 2 }}>
        <Typography variant="h4" mb={2} fontWeight={700}>My Wishlist</Typography>
        <Paper sx={{ p: 2, bgcolor: (theme) => theme.palette.background.paper }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', p: 4 }}><CircularProgress /></Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6">No items in your wishlist</Typography>
            <Typography color="text.secondary">Tap the heart on menu items to save them here.</Typography>
          </Box>
        ) : (
          <List>
            {items.map((it) => (
              <React.Fragment key={it._id || it.id || it.name}>
                <ListItem secondaryAction={
                  <IconButton edge="end" aria-label="remove" onClick={async () => {
                    try {
                      const id = it._id || it.id || it.name;
                      // if looks like an ObjectId call API, otherwise remove local
                      if (/^[0-9a-fA-F]{24}$/.test(id)) {
                        await userApi.removeFavorite(id);
                      } else {
                        const local = JSON.parse(localStorage.getItem(getLocalFavoritesKey()) || '[]');
                        const next = (local || []).filter((x: string) => x !== id);
                        localStorage.setItem(getLocalFavoritesKey(), JSON.stringify(next));
                      }
                      // remove from UI
                      setItems((s) => s.filter(x => (x._id || x.id || x.name) !== id));
                      // notify navigation to refresh count
                      try { window.dispatchEvent(new CustomEvent('favoritesChanged')); } catch(e) { /* ignore */ }
                    } catch (e) { /* ignore */ }
                  }}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <Avatar src={it.image || ''} sx={{ mr: 2 }}>
                    <FavoriteIcon />
                  </Avatar>
                  <ListItemText primary={it.name || it.title || 'Untitled'} secondary={it.category || ''} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
        </Paper>
      </Box>
    </Box>
  );
}
