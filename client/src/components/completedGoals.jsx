import React from "react";
import { Trophy, Calendar, Sparkles, BadgeCheck } from "lucide-react";

const completedGoals = ({ completedGoals }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date available";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!completedGoals || completedGoals.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Trophy size={22} className="mr-2" />
          Your Achievements
        </h2>
        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm">
          {completedGoals.length} goal{completedGoals.length !== 1 ? 's' : ''} completed
        </div>
      </div>
      
      <div className="p-4 grid gap-4 md:grid-cols-2">
        {completedGoals.map((goal) => (
          <div 
            key={goal._id} 
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-purple-100 hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3"></div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center">
                    {goal.title}
                    <BadgeCheck size={18} className="ml-1 text-purple-500" />
                  </h3>
                  <p className="text-purple-700 font-medium mt-1">
                    {formatCurrency(goal.targetAmount)}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-2 flex items-center justify-center">
                  <Sparkles size={18} className="text-purple-600" />
                </div>
              </div>
              
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-1" />
                <span>Completed on {formatDate(goal.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default completedGoals;