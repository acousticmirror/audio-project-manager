'use client'

import { useState, useEffect } from 'react';
import { SignOutButton, useUser } from '@clerk/nextjs';
import ProjectDetail from './ProjectDetail';

export default function Home() {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    status: 'in-progress',
    notes: ''
  });

  // Load projects from database
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          startDate: new Date().toLocaleDateString()
        })
      });
      const newProject = await response.json();
      setProjects([newProject, ...projects]);
      setFormData({ name: '', client: '', status: 'in-progress', notes: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const handleAddSession = async (sessionData) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      const newSession = await response.json();
      
      // Update the selected project with the new session
      const updatedProject = {
        ...selectedProject,
        sessions: [...(selectedProject.sessions || []), newSession]
      };
      setSelectedProject(updatedProject);
      
      // Update projects list
      setProjects(projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      ));
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => {
          setSelectedProject(null);
          fetchProjects(); // Refresh projects when going back
        }}
        onAddSession={handleAddSession}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-700 p-8 flex items-center justify-center">
        <p className="text-white text-xl">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-700 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Audio Project Manager
            </h1>
            <p className="text-gray-200">
              Track your audio projects, sessions, and takes all in one place.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-white text-sm">
                {user.firstName || user.emailAddresses[0].emailAddress}
              </div>
            )}
            <SignOutButton>
              <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>
        
        <div className="bg-gray-600 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Your Projects</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              {showForm ? 'Cancel' : 'New Project'}
            </button>
          </div>
          
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-700 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Album Recording, Podcast Episode 5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Band Name, Client Name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="mixing">Mixing</option>
                  <option value="mastering">Mastering</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Project notes, goals, or details..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition font-medium"
              >
                Create Project
              </button>
            </form>
          )}
          
          {projects.length === 0 ? (
            <p className="text-gray-200">No projects yet. Click "New Project" to get started!</p>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <div 
                  key={project.id} 
                  onClick={() => setSelectedProject(project)}
                  className="bg-gray-700 border border-gray-500 rounded-lg p-4 hover:shadow-md hover:border-blue-500 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                      {project.status}
                    </span>
                  </div>
                  {project.client && (
                    <p className="text-gray-200 mb-1">Client: {project.client}</p>
                  )}
                  <p className="text-gray-300 text-sm mb-2">Started: {project.startDate}</p>
                  <p className="text-gray-400 text-sm">
                    {project.sessions?.length || 0} session{project.sessions?.length !== 1 ? 's' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}