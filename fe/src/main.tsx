import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import App from './App.tsx'
import "react-toastify/dist/ReactToastify.css";
import 'nprogress/nprogress.css';
import "./styles/main.scss"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
      {/* <PersistGate loading={null} persistor={persistor}> */}
          <CssBaseline />
          <App />
          {/* <ToastContainer autoClose={2500} /> */}
      {/* </PersistGate > */}
    {/* </Provider> */}
  </StrictMode>
)
