import React, { createContext, useState } from "react";

export const ListContext = createContext();

export const HamstersProvider = (props) => {
  const [listOfHamsters, setListOfHamsters] = useState([]);
  const [randomHamsters, setRandomHamsters] = useState([]);
 

  return (
    <ListContext.Provider
      value={{
        listOfHamsters,
        setListOfHamsters,
        randomHamsters,
        setRandomHamsters
      }}
    >
      {props.children}
    </ListContext.Provider>
  );
};
