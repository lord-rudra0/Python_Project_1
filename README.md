# PDF Summarizer with AI-Powered Chapter Analysis

A modern web application that transforms PDFs into concise, chapter-wise summaries using AI technology, with additional features for interactive quizzes and content analysis.

## 🌟 Features

- **PDF Upload & Processing**: Upload PDF files and extract text content
- **AI-Powered Summarization**: Generate chapter-wise summaries using Google's Gemini AI
- **Interactive Quiz Generation**: Create dynamic quizzes based on the content
- **Responsive Design**: Fully responsive interface that works on all devices
- **Real-time Feedback**: Immediate feedback on quiz answers
- **Progress Tracking**: Track quiz performance with detailed results

## 🛠️ Tech Stack

### Frontend
- React.js
- CSS3 with custom animations
- Modern JavaScript (ES6+)

### Backend
- Python
- Flask
- Google Gemini AI API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone [your-repository-url]
cd pdf-summarizer
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Setup Backend**
```bash
cd Backend
pip install -r requirements.txt
```

4. **Environment Variables**
Create a `.env` file in the Backend directory:
```env
GOOGLE_GEMINI_API=your_api_key_here
```

### Running the Application

1. **Start the Backend Server**
```bash
cd Backend
python app.py
```
The server will start on `http://localhost:5000`

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
```
The application will be available at `http://localhost:5174`

## 📱 Usage

1. **Upload PDF**
   - Click on the file input or drag and drop your PDF
   - Click "Upload & Summarize" button

2. **View Summary**
   - Summaries are automatically generated and displayed in chapter cards
   - Each chapter includes a title and concise summary

3. **Generate Quiz**
   - Click "Generate Questions" after summary generation
   - Answer the multiple-choice questions
   - Get immediate feedback on your answers

## 🎨 Features & Styling

- **Animated Components**: Smooth transitions and loading states
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects and visual feedback
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Configuration

### Backend Configuration
- Modify `app.py` to adjust:
  - AI prompt settings
  - Summary generation parameters
  - Quiz question format

### Frontend Configuration
- Customize styles in `ReadFile.css`
- Adjust animations and transitions
- Modify layout and responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for providing the summarization capabilities
- React.js community for the frontend framework
- Flask community for the backend framework

## 📞 Support

For support, email [your-email] or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Multiple PDF comparison
- [ ] Custom chapter categorization
- [ ] Export summaries in various formats
- [ ] Advanced quiz customization
- [ ] User authentication and saved summaries 