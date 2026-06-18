import { useConversation } from '@elevenlabs/react';
import { useCallback, useState } from 'react';
import './App.css';

export default function App() {
  const [permissionError, setPermissionError] = useState(null);

  const conversation = useConversation({
    onConnect: () => console.log('Connected'),
    onDisconnect: () => console.log('Disconnected'),
    onMessage: (message) => console.log('Message:', message),
    onError: (error) => console.error('Error:', error),
  });

  const startConversation = useCallback(async () => {
    setPermissionError(null);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      setPermissionError('Microphone access denied. Please allow microphone access and try again.');
      return;
    }

    try {
      await conversation.startSession({
        agentId: 'agent_7201kts7q93rfeeb2rtcgn80dtae',
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('Failed to start conversation:', err);
    }
  }, [conversation]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
  }, [conversation]);

  const isConnected = conversation.status === 'connected';
  const isConnecting = conversation.status === 'connecting';
  const isSpeaking = conversation.isSpeaking;

  return (
    <div className="app">
      <div className="card">
        <div className="agent-header">
          <div className={`avatar ${isConnected ? (isSpeaking ? 'speaking' : 'listening') : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h1 className="agent-name">Cyrano</h1>
          <p className="agent-subtitle">Agent Vocal Nexya</p>
        </div>

        <div className="status-section">
          <div className={`status-badge ${conversation.status}`}>
            <span className="status-dot" />
            <span className="status-text">
              {isConnecting ? 'Connecting...' : isConnected ? (isSpeaking ? 'Speaking' : 'Listening') : 'Disconnected'}
            </span>
          </div>
        </div>

        {isConnected && (
          <div className="wave-container">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`wave-bar ${isSpeaking ? 'active' : 'idle'}`} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}

        {permissionError && (
          <div className="error-message">{permissionError}</div>
        )}

        <button
          className={`main-button ${isConnected ? 'stop' : ''} ${isConnecting ? 'connecting' : ''}`}
          onClick={isConnected || isConnecting ? stopConversation : startConversation}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <span className="button-content">
              <span className="spinner" />
              Connecting...
            </span>
          ) : isConnected ? (
            <span className="button-content">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              End Conversation
            </span>
          ) : (
            <span className="button-content">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
              </svg>
              Start Conversation
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
