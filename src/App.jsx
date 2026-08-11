import ComparePage from "./pages/ComparePage";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ListingPage from "./pages/ListingPage";
import DetailPage from "./pages/DetailPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<ListingPage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </>
  );
}

export default App;