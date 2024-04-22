import React from 'react';

const LocationContext = React.createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] =  React.useState(null);

  const changeLocation = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, changeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  return  React.useContext(LocationContext);
};