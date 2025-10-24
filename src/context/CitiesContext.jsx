import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: JSON.parse(localStorage.getItem("cities")) || [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      localStorage.setItem("cities", JSON.stringify(action.payload));
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case "cities/created":
      const newCities = [...state.cities, action.payload];
      localStorage.setItem("cities", JSON.stringify(newCities));
      return {
        ...state,
        isLoading: false,
        cities: newCities,
      };

    case "cities/deleted":
      const updatedCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      localStorage.setItem("cities", JSON.stringify(updatedCities));
      return {
        ...state,
        isLoading: false,
        cities: updatedCities,
        currentCity: {},
      };

    case "rejected":
      return { ...state, isLoading: false, error: action.payload };

    default:
      throw new Error("Unknow action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (error) {
        dispatch({ type: "rejected", payload: error.message });
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });

      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });

      await fetch(`${BASE_URL}/cities`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  return context;
}
export { CitiesProvider, useCities };
