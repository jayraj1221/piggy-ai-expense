import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, Target, Trophy, Sparkles, TrendingUp } from "lucide-react";
import { useUser } from '../context/UserContext';
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CompletedGoals from "../components/completedGoals"; 

const Goal = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState(null);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [money, setMoney] = useState(0);
  const [error, setError] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [newGoal, setNewGoal] = useState({
    userId: user?.id,
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    status: "In Progress",
    deadline: ""
  });

  const token = localStorage.getItem("token");

  const fetchGoal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/auth/get-current-goal`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Current goal response:", response.data);

      if (response.data.message === "No current goals found") {
        setGoal(null);
      } else {
        setGoal(response.data.goals[0]);
        
        // Generate progress data based on current amount and target
        generateProgressData(response.data.goals[0]);
      }
      
      // Fetch completed goals
      const completedResponse = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/auth/get-goals`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (completedResponse.data.goals) {
        setCompletedGoals(completedResponse.data.goals);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  // Generate progress data for the chart
  const generateProgressData = (goalData) => {
    if (!goalData) return;
    
    const { currentAmount, targetAmount } = goalData;
    const data = [];
    
    // Create data points for the chart
    // Starting point
    data.push({ name: 'Start', amount: 0 });
    
    // Current progress
    data.push({ name: 'Current', amount: currentAmount });
    
    // Target
    data.push({ name: 'Target', amount: targetAmount });
    
    // Projection based on current progress
    if (currentAmount > 0) {
      const projectedAmount = Math.min(currentAmount * 1.5, targetAmount);
      data.push({ name: 'Projected', amount: projectedAmount });
    }
    
    setProgressData(data);
  };

  useEffect(() => {
    fetchGoal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/auth/set-goal`,
        {
          "title": newGoal.title,
          "targetAmount": newGoal.targetAmount,
          "currentAmount": newGoal.currentAmount,
          "deadline": newGoal.deadline,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGoal(response.data.goal);
      generateProgressData(response.data.goal);
      setShowAddModal(false);
    } catch (error) {
      console.error("Error setting goal:", error);
      alert("Error setting goal. Please try again.");
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!money || money <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (user.pocketMoney < money) {
      setError("You don't have enough pocket money");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/auth/update-goal`,
        {
          "goalId": goal._id,
          "money": money
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGoal(response.data.goal);
      generateProgressData(response.data.goal);
      setShowAddMoneyModal(false);
      setMoney(0);
      
      // If goal is now completed, refresh to get updated list
      if (response.data.goal.status === "Completed") {
        fetchGoal();
      }
    } catch (err) {
      console.error("Error adding money:", err);
      setError("Failed to add money. Please try again.");
    }
  };

  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No deadline set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const openAddModal = () => {
    if (goal) {
      setNewGoal({
        userId: user?.id,
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        status: goal.status,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ""
      });
    } else {
      setNewGoal({
        userId: user?.id,
        title: "",
        targetAmount: 0,
        currentAmount: 0,
        status: "In Progress",
        deadline: ""
      });
    }
    setShowAddModal(true);
  };

  const openAddMoneyModal = () => {
    setMoney(0);
    setError("");
    setShowAddMoneyModal(true);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-secondary font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your goals...</p>
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
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {goal ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {/* Goal Header */}
            <div className="bg-secondary p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{goal.title}</h2>
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${goal.status === "Completed" ? "bg-green-500" : "bg-white text-secondary"
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
              {/* Progress Graph */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <TrendingUp size={20} className="text-secondary mr-2" />
                  <h3 className="text-lg font-semibold">Savings Progress</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div style={{ height: "250px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={progressData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis 
                          tickFormatter={(value) => new Intl.NumberFormat('en-IN', { 
                            notation: 'compact',
                            compactDisplay: 'short',
                            currency: 'INR'
                          }).format(value)}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="amount" 
                          stroke="#4f46e5" 
                          strokeWidth={2} 
                          dot={{ r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{calculateProgress(goal.currentAmount, goal.targetAmount).toFixed(0)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-secondary h-2.5 rounded-full" 
                        style={{ width: `${calculateProgress(goal.currentAmount, goal.targetAmount)}%` }}
                      ></div>
                    </div>
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
                <button
                  onClick={openAddMoneyModal}
                  className="w-full p-3 bg-secondary text-white rounded-lg font-medium flex items-center justify-center"
                >
                  <Plus size={20} className="mr-2" /> Add Pocket Money to Goal
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
            <div className="mb-6">
              <Target size={64} className="mx-auto text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Goal Set</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You don't have any financial goals yet. Setting a goal helps you track your savings progress.
            </p>
            <button
              onClick={openAddModal}
              className="px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90 mx-auto"
            >
              <Plus size={20} className="inline mr-2" /> Set a Financial Goal
            </button>
          </div>
        )}

        {/* Completed Goals Section */}
        <CompletedGoals completedGoals={completedGoals} />
      </div>

      {/* Add/Edit Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold">{goal ? "Edit Your Financial Goal" : "Set Your Financial Goal"}</h3>
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
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
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
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
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
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: Number(e.target.value) })}
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
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
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
                  {goal ? "Update Goal" : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-xl font-bold">Add Money to Your Goal</h3>
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMoney} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How much would you like to add? (₹)
                  </label>
                  <input
                    type="number"
                    value={money}
                    onChange={(e) => setMoney(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-secondary focus:border-secondary"
                    placeholder="Enter amount"
                    min="1"
                    max={user?.pocketMoney || 0}
                    required
                  />
                </div>

                {user && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Available pocket money: <span className="font-bold">{formatCurrency(user.pocketMoney)}</span>
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Goal progress:</span> {formatCurrency(goal?.currentAmount || 0)} of {formatCurrency(goal?.targetAmount || 0)}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    After this contribution: <span className="font-bold">{formatCurrency((goal?.currentAmount || 0) + (money || 0))}</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-opacity-90"
                >
                  Add to Goal
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