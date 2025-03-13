import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { updatePrice } from '../features/marketDataSlice'

const WebSocketManager = () => {
    const dispatch = useAppDispatch()
    const assets = useAppSelector((state) => state.assets)

    useEffect(() => {
        if (assets.length === 0) return

        const streams = assets
            .map((asset) => `${asset.symbol.toLowerCase()}usdt@ticker`)
            .join('/')

        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data).data
            const symbol = data.s.replace('USDT', '')
            dispatch(updatePrice({
                symbol,
                price: parseFloat(data.c),
                change24h: parseFloat(data.P)
            }))
        }

        return () => ws.close()
    }, [assets, dispatch])

    return null
}

export default WebSocketManager