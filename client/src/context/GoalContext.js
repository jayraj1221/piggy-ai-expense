// src/context/GoalContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const GoalContext = createContext();

export const GoalProvider = ({ children }) => {
  const { user } = useUser();
  const [goal, setGoal] = useState(null);
  const [loadingGoal, setLoadingGoal] = useState(true);
  // Fetch current goal for child
  const fetchGoal = async () => {
    try {
      setLoadingGoal(true);
      const res = await axios.get(`/api/goals/${user._id}`);
      const latestGoal = res.data.find(g => g.status === "in progress");
      setGoal(latestGoal || null);
    } catch (err) {
      console.error("Error fetching goal:", err);
    } finally {
      setLoadingGoal(false);
    }
  };

  // Create or replace goal
  const createGoal = async (goalData) => {
    try {
      // Replace previous goal (delete or overwrite depending on your backend strategy)
      if (goal) {
        await axios.put(`/api/goals/update/${goal._id}`, {
          ...goal,
          status: "completed" // or delete if you prefer
        });
      }

      const res = await axios.post("/api/goals", {
        ...goalData,
        childId: user._id
      });

      setGoal(res.data);
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  // Refresh or update goal in state
  const refreshGoal = async () => {
    await fetchGoal();
  };

  useEffect(() => {
        if (user) fetchGoal();
  }, [user]);

  return (
    <GoalContext.Provider value={{ goal, loadingGoal, createGoal, refreshGoal }}>
      {children}
    </GoalContext.Provider>
  );
};

export const useGoal = () => useContext(GoalContext);
