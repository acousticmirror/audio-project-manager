'use client'

import { useState } from 'react';

export default function ProjectDetail({ project, onBack, onAddSession }) {
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionData, setSessionData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    engineerNotes: '',
    gearUsed: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSession = {
      ...sessionData,
      id: Date.now(),
      projectId: project.id
    };
    onAddSession(newSession);
    setSessionData({
      date: new Date().toISOString().split('T')[0],
      duration: '',
      engineerNotes: '',
      gearUsed: ''
    });
    setShowSessionForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-blue-400 hover:text-blue-300 flex items-center"
        >
          ← Back to Projects
        </button>

        <div className="bg-gray-600 rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
              {project.client && (
                <p className="text-gray-200 mb-1">Client: {project.client}</p>
              )}
              <p className="text-gray-300 text-sm">Started: {project.startDate}</p>
            </div>
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
              {project.status}
            </span>
          </div>
          {project.notes && (
            <div className="mt-4 p-3 bg-gray-700 rounded">
              <p className="text-gray-100">{project.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-600 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Sessions</h2>
            <button
              onClick={() => setShowSessionForm(!showSessionForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              {showSessionForm ? 'Cancel' : 'New Session'}
            </button>
          </div>

          {showSessionForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-700 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={sessionData.date}
                    onChange={(e) => setSessionData({...sessionData, date: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Duration (hours)
                  </label>
                  <input
                    type="text"
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({...sessionData, duration: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Gear Used
                </label>
                <input
                  type="text"
                  value={sessionData.gearUsed}
                  onChange={(e) => setSessionData({...sessionData, gearUsed: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Neumann U87, SSL Console, Logic Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Engineer Notes
                </label>
                <textarea
                  value={sessionData.engineerNotes}
                  onChange={(e) => setSessionData({...sessionData, engineerNotes: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Session notes, what was recorded, issues, successes..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Add Session
              </button>
            </form>
          )}

          {!project.sessions || project.sessions.length === 0 ? (
            <p className="text-gray-200">No sessions yet. Click "New Session" to add one!</p>
          ) : (
            <div className="space-y-4">
              {project.sessions.map(session => (
                <div key={session.id} className="bg-gray-700 border border-gray-500 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {new Date(session.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    {session.duration && (
                      <span className="text-gray-300 text-sm">{session.duration} hours</span>
                    )}
                  </div>
                  {session.gearUsed && (
                    <p className="text-gray-200 mb-2">
                      <span className="font-medium">Gear:</span> {session.gearUsed}
                    </p>
                  )}
                  {session.engineerNotes && (
                    <p className="text-gray-100 mt-2">{session.engineerNotes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}