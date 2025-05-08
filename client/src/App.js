import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import ChildLoginPage from './pages/login/child';
import ParentLoginPage from './pages/login/parent';
import RegisterParentPage from './pages/register/parent';
import ParentDashboard from './pages/dashboards/parentDashboard';
import ChildDashboard from './pages/dashboards/childDashboard';
import ChildDetails from './pages/ChildDetails';
import Goal from './pages/Goal';
import ActivityReward from './pages/ActivityReward';

import { UserProvider } from './context/UserContext';
import { ChildProvider } from './context/ChildDetailsContext';

import ProtectedRoute from './pages/ProtectedRoute'; 

function App() {
  return (
    <UserProvider>
      <ChildProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/child/:id" element={
                  <ProtectedRoute>
                    <ChildDetails />
                  </ProtectedRoute>
                } />
              <Route path="/login/parent" element={<ParentLoginPage />} />
              <Route path="/register/parent" element={<RegisterParentPage />} />
              <Route path="/login/child" element={<ChildLoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard/parent"
                element={
                  <ProtectedRoute>
                    <ParentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/child"
                element={
                  <ProtectedRoute>
                    <ChildDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/goal" element={
                  <ProtectedRoute>
                    <Goal />
                  </ProtectedRoute>
                } />
              <Route path="/activity-reward" element={
                  <ProtectedRoute>
                    <ActivityReward />
                  </ProtectedRoute>
                } />
              <Route path="/" element={<Home />} />
            </Routes>
          </div>
        </Router>
      </ChildProvider>
    </UserProvider>
  );
}

export default App;
