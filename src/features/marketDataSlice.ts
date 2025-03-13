import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface Ticker {
    symbol: string
    lastPrice: number
    priceChangePercent: number
}

interface MarketDataState {
    allTickers: Ticker[]
    prices: Record<string, { price: number; change24h: number }>
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: MarketDataState = {
    allTickers: [],
    prices: {},
    status: 'idle'
}

export const fetchAllTickers = createAsyncThunk(
    'marketData/fetchAllTickers',
    async () => {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/24hr')
        return response.data
            .filter((t: any) => t.symbol.endsWith('USDT'))
            .map((t: any) => ({
                symbol: t.symbol.replace('USDT', ''),
                lastPrice: parseFloat(t.lastPrice),
                priceChangePercent: parseFloat(t.priceChangePercent)
            }))
    }
)

const marketDataSlice = createSlice({
    name: 'marketData',
    initialState,
    reducers: {
        updatePrice: (state, action: PayloadAction<Record<string, { price: number; change24h: number }>>) => {
            Object.entries(action.payload).forEach(([symbol, values]) => {
                state.prices[symbol] = values
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllTickers.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchAllTickers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.allTickers = action.payload
            })
    }
})

export const { updatePrice } = marketDataSlice.actions
export default marketDataSlice.reducer