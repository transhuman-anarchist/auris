import { Routes, Route } from 'react-router-dom'
import MapPage from './pages/MapPage.jsx'
import ChapterPage from './pages/ChapterPage.jsx'
import ExercisePage from './pages/ExercisePage.jsx'
import StatsPage from './pages/StatsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/chapter/:chapterId" element={<ChapterPage />} />
      <Route path="/exercise/:exerciseId" element={<ExercisePage />} />
    </Routes>
  )
}
