import { Box } from '@mui/material';

const dashboardUrl = import.meta.env.VITE_ADMIN_ANALYSIS_URL || 'http://127.0.0.1:3001';

export default function AdminAnalysisPage() {
  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 80px)' }}>
      <Box
        component="iframe"
        title="SV Data Viewer"
        src={dashboardUrl}
        sx={{
          display: 'block',
          width: '100%',
          height: 'calc(100vh - 80px)',
          minHeight: 720,
          border: 0,
        }}
      />
    </Box>
  );
}
