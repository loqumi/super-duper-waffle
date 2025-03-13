import { useState, useEffect } from 'react'
import { Container, Box, Typography, Button } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useAppDispatch } from './app/hooks'
import { fetchAllTickers } from './features/marketDataSlice'
import PortfolioTable from './components/PortfolioTable'
import AddAssetDialog from './components/AddAssetDialog'
import WebSocketManager from './components/WebSocketManager'
import TotalValueCard from './components/TotalValueCard'

const theme = createTheme()

function App() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchAllTickers())
    }, [dispatch])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <WebSocketManager />

                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    <Typography variant="h4" component="h1">
                        Портфель
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => setDialogOpen(true)}
                        sx={{ textTransform: 'none' }}
                    >
                        Добавить
                    </Button>
                </Box>

                <TotalValueCard />

                <PortfolioTable />

                <AddAssetDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                />
            </Container>
        </ThemeProvider>
    )
}

export default App