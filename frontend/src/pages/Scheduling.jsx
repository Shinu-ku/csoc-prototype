import React, { useState } from 'react';
import { Activity, Play, Settings2, BarChart2 } from 'lucide-react';

export default function Scheduling() {
  const [algo, setAlgo] = useState('SJF');

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header flex-between">
        <div>
          <h1>CPU Scheduling Simulator</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Visualize and analyze different OS scheduling algorithms.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ background: 'var(--accent-primary)', border: 'none', borderRadius: '8px', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
            <Play size={16} fill="#fff" /> Run Simulation
          </button>
        </div>
      </div>
      
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card glass-panel" style={{height: 'fit-content'}}>
          <div className="flex-between" style={{marginBottom: '24px'}}>
            <h3>Configuration</h3>
            <Settings2 size={18} color="var(--text-muted)" />
          </div>
          
          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>Algorithm</label>
            <select 
              value={algo}
              onChange={(e) => setAlgo(e.target.value)}
              style={{width: '100%', padding: '10px 12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff', outline: 'none', appearance: 'none'}}
            >
              <option value="FCFS">First Come First Serve (FCFS)</option>
              <option value="SJF">Shortest Job First (SJF)</option>
              <option value="SRTF">Shortest Remaining Time First</option>
              <option value="RR">Round Robin (RR)</option>
            </select>
          </div>

          <div style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '8px', color: 'var(--text-muted)', fontSize: '0.9rem'}}>Time Quantum (for RR only)</label>
            <input type="number" disabled={algo !== 'RR'} defaultValue={2} style={{width: '100%', padding: '10px 12px', background: algo === 'RR' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--border-light)', borderRadius: '8px', color: '#fff', outline: 'none'}} />
          </div>

          <hr style={{border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0'}} />

          <h4 style={{marginBottom: '16px'}}>Processes Input</h4>
          <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem'}}>
            <thead>
              <tr>
                <th style={{padding: '8px'}}>ID</th>
                <th style={{padding: '8px'}}>Arrival</th>
                <th style={{padding: '8px'}}>Burst</th>
              </tr>
            </thead>
            <tbody>
              {[
                {id: 'P1', arr: 0, burst: 5},
                {id: 'P2', arr: 1, burst: 3},
                {id: 'P3', arr: 2, burst: 8},
                {id: 'P4', arr: 3, burst: 6},
              ].map(p => (
                <tr key={p.id}>
                  <td style={{padding: '8px', textAlign: 'center', color: 'var(--accent-primary)'}}>{p.id}</td>
                  <td style={{padding: '8px'}}><input type="number" defaultValue={p.arr} style={{width: '50px', background: 'transparent', border: '1px solid var(--border-light)', color: '#fff', padding: '4px', borderRadius: '4px'}} /></td>
                  <td style={{padding: '8px'}}><input type="number" defaultValue={p.burst} style={{width: '50px', background: 'transparent', border: '1px solid var(--border-light)', color: '#fff', padding: '4px', borderRadius: '4px'}} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button style={{width: '100%', padding: '8px', marginTop: '16px', background: 'rgba(255,255,255,0.05)', border: '1px dashed var(--border-light)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer'}}>
            + Add Process
          </button>
        </div>

        <div>
          <div className="card glass-panel" style={{marginBottom: '24px'}}>
            <div className="flex-between" style={{marginBottom: '24px'}}>
              <h3>Gantt Chart (Mock)</h3>
              <BarChart2 size={18} color="var(--text-muted)" />
            </div>
            <div style={{display: 'flex', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)'}}>
              <div style={{flex: 5, background: 'rgba(59, 130, 246, 0.2)', borderRight: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#93c5fd'}}>P1</div>
              <div style={{flex: 3, background: 'rgba(139, 92, 246, 0.2)', borderRight: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#c4b5fd'}}>P2</div>
              <div style={{flex: 6, background: 'rgba(16, 185, 129, 0.2)', borderRight: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#6ee7b7'}}>P4</div>
              <div style={{flex: 8, background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#fcd34d'}}>P3</div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '0 4px'}}>
              <span>0</span>
              <span style={{marginLeft: '15%'}}>5</span>
              <span style={{marginLeft: '15%'}}>8</span>
              <span style={{marginLeft: '25%'}}>14</span>
              <span>22</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card glass-panel" style={{padding: '16px'}}>
              <h3 style={{fontSize: '0.8rem'}}>Avg Waiting Time</h3>
              <div className="value" style={{fontSize: '1.8rem'}}>4.25 <span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400}}>ms</span></div>
            </div>
            <div className="stat-card glass-panel" style={{padding: '16px'}}>
              <h3 style={{fontSize: '0.8rem'}}>Avg Turnaround Time</h3>
              <div className="value" style={{fontSize: '1.8rem'}}>9.75 <span style={{fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400}}>ms</span></div>
            </div>
            <div className="stat-card glass-panel" style={{padding: '16px'}}>
              <h3 style={{fontSize: '0.8rem'}}>CPU Utilization</h3>
              <div className="value" style={{fontSize: '1.8rem', color: 'var(--success)'}}>100%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
