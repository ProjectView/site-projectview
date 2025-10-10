import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectviewWebsite from './components/ProjectviewWebsite'
import ArticleShowroomAuto from './components/ArticleShowroomAuto'
import BureauEtudeVR from './components/BureauEtudeVR'
import TablesTactiles from './components/TablesTactiles'
import EcransCollaboratifs from './components/EcransCollaboratifs'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectviewWebsite />} />
        <Route path="/article/showroom-automobile" element={<ArticleShowroomAuto />} />
        <Route path="/solutions/bureau-etude-vr" element={<BureauEtudeVR />} />
        <Route path="/solutions/tables-tactiles" element={<TablesTactiles />} />
        <Route path="/solutions/ecrans-collaboratifs" element={<EcransCollaboratifs />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
