import { useState } from "react";
import Button from "./button";
import AssignMoneyModal from "./assign-money-modal";
import { useNavigate } from "react-router-dom";
import { useChildContext } from "../context/ChildDetailsContext"; 

export default function ChildCard({ child, parentId, onMoneyAssigned }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setChildDetails } = useChildContext(); 

  const { name, pocketMoney, creditScore, _id } = child;
  const totalCreditScore = 850;
  const progress = (creditScore / totalCreditScore) * 100;

  const handleViewDetails = () => {
    setChildDetails(child); // ✅ Set selected child in context
    navigate(`/child/${_id}`);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-semibold">{name}</h4>
        </div>
      </div>
      <p className="text-sm">
        <span className="text-gray-600">Current Balance: </span>
        <span className="font-semibold">{(pocketMoney || 0).toFixed(2)}</span>
      </p>
      <p className="text-sm text-gray-600">Credit Score: {creditScore}</p>
      <div className="h-2 w-full bg-gray-200 rounded">
        <div
          className="bg-primary h-full rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{progress.toFixed(2)}% complete</span>
        <Button size="sm" onClick={() => setShowModal(true)}>Add Money</Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={handleViewDetails} 
      >
        View Details
      </Button>

      {showModal && (
        <AssignMoneyModal
          childId={_id}
          parentId={parentId}
          onClose={() => setShowModal(false)}
          onSuccess={onMoneyAssigned}
        />
      )}
    </div>
  );
}
