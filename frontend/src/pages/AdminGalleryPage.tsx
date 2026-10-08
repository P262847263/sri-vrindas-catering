import { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, List, ListItem, ListItemText, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { galleryApi } from '../services/api';

export default function AdminGalleryPage() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery<any[], Error>({
    queryKey: ['gallery', 'admin'],
    queryFn: async (): Promise<any[]> => {
      const res = await galleryApi.getAll();
      return res.data as any[];
    },
  });

  const [form, setForm] = useState({ caption: '' });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const addMutation = useMutation<any, Error, { url: string; caption?: string }>(
    {
      mutationFn: async (payload: { url: string; caption?: string }) => {
        const res = await galleryApi.add(payload);
        return res.data;
      },
      onSuccess: () => {
        // refresh both admin and public gallery queries so main gallery reflects the change
        queryClient.invalidateQueries({ queryKey: ['gallery', 'admin'] });
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
        setSnack({ open: true, message: 'Added', severity: 'success' });
        setForm({ caption: '' });
      },
      onError: (e: any) => setSnack({ open: true, message: e?.response?.data?.error || e.message || 'Failed', severity: 'error' }),
    }
  );

  const delMutation = useMutation<any, Error, string>(
    {
      mutationFn: async (id: string) => {
        const res = await galleryApi.delete(id);
        return res.data;
      },
      onSuccess: () => {
        // refresh both admin and public gallery views
        queryClient.invalidateQueries({ queryKey: ['gallery', 'admin'] });
        queryClient.invalidateQueries({ queryKey: ['gallery'] });
        setSnack({ open: true, message: 'Deleted', severity: 'success' });
      },
      onError: (e: any) => setSnack({ open: true, message: e?.response?.data?.error || e.message || 'Failed', severity: 'error' }),
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreview(url);
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  const handleUploadAndAdd = async () => {
    try {
      if (!file) return setSnack({ open: true, message: 'Please select a file', severity: 'error' });
      // optimistic preview: insert a temporary item into the public gallery cache
      const tempId = `temp-${Date.now()}`;
      const tempItem = { _id: tempId, url: preview, caption: form.caption };
      queryClient.setQueryData(['gallery'], (prev: any[] | undefined) => [tempItem, ...(prev || [])]);
      const fd = new FormData();
      fd.append('image', file);
      const res = await galleryApi.upload(fd);
      const url = (res as any).data?.url;
      if (!url) throw new Error('Upload did not return url');
      // create gallery record
      addMutation.mutate({ url, caption: form.caption });
      // clear file and preview
      setFile(null);
      if (preview) { URL.revokeObjectURL(preview); }
      setPreview(null);
    } catch (err: any) {
      // remove temp optimistic item if present
      queryClient.setQueryData(['gallery'], (prev: any[] | undefined) => (prev || []).filter(i => !String(i._id || '').startsWith('temp-')));
      setSnack({ open: true, message: err?.response?.data?.error || err.message || 'Upload failed', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Admin Gallery Management</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <input id="gallery-file" type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 8 }} />}
          <TextField label="Caption" value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleUploadAndAdd} disabled={!file}>Upload & Add</Button>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">Gallery Images</Typography>
        <List>
          {isLoading ? <ListItem><ListItemText primary="Loading..." /></ListItem> : items.map((it: any) => (
            <ListItem key={it._id} secondaryAction={
              <IconButton edge="end" onClick={() => delMutation.mutate(it._id)}><DeleteIcon /></IconButton>
            }>
              <ListItemText primary={it.url} secondary={it.caption} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
}
