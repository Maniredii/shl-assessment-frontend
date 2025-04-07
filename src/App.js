import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  Chip,
  Divider,
  useTheme,
  alpha,
  LinearProgress,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { axiosInstance } from './api';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [selectedTest, setSelectedTest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const theme = useTheme();

  const showMessage = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendations([]);

    try {
      const response = await axiosInstance.post('/api/recommend', {
        query,
        url
      });

      if (response.data.recommendations) {
        setRecommendations(response.data.recommendations);
        if (response.data.message) {
          showMessage(response.data.message);
        }
      } else {
        showMessage('No recommendations found', 'warning');
      }
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.error || 
                        'An error occurred while fetching recommendations. Please try again.';
      setError(errorMessage);
      showMessage(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (test) => {
    setSelectedTest(test);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box 
      className="app-container"
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Card 
          elevation={3}
          sx={{
            mb: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.9)'
          }}
        >
          <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ color: '#4A4A9E' }}>
            SHL Test Recommender
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Find the perfect assessment for your needs using natural language or job descriptions
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <TextField
              fullWidth
              label="Enter your query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
              }}
            />
            
            <Typography align="center" color="textSecondary" sx={{ my: 2 }}>
              - OR -
            </Typography>
            
            <TextField
              fullWidth
              label="Enter a job description URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading || (!query && !url)}
            >
              {loading ? 'Getting Recommendations...' : 'Get Recommendations'}
            </Button>
          </Box>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {recommendations.map((test) => (
          <Card key={test.name} sx={{ mb: 2, background: 'rgba(255, 255, 255, 0.9)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  {test.name}
                </Typography>
                <Box>
                  <IconButton
                    onClick={() => handleOpenDialog(test)}
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    <InfoIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => window.open(test.url, '_blank')}
                    color="primary"
                    size="small"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography color="textSecondary" paragraph>
                {test.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={test.remote_testing ? "Remote Testing Available" : "In-Person Only"}
                  color={test.remote_testing ? "success" : "default"}
                  size="small"
                />
                <Chip
                  label={test.adaptive_irt ? "Adaptive Testing" : "Fixed Format"}
                  color={test.adaptive_irt ? "primary" : "default"}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          {selectedTest && (
            <>
              <DialogTitle>
                {selectedTest.name}
              </DialogTitle>
              <DialogContent>
                <Typography paragraph>
                  {selectedTest.description}
                </Typography>
                
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Features:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={selectedTest.remote_testing ? "Remote Testing Available" : "In-Person Only"}
                    color={selectedTest.remote_testing ? "success" : "default"}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={selectedTest.adaptive_irt ? "Adaptive Testing" : "Fixed Format"}
                    color={selectedTest.adaptive_irt ? "primary" : "default"}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>
                
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Keywords:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedTest.keywords.map((keyword) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button
                  onClick={() => window.open(selectedTest.url, '_blank')}
                  variant="contained"
                  color="primary"
                  endIcon={<OpenInNewIcon />}
                >
                  View in Catalog
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default App; 