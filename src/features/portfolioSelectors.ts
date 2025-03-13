import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../app/store'
import { Asset } from './assetsSlice'

export const selectPortfolioSummary = createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.marketData.prices,
    (assets, prices) => {
        const totalValue = assets.reduce((acc: number, asset: Asset) => {
            const price = prices[asset.symbol]?.price || 0
            return acc + (asset.quantity * price)
        }, 0)

        return assets.map((asset: Asset) => {
            const price = prices[asset.symbol]?.price || 0
            const change24h = prices[asset.symbol]?.change24h || 0
            const value = asset.quantity * price
            const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0

            return {
                ...asset,
                currentPrice: price,
                value,
                change24h,
                allocation
            }
        })
    }
)