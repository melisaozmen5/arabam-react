import { useState } from "react";
import { Link } from "react-router-dom";
import formatPrice from "../utils/formatPrice";

function VehicleCard({ vehicle }) {
  const vehicleId = String(vehicle.id);

  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites =
      JSON.parse(localStorage.getItem("favoriteCars")) || [];

    return favorites.some(
      (favoriteVehicle) =>
        String(favoriteVehicle.id) === vehicleId
    );
  });

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const favorites =
      JSON.parse(localStorage.getItem("favoriteCars")) || [];

    const alreadyFavorite = favorites.some(
      (favoriteVehicle) =>
        String(favoriteVehicle.id) === vehicleId
    );

    let updatedFavorites;

    if (alreadyFavorite) {
      updatedFavorites = favorites.filter(
        (favoriteVehicle) =>
          String(favoriteVehicle.id) !== vehicleId
      );
    } else {
      updatedFavorites = [...favorites, vehicle];
    }

    localStorage.setItem(
      "favoriteCars",
      JSON.stringify(updatedFavorites)
    );

    setIsFavorite(!alreadyFavorite);
  };

  return (
    <Link
      to={`/detail/${vehicle.id}`}
      className="vehicle-card-link"
    >
      <article className="vehicle-card">
        <img
          className="vehicle-card-image"
          src={vehicle.photo?.replace("{0}", "580x435")}
          alt={vehicle.title}
        />

        <button
          type="button"
          className={`favorite-button ${
            isFavorite ? "favorite-button-active" : ""
          }`}
          onClick={handleFavoriteClick}
          aria-label={
            isFavorite
              ? "Favorilerden çıkar"
              : "Favorilere ekle"
          }
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <div className="vehicle-card-content">
          <div className="vehicle-meta">
            <strong>{vehicle.modelName}</strong>
            <span>{vehicle.dateFormatted}</span>
          </div>

          <p className="vehicle-location">
            {vehicle.location?.cityName} /{" "}
            {vehicle.location?.townName}
          </p>

          <h2>{vehicle.title}</h2>

          <p className="vehicle-price">
            {formatPrice(vehicle.price)}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default VehicleCard;