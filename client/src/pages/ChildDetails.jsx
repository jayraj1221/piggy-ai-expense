import { useNavigate } from "react-router-dom";
import { useState, useEffect ,useCallback } from "react";
import { useChildContext } from "../context/ChildDetailsContext";
import { RefreshCw } from "lucide-react";
import axios from 'axios';
import Button from "../components/button";
import AssignMoneyModal from "../components/assign-money-modal";
import TransactionHistory from "../components/TransactionHistory";
export default function ChildDetails() {
  const { selectedChild, updateChild } = useChildContext(); 

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
  const totalCreditScore = 850;
  const monthlySpending = 0; 
  const fetchData = useCallback(async () => {
    if (!selectedChild) return;
  
    setIsRefreshing(true);
  
    try {
      console.log('User ID:', selectedChild._id); // Log the user ID
      const [transactionResponse, pocketMoneyResponse, spendingResponse] = await Promise.all([
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getTransactionHistory`, { userId: selectedChild._id }),
        axios.post(`${process.env.REACT_APP_SERVER_URL}/ml/getPocketMoneyHistory`, { userId: selectedChild._id }),
        axios.get(`${process.env.REACT_APP_SERVER_URL}/ml/getMonthlySpent`, { params: { userId: selectedChild._id } }),
      ]);
  
      console.log('Transaction Response:', transactionResponse.data);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Hi, {selectedChild?.name}!</h1>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
            <RefreshCw size={14} className="text-green-600 cursor-pointer" />
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>Assign Pocket Money</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">My Balance</p>
          <h3 className="text-xl font-bold">₹ {balance.toFixed(2)}</h3>
          <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Credit Score</p>
          <h3 className="text-xl font-bold">{creditScore}</h3>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-sm text-gray-500">Monthly Spending</p>
          <h3 className="text-xl font-bold">₹ {monthlySpending.toFixed(2)}</h3>
          <p className="text-xs text-gray-400">0% of your monthly limit</p>
        </div>
      </div>

      {/* Credit Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donut + Label */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col items-center">
          <div className="w-32 h-32 border-[10px] border-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary">
            {creditScore}
          </div>
          <p className="text-lg font-semibold mt-4">Excellent</p>
          <a href="#" className="text-sm text-gray-500 underline mt-1">
            How to Improve
          </a>
        </div>

        {/* Credit Factors */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h4 className="text-lg font-semibold mb-2">Credit Factors</h4>
          <p className="text-sm text-gray-500 mb-4">What affects your score</p>
          <div className="space-y-3">
            {[{ label: "Payment History", percent: 95, remark: "Excellent", color: "bg-cyan-500" },
              { label: "Spending Habits", percent: 70, remark: "Good", color: "bg-cyan-400" },
              { label: "Savings Rate", percent: 50, remark: "Fair", color: "bg-yellow-400" }].map(
              ({ label, percent, remark, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{label}</span>
                    <span>{remark}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div className={`${color} h-full rounded`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <section className="mb-6 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="text-sm text-gray-500">
            {isRefreshing ? "Updating..." : `Updated ${minutesSince(lastUpdated)} min ago`}
          </div>
        </div>

        <div className="flex gap-3 mb-4 text-sm">
          <button
            onClick={() => setHistory(true)}
            className={`px-3 py-1 rounded-full ${history ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600'}`}
          >
            Spend Money
          </button>

          <button
            onClick={() => setHistory(false)}
            className={`px-3 py-1 rounded-full ${!history ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600'}`}
          >
            Pocket Money
          </button>
        </div>
        <div className="overflow-y-auto">
        <TransactionHistory data={history ? transactionItems : pocketMoneyHistory} />

        </div>
      </section>


      {/* Modal */}
      {showModal && (
        <AssignMoneyModal
          childId={selectedChild._id}
          parentId={selectedChild.parentId}
          onClose={() => setShowModal(false)}
          onSuccess={(newBalance) => {
            // Update the balance with the new value
            setBalance(newBalance);

            // Optionally update the context if required
            if (updateChild) {
              updateChild({ ...selectedChild, pocketMoney: newBalance });
            }

            // Navigate one step back
            navigate(-1);  // Going back to the previous page
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