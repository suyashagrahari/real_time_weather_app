import React from 'react'
import Weather from './Weather'
import ErrorBoundary from './ErrorBoundary';
const App = () => {
  return (
    <>
    <ErrorBoundary>
    <Weather/>
    </ErrorBoundary>
      
    </>
  )
}

export default App