import { useState } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './AppRoutes';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Provider store={store}>
        <AppRoutes/> 
      </Provider>
    </div>
  );
}

export default App;
