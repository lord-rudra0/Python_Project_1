import './App.css';
import ReadFile from './Body/ReadFile';
import Navbar from './Navbar/navbar';

function App() {
  return (
    <div style={{ paddingTop: "80px" }}>
      <Navbar />
      <ReadFile />

      <div>
        <h1>Test</h1>
        <p>This is frontend Home</p>
      </div>
    </div>
  );
}

export default App;
