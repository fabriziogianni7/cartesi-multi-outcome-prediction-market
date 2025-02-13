// src/app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { type ReactNode } from 'react'
import { cookieToInitialState } from 'wagmi'

import { getConfig } from '../wagmi'
import { Layout } from "../components/baseLayout"

export const metadata: Metadata = {
  title: 'Cartesi Polymarket',
  description: 'A Multi-Outcome Prediction Market',
}

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie'),
  )

  return (
    <html lang="en">
      <body className="h-screen w-screen m-0 p-0">
        <Layout>
          {props.children}
        </Layout>
      </body>
    </html>
  )
}