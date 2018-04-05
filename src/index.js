import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import NewsApp from './NewsApp';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<NewsApp count={50}/>, document.getElementById('root'));
registerServiceWorker();
