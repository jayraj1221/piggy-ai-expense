import { useState, useEffect, use } from "react";
import { LogOut } from "lucide-react";
import Button from "../../components/button";
import { Logo } from "../../components/logo";
import { useNavigate } from "react-router-dom";
import ChildCard from "../../components/child-card";
import { useUser } from "../../context/UserContext";
import AddChildModal from "../../components/add-child-modal";
import { useChildContext } from "../../context/ChildDetailsContext";

export default function ParentDashboard() {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const { user, logout, loading, token } = useUser();
  const { childList, setChildrenList } = useChildContext();
  const [loadingChildren, setLoadingChildren] = useState(true);
  const navigate = useNavigate();

  const fetchChildren = async () => {
    try {
      const res = await fetch("http://localhost:5000/auth/get-children", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setChildrenList(data || []);
      } else {
        console.error(data.message || "Failed to fetch children");
      }
    } catch (error) {
      console.error("Error fetching children:", error);
    } finally {
      setLoadingChildren(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
    if (user) {
      fetchChildren();
    }
  }, [user, loading, navigate]);

  const handleChildAdded = () => {
    setAddModalOpen(false);
    fetchChildren();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Logo />
            {/* <span>SmartSpend Parent</span> */}
          </div>
          <div className="flex items-center gap-6">
            <span className="font-medium text-gray-700">Hi, {user?.name || "Parent"}</span>
            <button
              className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-primary">
            Manage Your Children’s Smart Spending
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor activity, assign funds, and support smart financial habits.
          </p>
        </div>

        {/* Children Overview */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Children</h2>
          <Button onClick={() => setAddModalOpen(true)}>+ Add Child</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingChildren ? (
            <p className="text-gray-500">Loading children...</p>
          ) : childList.length === 0 ? (
            <p className="text-gray-600">No children added yet.</p>
          ) : (
            childList
              ?.filter((child) => child != null)
              .map((child) => (
                <div
                  key={child._id || child.id}
                  className="transition-transform duration-300 hover:scale-[1.02]"
                >
                  <ChildCard
                    child={child}
                    parentId={user?._id || user?.id}
                    onMoneyAssigned={handleChildAdded}
                  />
                </div>
              ))
          )}
        </div>
      </section>

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
