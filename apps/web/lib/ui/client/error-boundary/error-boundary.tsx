'use client'

import React, { ReactNode } from 'react'

import { Logger } from '@lib/logging'

export interface ErrorBoundaryProps {
  client: Logger
  fallback: ReactNode
  children: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.client.log(error.message, {
      stack: info.componentStack
    })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}
