import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';

const inter = Inter({ subsets: ['latin'] });

const Chat = () => {
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState([]);
  const [currentThread, setCurrentThread] = useState(null);

  // Fetch all threads on component mount
  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      // API call to get all threads using GET method
      const response = await fetch('https://retune.so/api/chat/11eec5dd-f304-1780-9354-8d479669480a/threads', {
        method: 'GET', // Use GET method for fetching threads
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-API-Key': '11eec5db-1f37-bbc0-95c3-e327b38b0ace',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setThreads(data.threads);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  const startNewThread = async () => {
    try {
      // API call to create a new thread
      const response = await fetch('https://retune.so/api/chat/11eec5dd-f304-1780-9354-8d479669480a/new-thread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-API-Key': '11eec5db-1f37-bbc0-95c3-e327b38b0ace',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setCurrentThread(data.threadId);
      fetchThreads(); // Refresh thread list
    } catch (error) {
      console.error('Start New Thread error:', error);
    }
  };
  
  const sendMessage = async () => {
    try {
      // API call to continue the conversation in a thread
      const response = await fetch('https://retune.so/api/chat/11eec5dd-f304-1780-9354-8d479669480a/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-API-Key': '11eec5db-1f37-bbc0-95c3-e327b38b0ace',
        },
        body: JSON.stringify({
          threadId: currentThread,
          input,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      setInput('');
    } catch (error) {
      console.error('Send Message error:', error);
    }
  };
  
  const [messages, setMessages] = useState([]);

  // ... (existing functions)

  const fetchMessages = async () => {
    try {
      // API call to get all messages in the current thread
      const response = await fetch(`https://retune.so/api/chat/11eec5dd-f304-1780-9354-8d479669480a/messages?threadId=${currentThread}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-API-Key': '11eec5db-1f37-bbc0-95c3-e327b38b0ace',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Fetch Messages error:', error);
    }
  };

  const selectThread = (threadId) => {
    setCurrentThread(threadId);
  };

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Chat App using Next.js" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div>
          {threads.map((thread) => (
            <div key={thread.threadId} onClick={() => selectThread(thread.threadId)}>
              {thread.threadId}
            </div>
          ))}
          <button onClick={startNewThread}>Start New Thread</button>
        </div>
        <div>
        {currentThread && (
        <>
          <div>
            {messages.map((message) => (
              <div key={message.messageId}>{message.text}</div>
            ))}
          </div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
        </div>
      </main>
    </>
  );
};

export default Chat;
