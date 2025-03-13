import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addAsset } from '../features/assetsSlice'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    List,
    ListItemButton,
    ListItemText,
    DialogActions,
    Button,
    Typography
} from '@mui/material'

const AddAssetDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const dispatch = useAppDispatch()
    const { allTickers } = useAppSelector((state) => state.marketData)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
    const [quantity, setQuantity] = useState('')

    const handleClose = () => {
        if (selectedTicker) {
            setSelectedTicker(null)
            setQuantity('')
        } else {
            onClose()
        }
    }

    const handleAddAsset = () => {
        if (!selectedTicker || !quantity) return

        // Правильный вызов action с двумя аргументами
        dispatch(addAsset(selectedTicker, parseFloat(quantity)))
        onClose()
        setSelectedTicker(null)
        setQuantity('')
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            slotProps={{ backdrop: { transitionDuration: 300 } }} // Исправление deprecated атрибута
        >
            <DialogTitle>
                {selectedTicker ? `Добавить ${selectedTicker}` : 'Выберите актив'}
            </DialogTitle>

            <DialogContent>
                {!selectedTicker ? (
                    <>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Поиск валют"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {allTickers
                                .filter(ticker =>
                                    ticker.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((ticker) => (
                                    <ListItemButton
                                        key={ticker.symbol}
                                        onClick={() => setSelectedTicker(ticker.symbol)}
                                        aria-label={`Выбрать ${ticker.symbol}`}
                                    >
                                        <ListItemText
                                            primary={ticker.symbol}
                                            secondary={`$${ticker.lastPrice.toFixed(2)}`}
                                        />
                                        <Typography
                                            color={ticker.priceChangePercent >= 0 ? 'success.main' : 'error.main'}
                                        >
                                            {ticker.priceChangePercent.toFixed(2)}%
                                        </Typography>
                                    </ListItemButton>
                                ))}
                        </List>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            {selectedTicker}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Количество"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            sx={{ mb: 3 }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} aria-label={selectedTicker ? 'Назад' : 'Отмена'}>
                    {selectedTicker ? 'Назад' : 'Отмена'}
                </Button>
                {selectedTicker && (
                    <Button
                        variant="contained"
                        onClick={handleAddAsset}
                        disabled={!quantity || parseFloat(quantity) <= 0}
                        aria-label="Добавить актив"
                    >
                        Добавить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default AddAssetDialog