import React, { useState, useEffect, createContext, PropsWithChildren } from 'react'
import { API_ENDPOINT } from '@/constants/common'
import socketIOClient, { Socket } from 'socket.io-client'

export interface ServerToClientEvents {
  message: (message: string) => void
}

export interface ClientToServerEvents {
  message: (message: string) => void
}

export type SocketType = Socket<ServerToClientEvents, ClientToServerEvents>

export type SocketStateContextType = {
  socket: SocketType
}

export const SocketStateContext = createContext<SocketStateContextType>({
  socket: null,
})

const SocketProvider = ({ children }: PropsWithChildren<unknown>) => {
  const [socket, setSocket] = useState<SocketType>()

  useEffect(() => {
    const socket = socketIOClient(API_ENDPOINT, {
      transports: ['websocket'],
      reconnection: false,
      closeOnBeforeunload: false,
    })
    setSocket(socket)

    return () => {
      socket.disconnect()
    }
  }, [])

  if (!socket) return null

  return <SocketStateContext.Provider value={{ socket }}>{children}</SocketStateContext.Provider>
}

export default SocketProvider
