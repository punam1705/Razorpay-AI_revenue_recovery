import { useState } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Payments from './pages/Payments'
import Recoveries from './pages/Recoveries'
import AIDecisions from './pages/AIDecisions'
import Approvals from './pages/Approvals'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/recoveries" element={<Recoveries />} />
              <Route path="/ai-decisions" element={<AIDecisions />} />
              <Route path="/approvals" element={<Approvals />} />
            </Routes>
        </main>
      </div>
    </div>
    </BrowserRouter>
  )
}

export default App
