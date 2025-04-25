import { withAuthenticator } from '@aws-amplify/ui-react';
import ChatBot from './ChatBot';

function App({ signOut, user }) {
  return (
    <div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1>Welcome, {user.username}!</h1>
        <button 
          onClick={signOut}
          style={{
            padding: '8px 16px',
            background: '#ff9900',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>
      
      <ChatBot />
    </div>
  );
}

export default withAuthenticator(App);