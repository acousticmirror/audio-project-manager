'use client'

import { useState } from 'react';

export default function SessionDetail({ session, onBack, onAddTake, onDeleteTake }) {
  const [showTakeForm, setShowTakeForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [takeData, setTakeData] = useState({
    name: '',
    versionNumber: '',
    notes: '',
    status: 'keep',
    fileUrl: null
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.fileUrl) {
        setTakeData({...takeData, fileUrl: data.fileUrl});
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

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
      status: 'keep',
      fileUrl: null
    });
    setShowTakeForm(false);
  };

  const handleDelete = async (takeId) => {
    if (!confirm('Are you sure you want to delete this take? This cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/takes/${takeId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        onDeleteTake(takeId);
      } else {
        alert('Failed to delete take');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete take');
    }
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
              Audio File (WAV, MP3, OGG recommended)
            </label>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="w-full px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
            />
            {uploading && <p className="text-blue-400 text-sm mt-1">Uploading...</p>}
            {takeData.fileUrl && <p className="text-green-400 text-sm mt-1">✓ File uploaded</p>}
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
            disabled={uploading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition font-medium disabled:opacity-50"
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
                <div className="flex-1">
                  <h5 className="text-white font-medium">{take.name}</h5>
                  {take.versionNumber && (
                    <p className="text-gray-400 text-sm">Version: {take.versionNumber}</p>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-1 ${getStatusColor(take.status)} text-white rounded text-xs capitalize`}>
                    {take.status}
                  </span>
                  <button
                    onClick={() => handleDelete(take.id)}
                    className="text-red-400 hover:text-red-300 text-sm px-2 py-1 hover:bg-red-900/20 rounded transition"
                    title="Delete take"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              {take.notes && (
                <p className="text-gray-300 text-sm mt-2">{take.notes}</p>
              )}
              {take.fileUrl && (
                <div className="mt-3">
                  <audio controls className="w-full h-10">
                    <source src={take.fileUrl} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
