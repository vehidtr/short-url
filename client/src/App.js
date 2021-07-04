import { useState, useLayoutEffect } from 'react';
import validUrl from 'valid-url';
import './App.css';
import Logo from './logo.svg';

const createUrl = (url) => {
  const data = fetch('http://192.168.0.13:5000/create', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url: url })
  })
    .then((response) => response.json())
    .then((data) => data);
  return data;
};

const getUrl = (id) => {
  const data = fetch(`http://192.168.0.13:5000${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then((response) => response.json())
    .then((data) => data);
  return data;
};

function App() {
  const [url, setUrl] = useState();
  const [value, setValue] = useState();
  const [error, setError] = useState();

  useLayoutEffect(() => {
    (async () => {
      const path = window.location.pathname;
      if (path.length > 1)
        try {
          const response = await getUrl(path);
          if (response && response.url) window.location.href = response.url;
        } catch (err) {
          window.location.href = 'http://localhost:3000/';
        }
    })();
  }, []);

  const handleSubmit = async (e) => {
    try {
      if (validUrl.isUri(value)) {
        const response = await createUrl(value);
        setError('');

        if (response) {
          if (response.shortUrl) setUrl(response.shortUrl);
          else setUrl(response.url);
        } else setUrl('');
      } else {
        setError('Please enter valid url');
      }
    } catch (error) {
      console.error('Issue with creating url');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://192.168.0.13:5000/${url}`);
  };

  return (
    <>
      {/* <header>Something here</header> */}
      <div className='App'>
        <img src={Logo} className='logo' />
        <div className='title-container'>
          <h1 className='title'>
            ufo<span>l.ink</span>
          </h1>
          <p className='subtitle'>Enter url and make it shorter</p>
        </div>
        <div className='container'>
          <div>
            <input
              type='text'
              placeholder='https://exampleurl.com'
              onChange={(e) => setValue(e.target.value)}
              defaultValue={value}
            />
            <button onClick={handleSubmit} className='submit'>
              Shorten
            </button>
          </div>
          {error ? <span className='url-error'>{error}</span> : null}
          {url ? (
            <>
              <h4 className='subtitle'>Copy and use your shorter link</h4>
              <input
                type='text'
                value={`http://192.168.0.13:5000/${url}`}
                readOnly='readonly'
              />
              <button onClick={handleCopy} className='submit'>
                Copy
              </button>
            </>
          ) : null}
        </div>
      </div>
      <footer>© ufol.ink</footer>
    </>
  );
}

export default App;
