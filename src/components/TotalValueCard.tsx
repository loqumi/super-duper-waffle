import { useAppSelector } from '../app/hooks'
import { selectPortfolioSummary } from '../features/portfolioSelectors'
import { Card, Typography, Box } from '@mui/material'

const TotalValueCard = () => {
    const portfolio = useAppSelector(selectPortfolioSummary)
    const totalValue = portfolio.reduce((acc, asset) => acc + asset.value, 0)

    return (
        <Card sx={{ mb: 3, p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h6">Общая стоимость портфеля:</Typography>
                <Typography variant="h6" fontWeight="bold">
                    ${totalValue.toFixed(2)}
                </Typography>
            </Box>
        </Card>
    )
}

export default TotalValueCard