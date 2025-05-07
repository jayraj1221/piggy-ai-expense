import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import TransactionHistory from '../../components/TransactionHistory';
import AddTransation from '../../components/addTransaction';
import axios from 'axios';
import { 
  RefreshCw, 
  Wallet, 
  TrendingUp, 
  CreditCard, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  DollarSign,
  Award,
  PieChart,
  AlertCircle,
  Plus,
  LogOut
} from 'lucide-react';
import { Logo } from '../../components/logo';
import { useNavigate } from 'react-router-dom';

export default function ChildDashboard() {
  const { user, loading ,logout} = useUser();
  const [transactionItems, setTransactionItems] = useState([]);
  const [pocketMoneyHistory, setPocketMoneyHistory] = useState([]);
  const [history, setHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [totalSpending, setTotalSpending] = useState(0);
  const [expandedSection, setExpandedSection] = useState('activity');
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!user) return;
  
    setIsRefreshing(true);
  
    try {
      const [transactionResponse, pocketMoneyResponse, spendingResponse] = await Promise.all([
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getTransactionHistory`, { userId: user._id }),
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getPocketMoneyHistory`, { userId: user._id }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/ml/getMonthlySpent`, { params: { userId: user._id } }),
      ]);
  
      setTransactionItems(Array.isArray(transactionResponse.data) ? transactionResponse.data : []);
      setPocketMoneyHistory(Array.isArray(pocketMoneyResponse.data) ? pocketMoneyResponse.data : []);
      setTotalSpending(spendingResponse.data.totalSpent || 0);
  
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      fetchData();
    }else{
      navigate('/')
    }
  }, [user, fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleTransactionSuccess = () => {
    setAddModalOpen(false);
    fetchData();
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate spending percentages for the donut chart
  const spendingPercent = totalSpending > 0 
    ? Math.min(Math.round((totalSpending / (user.pocketMoney || 1)) * 100), 100)
    : 0;
  
  const remainingPercent = 100 - spendingPercent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
<div className="bg-white shadow-sm sticky top-0 z-10">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Logo variant="nidvfnf" className="h-8 w-auto" />
        <h1 className="ml-3 text-xl font-semibold text-gray-800 hidden sm:block">MyFinance</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
          <div className="h-8 w-8 rounded-full bg-secondary text-white flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-700">{user.name}</span>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none text-gray-500"
          title="Refresh data"
        >
          <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
        
        <button
          onClick={()=>{
            logout()
            navigate('/')
          }}
          className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          title="Logout"
        >
          <LogOut size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  </div>
</div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
            <span className="text-sm text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <p className="text-gray-600">Here's an overview of your finances today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          <QuickAction 
            icon={<Plus />}
            label="Add Expense"
            onClick={() => setAddModalOpen(true)}
            bgColor="bg-green-500"
          />
          <QuickAction 
            icon={<TrendingUp />}
            label="Goals"
            onClick={() => navigate('/goal')}
            bgColor="bg-blue-500"
          />
        </div>

        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            icon={<Wallet className="text-green-500" size={24} />}
            title="My Balance"
            value={`₹ ${user.pocketMoney.toLocaleString() || 0}`}
            subtitle={`Available to spend`}
            trend={`+₹150 this week`}
            trendUp={true}
          />
          <Card
            icon={<Award className="text-blue-500" size={24} />}
            title="Credit Score"
            value={user.creditScore || 0}
            subtitle={user.creditScore > 700 ? 'Excellent' : user.creditScore > 500 ? 'Good' : 'Build it up!'}
            trend={user.creditScore > 700 ? '+15 points this month' : 'Keep improving!'}
            trendUp={user.creditScore > 700}
          />
          <Card
            icon={<CreditCard className="text-purple-500" size={24} />}
            title="Monthly Spending"
            value={`₹ ${totalSpending.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            subtitle={`${Math.round((totalSpending / (user.pocketMoney || 1)) * 100)}% of limit`}
            trend={`${totalSpending > user.pocketMoney * 0.8 ? 'Near limit' : 'Good spending'}`}
            trendUp={totalSpending <= user.pocketMoney * 0.8}
          />
        </div>

        {/* Collapsible Sections */}
        <div className="mb-8">
          <CollapsibleSection 
            title="Spending Overview Weekly" 
            isExpanded={expandedSection === 'spending'} 
            onToggle={() => toggleSection('spending')}
            icon={<PieChart size={20} className="text-purple-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Monthly Budget</h3>
                <div className="flex items-center justify-center">
                  <DonutChart 
                    spent={spendingPercent} 
                    remaining={remainingPercent} 
                    amount={totalSpending} 
                    total={user.pocketMoney || 0} 
                  />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Spending Categories</h3>
                <CategoryBar label="Food" percent={35} color="bg-green-500" />
                <CategoryBar label="Entertainment" percent={25} color="bg-blue-500" />
                <CategoryBar label="Transport" percent={15} color="bg-yellow-500" />
                <CategoryBar label="Shopping" percent={20} color="bg-purple-500" />
                <CategoryBar label="Others" percent={5} color="bg-gray-500" />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection 
            title="Credit Score" 
            isExpanded={expandedSection === 'credit'} 
            onToggle={() => toggleSection('credit')}
            icon={<Award size={20} className="text-blue-500" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Credit Score</h3>
                <div className="flex items-center space-x-6 justify-center">
                  <div>
                    <CreditRing score={user.creditScore || 0} max={100} />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 font-semibold">
                      {user.creditScore >= 75
                        ? 'Excellent'
                        : user.creditScore >= 50
                          ? 'Good'
                          : 'Needs Work'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${user.creditScore}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Your score is in the top {100-user.creditScore}% of users</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Credit Factors</h3>
                <p className="text-sm text-gray-500 mb-4">What affects your score</p>
                <Factor label="Payment History" level="Excellent" percent={95} />
                <Factor label="Spending Habits" level="Good" percent={75} />
                <Factor label="Savings Rate" level="Fair" percent={55} color="yellow" />
                <Factor label="Financial Goals" level="Good" percent={70} />
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex">
                    <AlertCircle size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700">
                      Improve your score by setting up regular savings and completing your financial goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection 
            title="Recent Activity" 
            isExpanded={expandedSection === 'activity'} 
            onToggle={() => toggleSection('activity')}
            icon={<Clock size={20} className="text-green-500" />}
          >
            <div className="bg-white shadow-sm rounded-xl p-6">
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setHistory(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    history 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Expenses
                </button>

                <button
                  onClick={() => setHistory(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    !history 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pocket Money
                </button>
              </div>

              <TransactionHistory data={history ? transactionItems : pocketMoneyHistory} />
            </div>
          </CollapsibleSection>
        </div>

        {/* Financial Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-blue-100 mb-8">
          <div className="flex items-start">
            <div className="mr-4 bg-white p-2 rounded-lg">
              <AlertCircle size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Financial Tip of the Day</h3>
              <p className="text-blue-700">
                Try the 50/30/20 rule: Spend 50% on needs, 30% on wants, and save 20% of your pocket money 
                to build good financial habits early.
              </p>
              <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800">
                See more tips →
              </button>
            </div>
          </div>
        </div>
      </div>

      {isAddModalOpen && user && (
        <AddTransation
          isOpen={isAddModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={handleTransactionSuccess}
        />
      )}
    </div>
  );
}

function QuickAction({ icon, label, onClick, bgColor = "bg-green-500" }) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} text-white rounded-xl p-4 flex flex-col items-center justify-center hover:opacity-90 transition-opacity shadow-sm`}
    >
      <div className="bg-white bg-opacity-20 p-2 rounded-lg mb-2">
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Card({ icon, title, value, subtitle, trend, trendUp = true }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-gray-50 p-2 rounded-lg">
          {icon}
        </div>
        <span className="text-xs text-gray-500">This month</span>
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
      <div className={`flex items-center mt-2 text-xs ${trendUp ? 'text-green-600' : 'text-orange-600'}`}>
        {trendUp ? (
          <ChevronUp size={16} />
        ) : (
          <ChevronDown size={16} />
        )}
        <span>{trend}</span>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, isExpanded, onToggle, icon }) {
  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
      >
        <div className="flex items-center">
          {icon}
          <h3 className="text-lg font-semibold ml-2">{title}</h3>
        </div>
        <div className="text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="p-5 pt-0 border-t">
          {children}
        </div>
      </div>
    </div>
  );
}

function Factor({ label, level, percent, color = 'green' }) {
  const colorMap = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className={`${
          level === 'Excellent' ? 'text-green-600' : 
          level === 'Good' ? 'text-blue-600' : 
          'text-yellow-600'
        }`}>{level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorMap[color]} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function CategoryBar({ label, percent, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{percent}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full`}
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}

function CreditRing({ score = 0, max = 100 }) {
  const radius = 70;
  const stroke = 10;
  const normalizedScore = Math.min(score, max);
  const circumference = 2 * Math.PI * radius;
  const progress = (normalizedScore / max) * circumference;
  const offset = circumference - progress;
  const size = radius * 2 + stroke * 2;
  const center = size / 2;

  // Calculate color based on score
  const getColor = () => {
    if (score >= 75) return "#22C55E"; // Green
    if (score >= 50) return "#3B82F6"; // Blue
    return "#F59E0B"; // Yellow/Orange
  };

  return (
    <svg width={size} height={size}>
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#E5E7EB"
        strokeWidth={stroke}
        fill="none"
      />
      {/* Rotated progress ring */}
      <g transform={`rotate(-90 ${center} ${center})`}>
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor()}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </g>
      {/* Text remains upright */}
      <text
        x="50%"
        y="50%"
        dy="0.35em"
        textAnchor="middle"
        className="fill-current font-bold"
        style={{ fill: getColor() }}
        fontSize="28"
      >
        {score}
      </text>
    </svg>
  );
}

function DonutChart({ spent, remaining, amount, total }) {
  const dashArray = 2 * Math.PI * 40;
  const dashOffset = dashArray * (1 - spent / 100);

  return (
    <div className="relative">
      <svg width="200" height="200" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="#E5E7EB" 
          strokeWidth="10" 
        />
        
        {/* Progress circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill="none" 
          stroke="#22C55E" 
          strokeWidth="10" 
          strokeDasharray={dashArray} 
          strokeDashoffset={dashOffset} 
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className={spent > 90 ? "stroke-red-500" : spent > 70 ? "stroke-yellow-500" : "stroke-green-500"}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold">{spent}%</p>
        <p className="text-sm text-gray-500">of budget spent</p>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm">
        <div>
          <p className="text-gray-500">Spent</p>
          <p className="font-semibold">₹ {amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Remaining</p>
          <p className="font-semibold">₹ {(total - amount).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    </div>
  );
}