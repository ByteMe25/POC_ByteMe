import { createContext, useContext, useState } from "react";


const DocNameContext = createContext(null);

export const DocNameProvider = ({ children }) => {

  const [docName, setDocName] = useState(null);
  const openDocument = (name) => setDocName(name);
  const closeDocument = () => setDocName(null);

  return (
    <DocNameContext.Provider value={{ docName, openDocument, closeDocument }}>
      {children}
    </DocNameContext.Provider>
  );
};

export const useDocName = () => useContext(DocNameContext);