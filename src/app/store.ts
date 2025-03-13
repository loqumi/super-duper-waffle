import { configureStore } from '@reduxjs/toolkit'
import assetsReducer from '../features/assetsSlice'
import marketDataReducer from '../features/marketDataSlice'

export const store = configureStore({
    reducer: {
        assets: assetsReducer,
        marketData: marketDataReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch