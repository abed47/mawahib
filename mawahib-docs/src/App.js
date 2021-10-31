import logo from './logo.svg';
import SwaggerUI from 'swagger-ui-react';
import './App.css';
import 'swagger-ui-react/swagger-ui.css';

function App() {
  return (
    <div>
      <SwaggerUI url="api/index.json" />
    </div>
  );
}

export default App;
