import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LandingPage from "./layouts/landingpage.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LandingPage></LandingPage>
  </StrictMode>,
)