import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('=== APP CRASH ===', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          fontFamily: 'monospace', padding: '2rem', background: '#111',
          color: '#f87171', minHeight: '100vh', whiteSpace: 'pre-wrap'
        }}>
          <h2 style={{ color: '#fbbf24', marginBottom: '1rem' }}>🔴 Runtime Error — check console for full stack</h2>
          <p>{this.state.error?.message}</p>
          <p style={{ color: '#6b7280', marginTop: '1rem', fontSize: '0.85rem' }}>
            {this.state.error?.stack}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
