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
import { UserProvider } from "./context/UserContext";
import { ChildProvider } from './context/ChildDetailsContext';
import { GoalProvider } from './context/GoalContext';
import Goal from './pages/Goal';
function App() {
  return (
    <UserProvider>
      <GoalProvider>
        <ChildProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/child/:id" element={<ChildDetails />} />
                <Route path="/login/parent" element={<ParentLoginPage />} />
                <Route path="/register/parent" element={<RegisterParentPage />} />
                <Route path="/login/child" element={<ChildLoginPage />} />
                <Route path="/dashboard/parent" element={<ParentDashboard />} />
                <Route path="/dashboard/child" element={<ChildDashboard />} />
                <Route path="/goal" element={<Goal />} />
                <Route path="/" element={<Home />} />
              </Routes>
            </div>
          </Router>
        </ChildProvider>
      </GoalProvider>
    </UserProvider>
  );
}

export default App;
