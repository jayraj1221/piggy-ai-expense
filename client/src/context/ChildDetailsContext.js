import { createContext, useContext, useState } from "react";

const ChildContext = createContext();

export const useChildContext = () => {
  return useContext(ChildContext);
};

export const ChildProvider = ({ children }) => {
  const [childList, setChildList] = useState([]); 
  const [selectedChild, setSelectedChild] = useState(null); 

  const setChildrenList = (children) => {
    setChildList(children); 
  };

  const setChildDetails = (child) => {
    setSelectedChild(child); 
  };

  const clearChildDetails = () => {
    setSelectedChild(null); 
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
