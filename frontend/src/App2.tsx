import { useState } from 'react';
import './App.css';

function App() {
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [error, setError] = useState('');
  const sendRequest = async (status: string, payload?: unknown) => {
    await fetch('http://localhost:3000/lights', {
      method: 'POST',
      body: JSON.stringify({
        type: status,
        payload,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((res) => {
        const currentState = res.currentState;
        const changed = res.changed;
        const message = res.message;
        console.log(message);
        if (changed) {
          const status = currentState === 'idle' ? '' : currentState;
          setCurrentStatus(status);
        } else {
          setError(!changed ? `Invalid ## ${message}` : '');
        }
      })
      .catch((error) => {
        setError(error?.message);
      });
  };

  return (
    <div className="root">
      <div>
        <div className="traffic-light">
          <span
            className={`red ${currentStatus === 'red' ? 'active' : undefined}`}
          ></span>
          <span
            className={`green ${
              currentStatus === 'green' ? 'active' : undefined
            }`}
          ></span>
          <span
            className={`yellow ${
              currentStatus === 'yellow' ? 'active' : undefined
            }`}
          ></span>
        </div>
      </div>
      <div className="buttons">
        <button
          disabled={!(currentStatus === '')}
          onClick={() => sendRequest('START')}
        >
          Start
        </button>
        <button
          disabled={!(currentStatus === 'yellow')}
          onClick={() => sendRequest('RESTART')}
        >
          Restart
        </button>
        <button
          disabled={currentStatus === ''}
          onClick={() => sendRequest('RESET')}
        >
          Reset
        </button>
        <br />
        <br />
        <button disabled className="red" onClick={() => sendRequest('RED')}>
          Red
        </button>
        <button
          disabled={!(currentStatus === 'red')}
          className="green"
          onClick={() => sendRequest('GREEN')}
        >
          Green
        </button>
        <button
          className="yellow"
          disabled={!(currentStatus === 'green')}
          onClick={() => sendRequest('YELLOW')}
        >
          Yellow
        </button>
        <button
          disabled={!(currentStatus === 'red')}
          className="yellow"
          onClick={() => sendRequest('YELLOW', { forcefully: true })}
        >
          Force RtoY
        </button>
      </div>
      <div className="error">
        {error && (
          <>
            <p>
              <b>ERROR: </b>
              {error}
            </p>
            <button onClick={() => setError('')}>Clear Error</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
