import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AccuracyCalculator from './calculator.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AccuracyCalculator />
  </StrictMode>,
)
