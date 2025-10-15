import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { App } from './App';
import { theme } from './theme';
import './index.css';
import "./index.less";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ConfigProvider componentSize='small' theme={theme}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
