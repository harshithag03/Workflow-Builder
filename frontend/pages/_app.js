import { useEffect } from 'react';
import '../styles/fix.css';
function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Block purple elements on page load
    const style = document.createElement('style');
    style.textContent = `
      body::before, body::after { display: none !important; }
      [style*="purple"] { display: none !important; }
    `;
    document.head.appendChild(style);
    
    // Apply styles to body directly
    document.body.style.backgroundColor = '#f0f4f8';
    
    // Add wrapper div for structure if needed
    const content = document.getElementById('__next');
    if (content) {
      content.classList.add('page-container');
    }
  }, []);
  
  return <Component {...pageProps} />;
}

export default MyApp;