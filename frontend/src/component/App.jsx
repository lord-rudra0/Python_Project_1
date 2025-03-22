import './App.css';
import ReadFile from './Body/ReadFile';
import Navbar from './Navbar/navbar';

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
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Structured Summaries</h3>
            <p className="feature-description">
              Get well-organized summaries broken down by chapters for better comprehension.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Fast Processing</h3>
            <p className="feature-description">
              Our advanced AI processes your documents quickly and efficiently.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-title">Secure & Private</h3>
            <p className="feature-description">
              Your documents are processed securely and never stored on our servers.
            </p>
          </div>
        </div>
      </div>
      <ReadFile />
    </div>
  );
}

export default App;
