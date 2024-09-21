// Import React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot instead of ReactDOM
import App from './App'; // Import your main App component
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store'; // Import your store configuration
import { PersistGate } from 'redux-persist/integration/react';
import { Analytics } from "@vercel/analytics/react"

// Get the root element from your HTML file (usually with an ID of 'root')
const container = document.getElementById('root');

// Create a root using createRoot
const root = createRoot(container);

// Render the application using the new root
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <Analytics />
    </PersistGate>
  </Provider>
);
