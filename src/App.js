import { withAuthenticator } from '@aws-amplify/ui-react';

function App({ signOut, user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome to My App, {user.username}!</h1>
      <button 
        onClick={signOut}
        style={{
          padding: '8px 16px',
          background: '#ff9900',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default withAuthenticator(App);