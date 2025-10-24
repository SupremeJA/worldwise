import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {
  Homepage,
  Product,
  Pricing,
  PageNotFound,
  AppLayout,
  Login,
} from "./pages";
import CityList from "./component/CityList";
import City from "./component/City";
import CountryList from "./component/CountryList";
import Form from "./component/Form";
import { CitiesProvider } from "./context/CitiesContext";
import { AuthProvider } from "./context/FakeAuthContext";

// import "./index.css";

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<Homepage />} />
            <Route path="product" element={<Product />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="app" element={<AppLayout />}>
              <Route index element={<Navigate replace to="cities" />} />
              <Route path="cities" element={<CityList />} />
              <Route path="cities/:id" element={<City />} />
              <Route path="countries" element={<CountryList />} />
              <Route path="form" element={<Form />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
