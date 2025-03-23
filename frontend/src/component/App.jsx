import './App.css';
import ReadFile from './Body/ReadFile';
import Navbar from './Navbar/navbar';
import Footer from './Footer/Footer';
import { useState } from 'react';

function App() {
  const [hasSummary, setHasSummary] = useState(false);

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        {!hasSummary && (
          <>
            <h1 className="home-title">PDF Summarizer</h1>
            <p className="home-description">
              Transform your reading experience with AI-powered chapter-wise summaries.
              Upload your PDFs and get concise, organized insights in seconds.
            </p>
          </>
        )}
      </div>
      <ReadFile onSummaryGenerated={() => setHasSummary(true)} />
      <Footer />
    </div>
  );
}

export default App;
