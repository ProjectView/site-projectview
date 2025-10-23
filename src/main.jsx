import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProjectviewWebsite from './components/ProjectviewWebsite'
import BlogPage from './components/BlogPage'
import ArticleShowroomAuto from './components/ArticleShowroomAuto'
import ArticleModerniserShowroom from './components/ArticleModerniserShowroom'
import ArticleErreursReunion from './components/ArticleErreursReunion'
import ArticleEcransTactiles from './components/ArticleEcransTactiles'
import ArticleWirelessCasting from './components/ArticleWirelessCasting'
import ArticleVideoconferenceIntegree from './components/ArticleVideoconferenceIntegree'
import Article4KHDR from './components/Article4KHDR'
import ArticleInteractivite from './components/ArticleInteractivite'
import BureauEtudeVR from './components/BureauEtudeVR'
import TablesTactiles from './components/TablesTactiles'
import EcransCollaboratifs from './components/EcransCollaboratifs'
import AffichageDynamique from './components/AffichageDynamique'
import SolutionsCollaboration from './components/SolutionsCollaboration'
import PresentationInnovante from './components/PresentationInnovante'
import AssistantIA from './components/AssistantIA'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProjectviewWebsite />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/article/showroom-automobile" element={<ArticleShowroomAuto />} />
        <Route path="/article/moderniser-showroom" element={<ArticleModerniserShowroom />} />
        <Route path="/article/erreurs-reunion" element={<ArticleErreursReunion />} />
        <Route path="/article/ecrans-tactiles" element={<ArticleEcransTactiles />} />
        <Route path="/article/wireless-casting" element={<ArticleWirelessCasting />} />
        <Route path="/article/videoconference-integree" element={<ArticleVideoconferenceIntegree />} />
        <Route path="/article/4k-hdr" element={<Article4KHDR />} />
        <Route path="/article/interactivite" element={<ArticleInteractivite />} />
        <Route path="/solutions/bureau-etude-vr" element={<BureauEtudeVR />} />
        <Route path="/solutions/tables-tactiles" element={<TablesTactiles />} />
        <Route path="/solutions/ecrans-collaboratifs" element={<EcransCollaboratifs />} />
        <Route path="/solutions/affichage-dynamique" element={<AffichageDynamique />} />
        <Route path="/solutions/collaboration" element={<SolutionsCollaboration />} />
        <Route path="/solutions/presentation-innovante" element={<PresentationInnovante />} />
        <Route path="/solutions/assistant-ia" element={<AssistantIA />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
