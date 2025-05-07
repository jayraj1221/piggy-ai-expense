import React, { useState } from "react";
import { useGoal } from "../context/GoalContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Target, AlertCircle, Calendar } from "lucide-react";

const Goal = () => {
  const { goal, addGoal, loadingGoal } = useGoal();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "0",
    status: "In Progress",
    deadline: "" 
  });

  // Handle form submission for new goal
  const handleSubmit = (e) => {
    e.preventDefault();
    addGoal({
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount || 0),
    });
    setShowAddModal(false);
    setNewGoal({
      title: "",
      targetAmount: "",
      currentAmount: "0",
      status: "In Progress",
      deadline: "" // Reset deadline
    });
  };

  // Calculate progress percentage for progress bar
  const calculateProgress = (current, target) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loadingGoal) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your goal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-2xl font-bold">Financial Goal</h1>
            </div>
            {!goal && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-secondary text-white px-5 py-2 rounded-lg font-medium flex items-center shadow hover:bg-opacity-90 transition-colors"
              >
                <Plus size={20} className="mr-1" /> Set a Goal
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {goal ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Goal Header */}
            <div className="bg-secondary p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{goal.title}</h2>
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  goal.status === "Completed" ? "bg-green-500" : "bg-white text-secondary"
                }`}>
                  {goal.status}
                </span>
                {goal.deadline && (
                  <div className="flex items-center text-white text-sm">
                    <Calendar size={16} className="mr-1" />
                    <span>Deadline: {formatDate(goal.deadline)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Goal Details */}
            <div className="p-6">
              {/* Progress Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg className="w-48 h-48">
                    <circle 
                      className="text-gray-200" 
                      strokeWidth="8" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="70" 
                      cx="96" 
                      cy="96"
                    />
                    <circle 
                      className="text-secondary" 
                      strokeWidth="8" 
                      strokeLinecap="round" 
                      stroke="currentColor" 
                      fill="transparent" 
                      r="70" 
                      cx="96" 
                      cy="96"
                      strokeDasharray="439.8"
                      strokeDashoffset={439.8 - (439.8 * calculateProgress(goal.currentAmount, goal.targetAmount)) / 100}
                      transform="rotate(-90 96 96)"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-secondary">
                      {calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500">Complete</span>
                  </div>
                </div>
              </div>
              
              {/* Financial Details */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Target</p>
                  <p className="text-xl font-bold">{formatCurrency(goal.targetAmount)}</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Saved</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(goal.currentAmount)}</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-sm text-gray-500 mb-1">Remaining</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(goal.targetAmount - goal.currentAmount)}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <button className="w-full p-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center">
                  <Plus size={20} className="mr-2" /> Add Money to Goal
                </button>
                
                <button className="w-full p-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50">
                  <Pencil size={20} className="mr-2" /> Edit Goal
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <Target size={64} className="mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Goal Set</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any financial goals yet. Setting a goal helps you track your savings progress.
            </p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90 mx-auto"
            >
              <Plus size={20} className="inline mr-2" /> Set a Financial Goal
            </button>
          </div>
        )}
        
        {/* Financial Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-5 border border-blue-100">
          <div className="flex">
            <div className="mr-4">
              <AlertCircle size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-1">Financial Tip</h3>
              <p className="text-blue-700 text-sm">
                Try to save at least 10-15% of your income regularly to reach your financial goals faster.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold">Set Your Financial Goal</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    What are you saving for?
                  </label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    placeholder="New bike, laptop, trip, etc."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much do you need? (₹)
                  </label>
                  <input
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    placeholder="10000"
                    min="1"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much have you saved already? (₹)
                  </label>
                  <input
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    When do you want to achieve this goal?
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={18} className="text-gray-500" />
                    </div>
                    <input
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goal;