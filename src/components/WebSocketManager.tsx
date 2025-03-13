import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { updatePrice } from '../features/marketDataSlice'

const WebSocketManager = () => {
    const dispatch = useAppDispatch()
    const assets = useAppSelector((state) => state.assets)
    const latestPrices = useRef<Record<string, { price: number; change24h: number }>>({})
    const updateInterval = useRef<number | undefined>(undefined)

    useEffect(() => {
        if (assets.length === 0) return

        const streams = assets
            .map((asset) => `${asset.symbol.toLowerCase()}usdt@ticker`)
            .join('/')

        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

        const processUpdates = () => {
            if (Object.keys(latestPrices.current).length > 0) {
                dispatch(updatePrice(latestPrices.current))
                latestPrices.current = {}
            }
        }

        const initialUpdate = () => {
            processUpdates()
            updateInterval.current = window.setInterval(processUpdates, 10000)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data).data
            const symbol = data.s.replace('USDT', '')

            latestPrices.current[symbol] = {
                price: parseFloat(data.c),
                change24h: parseFloat(data.P)
            }
        }

        const immediateUpdate = window.setTimeout(initialUpdate, 500)

        return () => {
            ws.close()
            window.clearTimeout(immediateUpdate)
            if (updateInterval.current !== undefined) {
                window.clearInterval(updateInterval.current)
            }
            latestPrices.current = {}
        }
    }, [assets, dispatch])

    return null
}

export default WebSocketManager