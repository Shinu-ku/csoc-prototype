import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, Filter, Search } from 'lucide-react';

const MOCK_ALERTS = [
  { id: 'ALT-1092', time: '10 mins ago', agent: 'web-prod-1', severity: 'CRITICAL', title: 'Suspicious Process Detected', description: 'Process "python3" running with anomalous high CPU and network usage.', status: 'OPEN' },
  { id: 'ALT-1091', time: '45 mins ago', agent: 'db-master', severity: 'HIGH', title: 'Failed Login Attempts', description: 'Multiple failed SSH login attempts detected from IP 192.168.1.104.', status: 'OPEN' },
  { id: 'ALT-1090', time: '2 hours ago', agent: 'worker-node-1', severity: 'MEDIUM', title: 'System Offline', agent_status: 'OFFLINE', description: 'Agent heartbeat lost. System marked as offline.', status: 'OPEN' },
  { id: 'ALT-1089', time: '5 hours ago', agent: 'cache-redis', severity: 'LOW', title: 'High Memory Usage', description: 'Redis process consuming >80% of available memory.', status: 'RESOLVED' },
  { id: 'ALT-1088', time: '1 day ago', agent: 'web-prod-2', severity: 'HIGH', title: 'Unauthorized Access', description: 'Access to sensitive file /etc/shadow detected.', status: 'RESOLVED' },
];

export default function Alerts() {
  const [alerts] = useState(MOCK_ALERTS);

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'CRITICAL': return <ShieldAlert size={16} />;
      case 'HIGH': return <AlertTriangle size={16} />;
      case 'MEDIUM': return <AlertCircle size={16} />;
      case 'LOW': return <Info size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return '';
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header flex-between">
        <div>
          <h1>Security Alerts</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Real-time threat detection and anomaly monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'var(--bg-panel)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input type="text" placeholder="Search alerts..." style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }} />
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
              <th style={{padding: '16px 24px'}}>Time</th>
              <th>Alert ID</th>
              <th>Source</th>
              <th>Severity</th>
              <th style={{width: '35%'}}>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, idx) => (
              <tr key={idx} style={{borderBottom: '1px solid var(--border-light)', opacity: alert.status === 'RESOLVED' ? 0.6 : 1}}>
                <td style={{padding: '16px 24px', color: 'var(--text-muted)', whiteSpace: 'nowrap'}}>{alert.time}</td>
                <td style={{fontFamily: 'monospace', color: 'var(--accent-primary)'}}>{alert.id}</td>
                <td style={{fontWeight: 500}}>{alert.agent}</td>
                <td>
                  <span className={`badge ${getSeverityClass(alert.severity)}`} style={{display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
                    {getSeverityIcon(alert.severity)}
                    {alert.severity}
                  </span>
                </td>
                <td>
                  <div style={{fontWeight: 600, marginBottom: '4px'}}>{alert.title}</div>
                  <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4}}>{alert.description}</div>
                </td>
                <td>
                  <span className={`badge ${alert.status === 'OPEN' ? 'danger' : 'success'}`}>{alert.status}</span>
                </td>
                <td>
                  {alert.status === 'OPEN' && (
                    <button style={{ background: 'transparent', border: '1px solid var(--border-light)', borderRadius: '4px', padding: '4px 12px', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>
                      Investigate
                    </button>
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
