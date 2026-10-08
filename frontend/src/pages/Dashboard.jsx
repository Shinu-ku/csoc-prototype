import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, ShieldAlert, CheckCircle2, XCircle, Server, Cpu, Network } from 'lucide-react';

const MOCK_AGENTS = [
  { agent_id: 'AG-001', hostname: 'web-prod-1', status: 'ONLINE', os_name: 'Linux', os_version: 'Ubuntu 22.04', ip_address: '192.168.1.10', cpu: 45, memory: 60 },
  { agent_id: 'AG-002', hostname: 'db-master', status: 'ONLINE', os_name: 'Linux', os_version: 'CentOS 8', ip_address: '192.168.1.15', cpu: 78, memory: 85 },
  { agent_id: 'AG-003', hostname: 'cache-redis', status: 'ONLINE', os_name: 'Linux', os_version: 'Ubuntu 22.04', ip_address: '192.168.1.20', cpu: 22, memory: 40 },
  { agent_id: 'AG-004', hostname: 'worker-node-1', status: 'OFFLINE', os_name: 'Windows', os_version: 'Server 2022', ip_address: '192.168.1.25', cpu: 0, memory: 0 },
  { agent_id: 'AG-005', hostname: 'web-prod-2', status: 'ONLINE', os_name: 'Linux', os_version: 'Ubuntu 22.04', ip_address: '192.168.1.11', cpu: 55, memory: 62 },
];

const TRAFFIC_DATA = [
  { time: '00:00', ingress: 1200, egress: 900 },
  { time: '04:00', ingress: 800, egress: 600 },
  { time: '08:00', ingress: 2500, egress: 1800 },
  { time: '12:00', ingress: 4500, egress: 3200 },
  { time: '16:00', ingress: 3800, egress: 2900 },
  { time: '20:00', ingress: 2100, egress: 1500 },
  { time: '24:00', ingress: 1500, egress: 1100 },
];

export default function Dashboard() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [stats, setStats] = useState({ total: 5, online: 4, offline: 1, alerts: 3 });

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Command Center</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Global security overview and system health.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge success" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <span style={{width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', marginRight: 6, boxShadow: '0 0 8px #10b981'}}></span>
            Systems Operational
          </span>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card glass-panel">
          <div className="flex-between">
            <h3>Total Assets</h3>
            <Server size={20} color="var(--accent-primary)" />
          </div>
          <div className="value">{stats.total}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>+2 this week</p>
        </div>
        <div className="stat-card glass-panel">
          <div className="flex-between">
            <h3>Online Nodes</h3>
            <CheckCircle2 size={20} color="var(--success)" />
          </div>
          <div className="value" style={{color: 'var(--success)'}}>{stats.online}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>98.9% uptime</p>
        </div>
        <div className="stat-card glass-panel">
          <div className="flex-between">
            <h3>Offline Nodes</h3>
            <XCircle size={20} color="var(--danger)" />
          </div>
          <div className="value" style={{color: 'var(--danger)'}}>{stats.offline}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Requires attention</p>
        </div>
        <div className="stat-card glass-panel">
          <div className="flex-between">
            <h3>Active Threats</h3>
            <ShieldAlert size={20} color="var(--warning)" />
          </div>
          <div className="value" style={{color: 'var(--warning)'}}>{stats.alerts}</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>Medium severity</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card glass-panel">
          <div className="flex-between" style={{marginBottom: 24}}>
            <h3><Network size={18} style={{display:'inline', verticalAlign:'middle', marginRight: 8}}/> Network Traffic (Mbps)</h3>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
                <defs>
                  <linearGradient id="colorIngress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-secondary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                <Area type="monotone" dataKey="ingress" name="Ingress" stroke="var(--accent-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorIngress)" />
                <Area type="monotone" dataKey="egress" name="Egress" stroke="var(--accent-secondary)" strokeWidth={3} fillOpacity={1} fill="url(#colorEgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card glass-panel">
          <h3>Top Resource Usage</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px'}}>
            {agents.filter(a => a.status === 'ONLINE').sort((a,b) => b.cpu - a.cpu).slice(0, 4).map(agent => (
              <div key={agent.agent_id}>
                <div className="flex-between" style={{fontSize: '0.9rem', marginBottom: '8px'}}>
                  <span style={{fontWeight: 600}}>{agent.hostname}</span>
                  <span style={{color: agent.cpu > 80 ? 'var(--danger)' : 'var(--accent-primary)'}}>{agent.cpu}% CPU</span>
                </div>
                <div className="progress-container">
                  <div className="progress-bar" style={{
                    width: `${agent.cpu}%`, 
                    background: agent.cpu > 80 ? 'var(--danger)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <h2 style={{marginTop: '20px', marginBottom: '20px'}}>Active Sensors</h2>
      <div className="card glass-panel" style={{padding: 0, overflow: 'hidden'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr>
              <th style={{padding: '16px 24px'}}>Hostname</th>
              <th>IP Address</th>
              <th>OS Info</th>
              <th>Status</th>
              <th>CPU / RAM</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.agent_id} style={{borderBottom: '1px solid var(--border-light)'}}>
                <td style={{padding: '16px 24px'}}>
                  <div style={{fontWeight: 600}}>{agent.hostname}</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>{agent.agent_id}</div>
                </td>
                <td style={{fontFamily: 'monospace'}}>{agent.ip_address}</td>
                <td>
                  <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <span style={{fontSize: '1.2rem'}}>{agent.os_name === 'Linux' ? '🐧' : '🪟'}</span>
                    {agent.os_version}
                  </div>
                </td>
                <td>
                  <span className={`badge ${agent.status === 'ONLINE' ? 'success' : 'danger'}`}>{agent.status}</span>
                </td>
                <td>
                  {agent.status === 'ONLINE' ? (
                    <div style={{display: 'flex', gap: '16px', fontSize: '0.85rem'}}>
                      <span style={{color: agent.cpu > 80 ? 'var(--danger)' : 'inherit'}}>C: {agent.cpu}%</span>
                      <span style={{color: agent.memory > 80 ? 'var(--danger)' : 'inherit'}}>R: {agent.memory}%</span>
                    </div>
                  ) : (
                    <span style={{color: 'var(--text-muted)'}}>N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
