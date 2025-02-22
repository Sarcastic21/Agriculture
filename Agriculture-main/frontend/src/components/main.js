import React, { useState, useRef } from 'react';
import { marked } from 'marked';
import { GoogleGenerativeAI } from '@google/generative-ai';
import '../styles/Ai.css'; // Ensure this file exists

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

  const apiKey = "AIzaSyA_JU-Ozp8QjZtl8KDzEDYpxXC213gHcMA";
  if (!apiKey) {
    throw new Error('Missing Gemini API key. Please add REACT_APP_GEMINI_API_KEY to your .env file');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Function to add messages
  const addMessage = (content, isUser = false, imageUrl = null) => {
    const message = {
      content: marked.parse(content),
      isUser,
      imageUrl,
    };
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCurrentImage(event.target.result);
      addMessage('Image uploaded successfully', true, event.target.result);
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      addMessage('Failed to upload image. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  // Convert file to Generative API Part
  const fileToGenerativePart = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Handle send button click
  const handleSend = async () => {
    if (!userInput && !currentImage) return;

    setIsSending(true);

    try {
      addMessage(userInput, true, currentImage);

      let result;

      if (currentImage) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        const imagePart = await fileToGenerativePart(fileInputRef.current.files[0]);
        const prompt = userInput || "What's in this image?";
        result = await model.generateContent([prompt, imagePart]);
      } else {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        result = await model.generateContent(userInput);
      }

      const response = await result.response;
      const botResponse = response.text();

      if (!botResponse) {
        throw new Error('Empty response from Gemini API');
      }

      addMessage(botResponse);
    } catch (error) {
      console.error('Error details:', error);
      let errorMessage = 'Sorry, there was an error processing your request. ';
      if (error.message.includes('API key')) {
        errorMessage += 'Please check your API key configuration.';
      } else if (error.message.includes('image')) {
        errorMessage += 'There was a problem with the image. Please try a different image.';
      } else {
        errorMessage += error.message;
      }
      addMessage(errorMessage);
    } finally {
      setIsSending(false);
      setUserInput('');
      setCurrentImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl  mx-auto p-4">
  <h1 className="heading">Agritech Ai</h1>
  <div id="chat-messages" className="mb-4 h-[60vh] overflow-y-auto px-4 py-2 bg-gray-50 rounded-lg shadow-inner">
    {messages.map((msg, index) => (
      <div
        key={index}
        className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
      >
        {msg.imageUrl ? (
          <div className="flex flex-col">
            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
            <img
              src={msg.imageUrl}
              alt="Uploaded"
              className="rounded-lg mt-2 max-w-[200px] border border-gray-200 shadow-sm"
            />
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: msg.content }} />
        )}
      </div>
    ))}
  </div>
  <div className=" gap-3 mx-2  mt-4">
    <input
      type="file"
      id="image-upload"
      accept="image/*"
      ref={fileInputRef}
      className="hidden"
      onChange={handleImageUpload}
    />
    <button
      id="upload-btn"
      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      onClick={() => fileInputRef.current.click()}
    >
      📷 Upload Image
    </button>
    <input
      type="text"
      id="user-input"
      className="flex-1 p-2 mx-2 border rounded-lg focus:ring focus:ring-blue-200"
      placeholder="Type your message..."
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && !isSending) {
          e.preventDefault();
          handleSend();
        }
      }}
    />
    <button
      id="send-btn"
      className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      disabled={isSending}
      onClick={handleSend}
    >
      {isSending ? 'Sending...' : 'Send'}
    </button>
  </div>
</div>

  );
};

export default App;
