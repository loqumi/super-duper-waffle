import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Asset {
    id: string
    symbol: string
    quantity: number
}

const loadFromLocalStorage = (): Asset[] => {
    const saved = localStorage.getItem('assets')
    return saved ? JSON.parse(saved) : []
}

const mergeAssets = (assets: Asset[]): Asset[] => {
    const merged = assets.reduce((acc: Record<string, Asset>, asset) => {
        if (acc[asset.symbol]) {
            acc[asset.symbol].quantity += asset.quantity
        } else {
            acc[asset.symbol] = { ...asset, id: uuidv4() }
        }
        return acc
    }, {})

    return Object.values(merged)
}

const assetsSlice = createSlice({
    name: 'assets',
    initialState: mergeAssets(loadFromLocalStorage()),
    reducers: {
        addAsset: {
            reducer: (state, action: PayloadAction<Asset>) => {
                const newAssets = mergeAssets([...state, action.payload])
                localStorage.setItem('assets', JSON.stringify(newAssets))
                return newAssets
            },
            prepare: (symbol: string, quantity: number) => ({
                payload: {
                    id: uuidv4(),
                    symbol: symbol.toUpperCase(),
                    quantity
                }
            })
        },
        removeAsset: (state, action: PayloadAction<string>) => {
            const newState = state.filter(asset => asset.symbol !== action.payload)
            localStorage.setItem('assets', JSON.stringify(newState))
            return newState
        }
    }
})

export const { addAsset, removeAsset } = assetsSlice.actions
export default assetsSlice.reducer