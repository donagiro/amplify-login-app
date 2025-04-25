import { useState, useRef, useEffect } from 'react';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: [{ type: 'text', text: 'Hello! How can I help you today?' }] 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const client = new BedrockRuntimeClient({ region: 'us-east-1' });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: [{ type: 'text', text: input }] 
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const formattedMessages = messages.map(m => ({
        role: m.role,
        content: Array.isArray(m.content) 
          ? m.content 
          : [{ type: 'text', text: m.content }]
      })).concat([{
        role: 'user',
        content: [{ type: 'text', text: input }]
      }]);

      const response = await client.send(new InvokeModelCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          system: "You are a helpful AI assistant. Be concise and friendly in your responses.",
          messages: formattedMessages,
          max_tokens: 1000,
          temperature: 0.5,
        }),
      }));

      const result = JSON.parse(new TextDecoder().decode(response.body));
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: result.content 
      }]);
    } catch (error) {
      console.error('Error calling Bedrock:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: [{ type: 'text', text: 'Sorry, I encountered an error. Please try again.' }] 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 150px)',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e1e1e1',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: message.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{
              padding: '10px 15px',
              borderRadius: message.role === 'user' 
                ? '18px 18px 0 18px' 
                : '18px 18px 18px 0',
              backgroundColor: message.role === 'user' ? '#007bff' : '#e9ecef',
              color: message.role === 'user' ? 'white' : 'black',
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {Array.isArray(message.content)
                ? message.content[0]?.text || '...'
                : message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            padding: '10px 15px',
            borderRadius: '18px 18px 18px 0',
            backgroundColor: '#e9ecef',
            maxWidth: '80%',
            alignSelf: 'flex-start'
          }}>
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        padding: '10px',
        borderTop: '1px solid #e1e1e1',
        backgroundColor: 'white'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            outline: 'none',
            marginRight: '10px'
          }}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;