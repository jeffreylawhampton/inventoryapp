import React, { useState, useEffect } from "react";
import { Link, Route, useLocation } from "react-router-dom";
import InventoryInfo from "./InventoryInfo";
import DeveloperInfo from "./DeveloperInfo";

const About = (props) => {
  const [currentView, setCurrentView] = useState("");

  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };
  let query = useQuery();

  const inventoryClickHandler = (event) => {
    setCurrentView("inventory");
  };
  const developerClickHandler = (event) => {
    setCurrentView("developer");
  };

  useEffect(() => {
    query.get("view") ? setCurrentView(query.get("view")) : setCurrentView("inventory");
  }, []);

  return (
    <>
      <div className="tab-links">
        <a
          className={currentView === "inventory" ? "active" : "inactive"}
          onClick={inventoryClickHandler}
        >
          About Inventory
        </a>
        <a
          className={currentView === "developer" ? "active" : "inactive"}
          onClick={developerClickHandler}
        >
          About the developer
        </a>
      </div>
      {!currentView || currentView === "inventory" ? (
        <InventoryInfo developerClickHandler={developerClickHandler} />
      ) : (
        <DeveloperInfo />
      )}
    </>
  );
};

export default About;
