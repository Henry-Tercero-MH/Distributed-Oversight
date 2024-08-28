import React, { createContext, useReducer } from "react";

// Crear el contexto
export const GlobalContext = createContext();

// Definir el estado inicial
const initialState = {
  user: null,
  readings: [],
  rfid: null,
  report: null,
};

// Reducer para manejar las acciones
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_READINGS":
      return { ...state, readings: action.payload };
    case "SET_RFID":
      return { ...state, rfid: action.payload };
    case "SET_REPORT":
      return { ...state, report: action.payload };
    default:
      return state;
  }
};

// Proveedor del contexto
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  );
};
