import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="477331921067-a7uassgqlj8dno64cppiecvd26e5hcev.apps.googleusercontent.com">
    <PayPalScriptProvider options={{ "client-id": "AZTdUdowPlobQNlFRiHd2zdc2UsxBT3mgTTLRg57466RN6ARCXDHPjttC9Qf0gC3wApLGXzT1zspW1qA", currency: "USD" }}>
    <App />
    </PayPalScriptProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
