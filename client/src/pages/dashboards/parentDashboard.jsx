import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import Button from "../../components/button";
import { Logo } from "../../components/logo";
import { useNavigate } from "react-router-dom";
import ChildCard from "../../components/child-card";
import SummaryCard from "../../components/summary-card";
import { useUser } from "../../context/UserContext";
import AddChildModal from "../../components/add-child-modal";
import { useChildContext } from "../../context/ChildDetailsContext";
export default function ParentDashboard() {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const { user, logout, loading, token } = useUser();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const {childList , setChildrenList} = useChildContext();
  const [loadingChildren, setLoadingChildren] = useState(true);

  const fetchChildren = async () => {
    try {
      const res = await fetch('http://localhost:5000/auth/get-children', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
      });

      const data = await res.json();
      if (res.ok) {
        setChildrenList(data || []);
      } else {
        console.error(data.message || 'Failed to fetch children');
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
    if (user) {
      fetchChildren();
    }
  }, [user, loading, navigate]);

  const handleChildAdded = () => {
    setAddModalOpen(false);   // close modal
    fetchChildren();          // refetch updated list
  };

  const transactions = [
    { id: 1, type: "deposit", child: "Alex", label: "Weekly Allowance", amount: 10, date: "2 days ago" },
    { id: 2, type: "withdrawal", child: "Jamie", label: "Toy Store Purchase", amount: -15.99, date: "3 days ago" },
    { id: 3, type: "deposit", child: "Jamie", label: "Chores Bonus", amount: 5, date: "5 days ago" },
  ];

  const filteredTransactions = filter === "All"
    ? transactions
    : transactions.filter((t) =>
      filter === "Deposits" ? t.amount > 0 : t.amount < 0
    );

  return (
    <div className="min-h-screen bg-gray-50 text-black p-6 space-y-8">
      {/* Navbar */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xl font-bold text-primary">
          <Logo />
        </div>
        <nav className="flex items-center gap-6">
          <a className="text-primary font-semibold underline" href="#">Dashboard</a>
          <a href="#">Transactions</a>
          <a href="#">Children</a>
          <a href="#">Settings</a>
        </nav>
        <button className="flex items-center gap-1 text-red-500" onClick={
          () => {
            logout();
            navigate('/');
          }
        }>
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Total Balance" value="$245.50" note="+$25.00 from last week" />
        <SummaryCard title="Savings Goals" value="4" note="2 goals nearly complete" />
        <SummaryCard title="Recent Activity" value="12" note="Transactions processed" />
      </section>

      {/* Children Overview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Children Overview</h2>
          <Button onClick={() => setAddModalOpen(true)}>+ Add Child</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingChildren ? (
            <p>Loading children...</p>
          ) : childList.length === 0 ? (
            <p>No children added yet.</p>
          ) : (
            childList
            ?.filter(child => child != null) // filters out null or undefined
            .map((child) => (
              <ChildCard
              key={child._id || child.id}
              child={child}  // Pass the entire child object as a prop
              parentId={user?._id || user?.id}
              onMoneyAssigned={handleChildAdded}
            />
            

            ))
          )}


        </div>
      </section>

      {/* Recent Transactions */}
      {/* <section>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="flex gap-4 mb-4">
          {["All", "Deposits", "Withdrawals"].map((type) => (
            <button
              key={type}
              className={`px-4 py-1 rounded-full border ${filter === type ? "bg-blue-100 text-primary" : "text-gray-600"
                }`}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <div className="space-y-2 bg-white rounded-lg shadow p-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex justify-between items-center border-b last:border-none py-2"
            >
              <div>
                <p className="font-medium">{tx.label}</p>
                <p className="text-sm text-gray-500">
                  {tx.child} • {tx.date}
                </p>
              </div>
              <p
                className={`font-semibold ${tx.amount >= 0 ? "text-green-600" : "text-red-500"
                  }`}
              >
                {tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline">View All Transactions</Button>
        </div>
      </section> */}

      {/* Add Child Modal */}
      {isAddModalOpen && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <AddChildModal
            isOpen={isAddModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSuccess={handleChildAdded}
            onMoneyAssigned={handleChildAdded}
          />

        </div>
      )}
    </div>
  );
}
