'use client'

import { useState } from 'react';

export default function SessionDetail({ session, onBack, onAddTake }) {
  const [showTakeForm, setShowTakeForm] = useState(false);
  const [takeData, setTakeData] = useState({
    name: '',
    versionNumber: '',
    notes: '',
    status: 'keep'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTake = {
      ...takeData,
      sessionId: session.id
    };
    onAddTake(newTake);
    setTakeData({
      name: '',
      versionNumber: '',
      notes: '',
      status: 'keep'
    });
    setShowTakeForm(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'keep': return 'bg-green-600';
      case 'maybe': return 'bg-yellow-600';
      case 'reject': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-500">
      <button
        onClick={onBack}
        className="mb-4 text-blue-400 hover:text-blue-300 text-sm"
      >
        ← Back to Session List
      </button>

      <div className="mb-4 pb-4 border-b border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-2">
          {new Date(session.date).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        {session.duration && (
          <p className="text-gray-300 text-sm mb-1">Duration: {session.duration} hours</p>
        )}
        {session.gearUsed && (
          <p className="text-gray-200 mb-2">
            <span className="font-medium">Gear:</span> {session.gearUsed}
          </p>
        )}
        {session.engineerNotes && (
          <p className="text-gray-100 mt-2">{session.engineerNotes}</p>
        )}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-white">Takes</h4>
        <button
          onClick={() => setShowTakeForm(!showTakeForm)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition"
        >
          {showTakeForm ? 'Cancel' : 'Add Take'}
        </button>
      </div>

      {showTakeForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-gray-800 rounded space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Take Name *
            </label>
            <input
              type="text"
              required
              value={takeData.name}
              onChange={(e) => setTakeData({...takeData, name: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Vocal Take 1, Guitar Solo v3"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Version
              </label>
              <input
                type="text"
                value={takeData.versionNumber}
                onChange={(e) => setTakeData({...takeData, versionNumber: e.target.value})}
                className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., v1, v2.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Status *
              </label>
              <select
                required
                value={takeData.status}
                onChange={(e) => setTakeData({...takeData, status: e.target.value})}
                className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
              >
                <option value="keep">Keep</option>
                <option value="maybe">Maybe</option>
                <option value="reject">Reject</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Notes
            </label>
            <textarea
              value={takeData.notes}
              onChange={(e) => setTakeData({...takeData, notes: e.target.value})}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded focus:ring-2 focus:ring-purple-500"
              rows="2"
              placeholder="Notes about this take..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition font-medium"
          >
            Add Take
          </button>
        </form>
      )}

      {!session.takes || session.takes.length === 0 ? (
        <p className="text-gray-400 text-sm">No takes yet. Click "Add Take" to record one!</p>
      ) : (
        <div className="space-y-2">
          {session.takes.map(take => (
            <div key={take.id} className="bg-gray-800 rounded p-3 border border-gray-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h5 className="text-white font-medium">{take.name}</h5>
                  {take.versionNumber && (
                    <p className="text-gray-400 text-sm">Version: {take.versionNumber}</p>
                  )}
                </div>
                <span className={`px-2 py-1 ${getStatusColor(take.status)} text-white rounded text-xs capitalize`}>
                  {take.status}
                </span>
              </div>
              {take.notes && (
                <p className="text-gray-300 text-sm mt-2">{take.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}