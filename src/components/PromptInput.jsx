import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchBuilderData } from './Builder/builderData';

export function PromptInput() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null); // State for response data
  const [loading, setLoading] = useState(false);
   // State for response
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (prompt.trim()) {
      setLoading(true);
      const data = await fetchBuilderData(prompt);
     
      try {
        const response = await axios.post(`http://localhost:4000/ai/get-results?prompt=${prompt}`, 
          prompt, 
        );

        if (response.status === 200 && data) {
          setResult(response.data); // Save the response in state
          navigate('/builder', { state: data });
        } else {
          throw new Error('Failed to generate response');
        }
      } catch (error) {
        console.error('Error generating website:', error);
        alert(error.response?.data?.error || 'Failed to generate website. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
      <h2 className="text-4xl font-bold text-center text-white mb-8">
        Create your dream website with AI
      </h2>
      <p className="text-gray-400 text-center mb-8 text-lg">
        Describe your website idea, and we'll help you bring it to life
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your website (e.g., 'Create a modern portfolio website with a dark theme, project gallery, and contact form')"
          className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-2 ${
            loading ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
          } text-white px-6 py-3 rounded-lg font-medium transition-colors`}
        >
          <Wand2 className="h-5 w-5" />
          <span>{loading ? 'Generating...' : 'Generate Website'}</span>
        </button>
      </form>

      {/* Display result after generation */}
      {/* {result && (
        <div className="mt-8 bg-gray-900 text-white p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold mb-2">Generated Response:</h3>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )} */}
    </div>
  );
}
