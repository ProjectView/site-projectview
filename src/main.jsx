import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectviewWebsite from './components/ProjectviewWebsite'
import ArticleShowroomAuto from './components/ArticleShowroomAuto'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectviewWebsite />} />
        <Route path="/article/showroom-automobile" element={<ArticleShowroomAuto />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
