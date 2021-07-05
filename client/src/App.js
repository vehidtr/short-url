import { useState } from 'react';
import validUrl from 'valid-url';
import './App.css';
import Logo from './logo.svg';

const URL = 'http://192.168.0.13';

const createUrl = (url) => {
  const data = fetch(`${URL}:5000/create`, {
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

function App() {
  const [url, setUrl] = useState();
  const [value, setValue] = useState('');
  const [error, setError] = useState();

  const handleSubmit = async (e) => {
    try {
      if (validUrl.isUri(value)) {
        const response = await createUrl(value);
        setError('');

        if (response) {
          if (response.shortUrl) setUrl(response.shortUrl);
          else setUrl(response.url);
        } else setUrl('');
        setValue('');
      } else {
        setError('Please enter valid url');
      }
    } catch (error) {
      console.error('Issue with creating url');
    }
  };

  const handleCopy = () => {
    console.log();
    const text = `http://192.168.0.13/${url}`;
    console.log(text);
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className='app-container'>
      <div className='App'>
        <img src={Logo} className='logo' alt='Logo for short.it' />
        <div className='title-container'>
          <h1 className='title'>
            short<span>.it</span>
          </h1>
          <p className='subtitle'>... free now and always</p>
        </div>
        <div className='container'>
          <div className='input-wrapper'>
            <input
              type='text'
              placeholder='https://exampleurl.com'
              onChange={(e) => setValue(e.target.value)}
              value={value}
            />
            <button onClick={handleSubmit} className='submit'>
              Shorten
            </button>
          </div>
          {error ? <div className='url-wrapper url-error'>{error}</div> : null}
          {url ? (
            <div className='url-wrapper'>
              <p>{`${URL}/${url}`}</p>
              <button onClick={handleCopy} className='submit copy'>
                Copy
              </button>
            </div>
          ) : null}
        </div>
      </div>
      <footer>© short.it</footer>
    </div>
  );
}

export default App;
