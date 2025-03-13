import { useState, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { addAsset } from '../features/assetsSlice'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    ListItemButton,
    ListItemText,
    DialogActions,
    Button,
    Typography
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { FixedSizeList } from 'react-window'

const AddAssetDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const dispatch = useAppDispatch()
    const { allTickers } = useAppSelector((state) => state.marketData)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedTicker, setSelectedTicker] = useState<string | null>(null)
    const [quantity, setQuantity] = useState('')

    const filteredTickers = useMemo(() =>
            allTickers.filter(t => t.symbol.toLowerCase().includes(searchTerm.toLowerCase())),
        [allTickers, searchTerm]
    )

    const handleAddAsset = () => {
        if (!selectedTicker || !quantity) return

        dispatch(addAsset(selectedTicker, parseFloat(quantity)))
        onClose()
        setSelectedTicker(null)
        setQuantity('')
    }

    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const ticker = filteredTickers[index]
        return (
            <ListItemButton
                style={style}
                key={ticker.symbol}
                onClick={() => setSelectedTicker(ticker.symbol)}
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
        )
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.disabled' }} />
                            }}
                            sx={{ mb: 2 }}
                        />

                        <FixedSizeList
                            height={400}
                            width="100%"
                            itemSize={60}
                            itemCount={filteredTickers.length}
                            overscanCount={10}
                        >
                            {Row}
                        </FixedSizeList>
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
                            InputProps={{ inputProps: { min: 0, step: 1 } }}
                            sx={{ mb: 3 }}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={() => selectedTicker ? setSelectedTicker(null) : onClose()}>
                    {selectedTicker ? 'Назад' : 'Отмена'}
                </Button>
                {selectedTicker && (
                    <Button
                        variant="contained"
                        onClick={handleAddAsset}
                        disabled={!quantity || parseFloat(quantity) <= 0}
                    >
                        Добавить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default AddAssetDialog