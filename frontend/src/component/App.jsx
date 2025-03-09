import './App.css';
import Navbar from './Navbar/navbar';

function App() {
  return (
    <div style={{ paddingTop: "80px" }}> {/* Add padding to avoid content being hidden behind the fixed navbar */}
      <Navbar />

      {/* Add other content here */}
      <div>
        <h1>Vite + React</h1>
        <p>This is a simple app with a fixed navbar.</p>
      </div>
    </div>
  );
}

export default App;
