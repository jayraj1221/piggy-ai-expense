import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useChildContext } from "../context/ChildDetailsContext";
import { RefreshCw, TrendingUp, CreditCard, Wallet, ArrowLeft } from "lucide-react";
import axios from 'axios';
import Button from "../components/button";
import AssignMoneyModal from "../components/assign-money-modal";
import TransactionHistory from "../components/TransactionHistory";


export default function ChildDetails() {
  const { selectedChild, updateChild, setChildDetails } = useChildContext();
  const navigate = useNavigate();

  const [totalSpending, setTotalSpending] = useState(0);
  const [transactionItems, setTransactionItems] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [pocketMoneyHistory, setPocketMoneyHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [history, setHistory] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [balance, setBalance] = useState(selectedChild?.pocketMoney || 0);

  const creditScore = selectedChild?.creditScore || 0;
  const monthlySpending = totalSpending || 0;
  const { id } = useParams();

  useEffect(() => {

    if (!selectedChild) {
      const fetchChildDetails = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_SERVER_URL}/auth/get-user`,
            { userId: id }
          );
          setChildDetails(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchChildDetails(); 
    }
  }, []);



  const fetchData = useCallback(async () => {

    if (!selectedChild) {
      return;
    };

    setIsRefreshing(true);

    try {
      const [transactionResponse, pocketMoneyResponse, spendingResponse] = await Promise.all([
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getTransactionHistory`, { userId: id }),
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getPocketMoneyHistory`, { userId: id }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/ml/getMonthlySpent`, { params: { userId: id } }),
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
  }, [selectedChild]);

  useEffect(() => {
    if (selectedChild) {
      fetchData();
    }
  }, [selectedChild, fetchData]);

  useEffect(() => {
    setBalance(selectedChild?.pocketMoney || 0);
  }, [selectedChild]);

  const handleRefresh = () => {
    fetchData();
  };

  // Helper function to determine credit score rating
  const getCreditRating = (score) => {
    if (score >= 75) return { text: "Excellent", color: "text-emerald-500" };
    if (score >= 65) return { text: "Very Good", color: "text-cyan-500" };
    if (score >= 55) return { text: "Good", color: "text-blue-500" };
    if (score >= 45) return { text: "Fair", color: "text-yellow-500" };
    return { text: "Poor", color: "text-red-500" };
  };

  const creditRating = getCreditRating(creditScore);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none text-gray-500"
            title="Refresh data"
          >
            <RefreshCw size={20} className={isRefreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{selectedChild?.name}</h1>

          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition shadow-sm"
          >
            Assign Pocket Money
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Wallet size={22} className="text-blue-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Balance</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">₹ {balance.toFixed(2)}</h3>
            <p className="text-xs text-gray-400 mt-2 flex items-center">
              <RefreshCw size={12} className="mr-1" />
              Updated {minutesSince(lastUpdated)} min ago
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-emerald-50">
                <TrendingUp size={22} className="text-emerald-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Credit Score</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">
              {creditScore} <span className={`text-lg ${creditRating.color}`}>({creditRating.text})</span>
            </h3>
            <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"
                style={{ width: `${creditScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <CreditCard size={22} className="text-purple-500" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Weekly Spending</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">₹ {monthlySpending.toFixed(2)}</h3>
            <p className="text-xs text-gray-400 mt-2">
              {balance > 0 ? `${Math.round((monthlySpending / balance) * 100)}% of your balance` : '0% of your balance'}
            </p>
          </div>
        </div>

        {/* Credit Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Credit Score Circle */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-6 text-gray-800">Credit Health</h4>
            <div className="flex flex-col items-center">
              <div className="relative w-44 h-44 mb-4">
                <div className="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
                <div
                  className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-emerald-500 border-r-blue-500 border-b-yellow-500 border-l-cyan-500"
                  style={{ transform: `rotate(${creditScore * 3.6}deg)` }}
                ></div>
                <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold text-gray-800">{creditScore}</span>
                  <span className={`text-sm font-medium ${creditRating.color}`}>{creditRating.text}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center max-w-xs">
                Your credit score is calculated based on your payment history and spending habits
              </p>

            </div>
          </div>

          {/* Credit Factors */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Credit Factors</h4>
            <p className="text-sm text-gray-500 mb-6">What affects your score</p>
            <div className="space-y-5">
              {[
                { label: "Payment History", percent: 95, remark: "Excellent", color: "bg-emerald-500" },
                { label: "Spending Habits", percent: 70, remark: "Good", color: "bg-blue-500" },
                { label: "Savings Rate", percent: 50, remark: "Fair", color: "bg-yellow-500" }
              ].map(
                ({ label, percent, remark, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">{label}</span>
                      <span className={
                        remark === "Excellent" ? "text-emerald-500" :
                          remark === "Good" ? "text-blue-500" :
                            remark === "Fair" ? "text-yellow-500" : "text-gray-500"
                      }>{remark}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`${color} h-full rounded-full`} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Pro tip:</span> Setting up automatic payments can improve your credit score!
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <div className="text-sm text-gray-500 flex items-center">
              {isRefreshing ?
                <span className="flex items-center"><RefreshCw size={14} className="animate-spin mr-1" /> Updating...</span> :
                `Updated ${minutesSince(lastUpdated)} min ago`
              }
            </div>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setHistory(true)}
              className={`px-4 py-2 rounded-lg font-medium transition ${history
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
            >
              Spend Money
            </button>

            <button
              onClick={() => setHistory(false)}
              className={`px-4 py-2 rounded-lg font-medium transition ${!history
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
            >
              Pocket Money
            </button>
          </div>

          <div className="overflow-y-auto max-h-80 rounded-lg border border-gray-100">
            <TransactionHistory data={history ? transactionItems : pocketMoneyHistory} />
          </div>
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <AssignMoneyModal
          childId={selectedChild._id}
          parentId={selectedChild.parentId}
          onClose={() => setShowModal(false)}
          onSuccess={(newBalance) => {
            setBalance(newBalance);
            if (updateChild) {
              updateChild({ ...selectedChild, pocketMoney: newBalance });
            }
            setShowModal(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

function minutesSince(date) {
  const now = new Date();
  const diffMs = now - date;
  return Math.floor(diffMs / 60000);
}