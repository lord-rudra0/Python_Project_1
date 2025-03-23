import './App.css';
import ReadFile from './Body/ReadFile';
import Navbar from './Navbar/navbar';
import Footer from './Footer/Footer';

function App() {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <h1 className="home-title">Smart PDF Summarizer</h1>
        <p className="home-description">
          Transform your reading experience with AI-powered chapter-wise summaries.
          Upload your PDFs and get concise, organized insights in seconds.
        </p>
      </div>
      <ReadFile />
      <Footer />
    </div>
  );
}

export default App;
