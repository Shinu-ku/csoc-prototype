import React, { useState } from 'react';
import { Cpu, Search, Filter } from 'lucide-react';

const MOCK_PROCESSES = [
  { pid: 1402, process_name: 'nginx', cpu_percent: 12.4, memory_percent: 5.2, thread_count: 8, state: 'Running', user: 'www-data' },
  { pid: 382, process_name: 'systemd', cpu_percent: 0.1, memory_percent: 0.5, thread_count: 1, state: 'Sleeping', user: 'root' },
  { pid: 1993, process_name: 'postgres', cpu_percent: 45.8, memory_percent: 28.4, thread_count: 24, state: 'Running', user: 'postgres' },
  { pid: 2041, process_name: 'redis-server', cpu_percent: 8.2, memory_percent: 12.1, thread_count: 4, state: 'Running', user: 'redis' },
  { pid: 5932, process_name: 'python3', cpu_percent: 88.5, memory_percent: 15.6, thread_count: 12, state: 'Running', user: 'csoc' },
  { pid: 821, process_name: 'sshd', cpu_percent: 0.0, memory_percent: 0.2, thread_count: 1, state: 'Sleeping', user: 'root' },
  { pid: 1024, process_name: 'docker', cpu_percent: 5.4, memory_percent: 18.2, thread_count: 32, state: 'Running', user: 'root' },
  { pid: 4096, process_name: 'node', cpu_percent: 15.6, memory_percent: 8.4, thread_count: 10, state: 'Running', user: 'csoc' },
].sort((a, b) => b.cpu_percent - a.cpu_percent);

export default function Processes() {
  const [processes] = useState(MOCK_PROCESSES);
  
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Process Monitor</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Global view of running processes across all nodes.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search PID or Name..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
          </div>
          <button style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', cursor: 'pointer' }}>
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>
      
      <div className="card glass-panel" style={{padding: 0, overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{padding: '16px 24px'}}>PID</th>
              <th>Process Name</th>
              <th>User</th>
              <th style={{width: '200px'}}>CPU Usage</th>
              <th style={{width: '200px'}}>Memory Usage</th>
              <th>Threads</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            {processes.map(p => (
              <tr key={p.pid} style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: '16px 24px', fontFamily: 'monospace', color: 'var(--text-muted)'}}>{p.pid}</td>
                <td style={{fontWeight: 600}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Cpu size={16} color="var(--accent-primary)" />
                    {p.process_name}
                  </div>
                </td>
                <td style={{color: 'var(--text-muted)'}}>{p.user}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{width: '40px', color: p.cpu_percent > 80 ? 'var(--danger)' : 'inherit'}}>{p.cpu_percent}%</span>
                    <div className="progress-container" style={{flex: 1, marginTop: 0}}>
                      <div className="progress-bar" style={{
                        width: `${p.cpu_percent}%`, 
                        background: p.cpu_percent > 80 ? 'var(--danger)' : 'var(--accent-primary)'
                      }}></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                    <span style={{width: '40px', color: p.memory_percent > 80 ? 'var(--warning)' : 'inherit'}}>{p.memory_percent}%</span>
                    <div className="progress-container" style={{flex: 1, marginTop: 0}}>
                      <div className="progress-bar" style={{
                        width: `${p.memory_percent}%`, 
                        background: p.memory_percent > 80 ? 'var(--warning)' : 'var(--accent-secondary)'
                      }}></div>
                    </div>
                  </div>
                </td>
                <td>{p.thread_count}</td>
                <td>
                  <span className={`badge ${p.state === 'Running' ? 'success' : 'warning'}`}>{p.state}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
