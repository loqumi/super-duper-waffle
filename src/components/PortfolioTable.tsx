import { useAppSelector } from '../app/hooks'
import { selectPortfolioSummary } from '../features/portfolioSelectors'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    useMediaQuery,
    IconButton
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTheme } from '@mui/material/styles'
import { motion } from 'framer-motion'
import { useAppDispatch } from '../app/hooks'
import { removeAsset } from '../features/assetsSlice'

const PortfolioTable = () => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const portfolio = useAppSelector(selectPortfolioSummary)
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    return (
        <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table aria-label="Portfolio table" size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                    <TableRow sx={{ bgcolor: 'background.default' }}>
                        <TableCell>Актив</TableCell>
                        <TableCell align="right">Количество</TableCell>
                        <TableCell align="right">Цена</TableCell>
                        <TableCell align="right">Общая цена</TableCell>
                        <TableCell align="right">Изменение 24ч</TableCell>
                        <TableCell align="right">% портфеля</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {portfolio.map((asset) => (
                        <motion.tr
                            key={asset.symbol}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <TableCell component="th" scope="row">
                                <Typography fontWeight="bold">{asset.symbol}</Typography>
                            </TableCell>
                            <TableCell align="right">{asset.quantity.toFixed(4)}</TableCell>
                            <TableCell align="right">${asset.currentPrice.toFixed(2)}</TableCell>
                            <TableCell align="right">${asset.value.toFixed(2)}</TableCell>
                            <TableCell align="right">
                                <Typography
                                    color={asset.change24h >= 0 ? 'success.main' : 'error.main'}
                                >
                                    {asset.change24h.toFixed(2)}%
                                </Typography>
                            </TableCell>
                            <TableCell align="right">{asset.allocation.toFixed(1)}%</TableCell>
                            <TableCell align="right">
                                <IconButton
                                    onClick={() => dispatch(removeAsset(asset.symbol))}
                                    aria-label="Удалить"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </motion.tr>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default PortfolioTable