import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, Server, ShieldAlert, Cpu, Terminal } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Processes from './pages/Processes';
import Alerts from './pages/Alerts';
import Scheduling from './pages/Scheduling';

function App() {
  return (
    <Router>
      <div className="app-container">
        <aside className="sidebar">
          <h2><ShieldAlert color="var(--accent-primary)" /> CSOC Nexus</h2>
          <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} /> Command Center
          </NavLink>
          <NavLink to="/processes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Cpu size={20} /> Process Monitor
          </NavLink>
          <NavLink to="/alerts" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <ShieldAlert size={20} /> Security Alerts
          </NavLink>
          <NavLink to="/scheduling" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
            <Activity size={20} /> CPU Scheduling
          </NavLink>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/scheduling" element={<Scheduling />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
