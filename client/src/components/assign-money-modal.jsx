import { useState } from "react";
import Button from "./button";

export default function AssignMoneyModal({ childId, parentId, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAssign = async () => {
    if (!amount || isNaN(amount)) return setMessage("Enter a valid amount.");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/ml/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId:childId, parentId:parentId, amount: Number(amount) }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Success! Pocket money assigned.");
        console.log(res)
        onSuccess(100); // Pass transaction or new balance
        onClose(); // Close modal
      } else {
        setMessage(data.message || "Failed to assign money.");
      }
    } catch (error) {
      setMessage("Error assigning money.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-xl font-semibold">Assign Pocket Money</h2>
        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {message && <p className="text-sm text-red-500">{message}</p>}
        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleAssign} disabled={loading}>
            {loading ? "Assigning..." : "Assign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
