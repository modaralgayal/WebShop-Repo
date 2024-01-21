import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { MantineProvider } from '@mantine/core'

ReactDOM.render(
  <MantineProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </MantineProvider>,
  document.getElementById('root'),
)
