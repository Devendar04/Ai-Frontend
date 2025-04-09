import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { BuilderView } from './components/Builder/BuilderView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950">
        <Header />
        <Routes>
          <Route path="/" element={<PromptInput />} />
          <Route path="/builder" element={<BuilderView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;