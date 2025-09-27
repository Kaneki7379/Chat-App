import React from 'react';                      // 1
import { createRoot } from 'react-dom/client'; // 2
import App from './App';      
import './index.css';   // <-- this line loads Tailwind                 // 3

createRoot(document.getElementById('root')).render(<App />); // 4
