import { useState } from "react";
import VehicleCard from "../components/VehicleCard";

function FavoritesPage() {
  const [favoriteVehicles, setFavoriteVehicles] =
    useState(() => {
      return (
        JSON.parse(
          localStorage.getItem("favoriteCars")
        ) || []
      );
    });

  const handleClearFavorites = () => {
    localStorage.removeItem("favoriteCars");
    setFavoriteVehicles([]);
  };

  return (
    <main className="favorites-page">
      <div className="favorites-page-header">
        <div>
          <h1>Favori İlanlarım</h1>

          <p>
            {favoriteVehicles.length} favori ilanınız
            bulunuyor.
          </p>
        </div>

        {favoriteVehicles.length > 0 && (
          <button
            type="button"
            className="clear-favorites-button"
            onClick={handleClearFavorites}
          >
            Favorileri Temizle
          </button>
        )}
      </div>

      {favoriteVehicles.length === 0 ? (
        <div className="favorites-empty">
         <span>☆</span>
          <h2>Henüz favori ilanınız yok</h2>
          <p>
            Beğendiğiniz araçları yıldız simgesine
            basarak favorilerinize ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="vehicle-grid">
          {favoriteVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default FavoritesPage;