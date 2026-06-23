import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'trainer-attendance-dashboard';

const batches = [
  {
    id: 'batch-1',
    name: 'Morning Batch',
    students: [
      { id: 's1', name: 'Aditi Patel' },
      { id: 's2', name: 'Mohit Sharma' },
      { id: 's3', name: 'Riya Mehta' }
    ]
  },
  {
    id: 'batch-2',
    name: 'Evening Batch',
    students: [
      { id: 's4', name: 'Karan Singh' },
      { id: 's5', name: 'Neha Kumar' },
      { id: 's6', name: 'Anjali Rao' }
    ]
  }
];

const todayDate = new Date().toISOString().slice(0, 10);

function loadAttendance() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (error) {
    return {};
  }
}

function saveAttendance(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

function App() {
  const [attendance, setAttendance] = useState(() => loadAttendance());
  const [activeBatchId, setActiveBatchId] = useState(batches[0].id);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [showSummary, setShowSummary] = useState(true);

  useEffect(() => {
    saveAttendance(attendance);
  }, [attendance]);

  const activeBatch = useMemo(
    () => batches.find((batch) => batch.id === activeBatchId) || batches[0],
    [activeBatchId]
  );

  const dayKey = `${selectedDate}:${activeBatchId}`;
  const dayAttendance = attendance[dayKey] || {};

  const totalStudents = activeBatch.students.length;
  const presentCount = activeBatch.students.filter((student) => dayAttendance[student.id] === 'present').length;
  const absentCount = totalStudents - presentCount;
  const attendancePercent = totalStudents ? Math.round((presentCount / totalStudents) * 100) : 0;

  const handleToggleAttendance = (studentId) => {
    setAttendance((prev) => {
      const updated = { ...prev };
      const batchDay = { ...updated[dayKey] };
      batchDay[studentId] = batchDay[studentId] === 'present' ? 'absent' : 'present';
      updated[dayKey] = batchDay;
      return updated;
    });
  };

  const handleResetDay = () => {
    setAttendance((prev) => {
      const updated = { ...prev };
      delete updated[dayKey];
      return updated;
    });
  };

  const batchStats = useMemo(() => {
    return batches.map((batch) => {
      const key = `${selectedDate}:${batch.id}`;
      const record = attendance[key] || {};
      const present = batch.students.filter((student) => record[student.id] === 'present').length;
      return {
        name: batch.name,
        present,
        total: batch.students.length,
        percent: batch.students.length ? Math.round((present / batch.students.length) * 100) : 0
      };
    });
  }, [attendance, selectedDate]);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Trainer Session Attendance</p>
          <h1>Attendance Dashboard</h1>
          <p>Track daily student attendance across multiple batches. Mark students present or absent, filter by batch and date, and review attendance percentages.</p>
        </div>
        <div className="hero-card">
          <div>
            <strong>{selectedDate}</strong>
            <small>Date selected</small>
          </div>
          <div>
            <strong>{attendancePercent}%</strong>
            <small>Batch attendance</small>
          </div>
        </div>
      </header>

      <section className="panel">
        <div className="field-row">
          <label>
            Select batch
            <select value={activeBatchId} onChange={(e) => setActiveBatchId(e.target.value)}>
              {batches.map((batch) => (
                <option key={batch.id} value={batch.id}>{batch.name}</option>
              ))}
            </select>
          </label>

          <label>
            Select date
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </label>

          <button type="button" className="secondary" onClick={() => setShowSummary((value) => !value)}>
            {showSummary ? 'Hide' : 'Show'} summary
          </button>
        </div>

        {showSummary && (
          <div className="summary-grid">
            <div className="summary-card">
              <h3>Batch summary</h3>
              <p>{activeBatch.name}</p>
              <p>{presentCount} present / {absentCount} absent</p>
              <p className="big-number">{attendancePercent}%</p>
            </div>
            <div className="summary-card">
              <h3>Batch attendance</h3>
              {batchStats.map((stat) => (
                <div key={stat.name} className="stat-row">
                  <span>{stat.name}</span>
                  <span>{stat.present}/{stat.total} ({stat.percent}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>{activeBatch.name}</h2>
            <p>Attendance for {selectedDate}</p>
          </div>
          <button type="button" className="danger" onClick={handleResetDay}>Clear today&apos;s attendance</button>
        </div>

        <div className="attendance-table">
          <div className="table-row header">
            <div>Student</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          {activeBatch.students.map((student) => {
            const status = dayAttendance[student.id] || 'absent';
            return (
              <div key={student.id} className="table-row">
                <div>{student.name}</div>
                <div className={status === 'present' ? 'present' : 'absent'}>{status}</div>
                <div>
                  <button type="button" onClick={() => handleToggleAttendance(student.id)}>
                    Mark {status === 'present' ? 'absent' : 'present'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="panel small-panel">
        <h2>How it works</h2>
        <ul>
          <li>Select a batch and date to load attendance.</li>
          <li>Click each student row to toggle between present and absent.</li>
          <li>Attendance is stored in local storage so your data stays in the browser.</li>
        </ul>
      </section>
    </div>
  );
}

export default App;
