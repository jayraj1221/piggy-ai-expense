import { createContext, useContext, useState } from "react";

// Create context
const ChildContext = createContext();

// Create a custom hook to use the ChildContext
export const useChildContext = () => {
  return useContext(ChildContext);
};

// Create a provider component
export const ChildProvider = ({ children }) => {
  const [childList, setChildList] = useState([]); // To store the entire list of children
  const [selectedChild, setSelectedChild] = useState(null); // To store the selected child

  const setChildrenList = (children) => {
    setChildList(children); // Set the whole child array
  };

  const setChildDetails = (child) => {
    setSelectedChild(child); // Set a specific child for viewing details
  };

  const clearChildDetails = () => {
    setSelectedChild(null); // Clear the selected child
  };

  return (
    <ChildContext.Provider
      value={{
        childList,
        selectedChild,
        setChildrenList,
        setChildDetails,
        clearChildDetails,
      }}
    >
      {children}
    </ChildContext.Provider>
  );
};
