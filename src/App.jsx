import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SESSIONS = [
  { id: 1,  trainer: 'Amara Okafor',  initials: 'AO', color: '#3b82f6', date: '2026-06-01', topic: 'Strength & Conditioning', capacity: 20, attended: 18, status: 'completed' },
  { id: 2,  trainer: 'Dev Patel',      initials: 'DP', color: '#10b981', date: '2026-06-03', topic: 'HIIT Cardio Blast',       capacity: 15, attended: 14, status: 'completed' },
  { id: 3,  trainer: 'Amara Okafor',  initials: 'AO', color: '#3b82f6', date: '2026-06-05', topic: 'Flexibility & Mobility',  capacity: 12, attended: 10, status: 'completed' },
  { id: 4,  trainer: 'Priya Mensah',  initials: 'PM', color: '#8b5cf6', date: '2026-06-07', topic: 'Yoga Flow',               capacity: 18, attended: 17, status: 'completed' },
  { id: 5,  trainer: 'Dev Patel',      initials: 'DP', color: '#10b981', date: '2026-06-09', topic: 'Bootcamp Circuit',        capacity: 20, attended: 12, status: 'completed' },
  { id: 6,  trainer: 'Chidi Eze',     initials: 'CE', color: '#f59e0b', date: '2026-06-11', topic: 'Powerlifting Basics',     capacity: 10, attended: 9,  status: 'completed' },
  { id: 7,  trainer: 'Priya Mensah',  initials: 'PM', color: '#8b5cf6', date: '2026-06-13', topic: 'Pilates Core',            capacity: 15, attended: 15, status: 'completed' },
  { id: 8,  trainer: 'Amara Okafor',  initials: 'AO', color: '#3b82f6', date: '2026-06-15', topic: 'Functional Fitness',      capacity: 20, attended: 16, status: 'completed' },
  { id: 9,  trainer: 'Chidi Eze',     initials: 'CE', color: '#f59e0b', date: '2026-06-17', topic: 'Olympic Lifting',         capacity: 8,  attended: 7,  status: 'completed' },
  { id: 10, trainer: 'Dev Patel',      initials: 'DP', color: '#10b981', date: '2026-06-19', topic: 'Endurance Run',           capacity: 25, attended: 22, status: 'completed' },
  { id: 11, trainer: 'Priya Mensah',  initials: 'PM', color: '#8b5cf6', date: '2026-06-21', topic: 'Mindful Movement',        capacity: 18, attended: 13, status: 'completed' },
  { id: 12, trainer: 'Amara Okafor',  initials: 'AO', color: '#3b82f6', date: '2026-06-25', topic: 'Strength & Conditioning', capacity: 20, attended: 0,  status: 'scheduled' },
  { id: 13, trainer: 'Dev Patel',      initials: 'DP', color: '#10b981', date: '2026-06-10', topic: 'Spin Class',              capacity: 20, attended: 0,  status: 'cancelled' },
];

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(51,65,85,0.5)' },
      ticks: { color: '#94a3b8', font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(51,65,85,0.5)' },
      ticks: { color: '#94a3b8', font: { size: 11 } },
      beginAtZero: true,
    },
  },
};

function rateColor(rate) {
  if (rate >= 90) return '#10b981';
  if (rate >= 70) return '#f59e0b';
  return '#ef4444';
}

export default function App() {
  const completed = SESSIONS.filter(s => s.status === 'completed');

  const totalSessions   = completed.length;
  const totalAttendees  = completed.reduce((a, s) => a + s.attended, 0);
  const totalCapacity   = completed.reduce((a, s) => a + s.capacity, 0);
  const avgRate         = Math.round((totalAttendees / totalCapacity) * 100);
  const avgPerSession   = Math.round(totalAttendees / totalSessions);

  // Weekly bar chart (group completed sessions by week)
  const barLabels = completed.map(s => s.date.slice(5));
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Attended',
        data: completed.map(s => s.attended),
        backgroundColor: 'rgba(59,130,246,0.75)',
        borderRadius: 5,
      },
      {
        label: 'Capacity',
        data: completed.map(s => s.capacity),
        backgroundColor: 'rgba(51,65,85,0.6)',
        borderRadius: 5,
      },
    ],
  };

  const lineData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Attendance %',
        data: completed.map(s => Math.round((s.attended / s.capacity) * 100)),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  // Doughnut by trainer
  const trainerMap = {};
  completed.forEach(s => {
    trainerMap[s.trainer] = (trainerMap[s.trainer] || 0) + s.attended;
  });
  const trainerNames = Object.keys(trainerMap);
  const trainerColors = ['#3b82f6','#10b981','#8b5cf6','#f59e0b'];
  const doughnutData = {
    labels: trainerNames,
    datasets: [{
      data: trainerNames.map(n => trainerMap[n]),
      backgroundColor: trainerColors,
      borderColor: '#1e293b',
      borderWidth: 3,
    }],
  };

  const doughnutOpts = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', padding: 14, font: { size: 11 } },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
      },
    },
  };

  const barChartOpts = {
    ...CHART_OPTS,
    plugins: {
      ...CHART_OPTS.plugins,
      legend: {
        display: true,
        labels: { color: '#94a3b8', boxWidth: 12, font: { size: 11 } },
      },
    },
  };

  const lineOpts = {
    ...CHART_OPTS,
    scales: {
      ...CHART_OPTS.scales,
      y: { ...CHART_OPTS.scales.y, max: 100, ticks: { ...CHART_OPTS.scales.y.ticks, callback: v => v + '%' } },
    },
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div>
          <h1 className="header-title">Trainer Session Attendance</h1>
          <p className="header-subtitle">June 2026 — performance overview</p>
        </div>
        <span className="badge">LIVE</span>
      </header>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-label">Total Sessions</div>
          <div className="stat-value">{totalSessions}</div>
          <div className="stat-change up">↑ 3 vs last month</div>
        </div>
        <div className="stat-card green">
          <div className="stat-label">Total Attendees</div>
          <div className="stat-value">{totalAttendees.toLocaleString()}</div>
          <div className="stat-change up">↑ 12% vs last month</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-label">Avg Attendance Rate</div>
          <div className="stat-value">{avgRate}%</div>
          <div className="stat-change up">↑ 4pts vs last month</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Avg Per Session</div>
          <div className="stat-value">{avgPerSession}</div>
          <div className="stat-change">across {totalSessions} sessions</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Session Attendance vs Capacity</div>
              <div className="card-subtitle">Completed sessions this month</div>
            </div>
          </div>
          <div className="chart-container">
            <Bar data={barData} options={barChartOpts} />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Attendees by Trainer</div>
              <div className="card-subtitle">Total attendance share</div>
            </div>
          </div>
          <Doughnut data={doughnutData} options={doughnutOpts} />
        </div>
      </div>

      {/* Trend Line */}
      <div className="card" style={{ marginBottom: 32 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Attendance Rate Trend</div>
            <div className="card-subtitle">% of capacity filled per session</div>
          </div>
        </div>
        <div className="chart-container">
          <Line data={lineData} options={lineOpts} />
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All Sessions</div>
            <div className="card-subtitle">June 2026</div>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Trainer</th>
                <th>Date</th>
                <th>Topic</th>
                <th>Attended</th>
                <th>Capacity</th>
                <th>Rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map(s => {
                const rate = s.status === 'completed' ? Math.round((s.attended / s.capacity) * 100) : null;
                return (
                  <tr key={s.id}>
                    <td>
                      <div className="trainer-cell">
                        <div className="avatar" style={{ background: s.color + '22', color: s.color }}>
                          {s.initials}
                        </div>
                        {s.trainer}
                      </div>
                    </td>
                    <td style={{ color: '#94a3b8' }}>{s.date}</td>
                    <td>{s.topic}</td>
                    <td>{s.status === 'completed' ? s.attended : '—'}</td>
                    <td>{s.capacity}</td>
                    <td>
                      {rate !== null ? (
                        <div className="attendance-rate">
                          <span style={{ color: rateColor(rate), minWidth: 38 }}>{rate}%</span>
                          <div className="rate-bar">
                            <div className="rate-fill" style={{ width: rate + '%', background: rateColor(rate) }} />
                          </div>
                        </div>
                      ) : '—'}
                    </td>
                    <td>
                      <span className={`status-badge ${s.status}`}>{s.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="footer">
        Trainer Session Attendance Dashboard &mdash; June 2026
      </footer>
    </div>
  );
}
