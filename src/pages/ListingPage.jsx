import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import VehicleCard from "../components/VehicleCard";

function ListingPage() {
  const [searchParams] = useSearchParams();

  const [vehicles, setVehicles] = useState([]);
  const [take, setTake] = useState(20);
  const [sortOption, setSortOption] =
    useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");

  const searchText =
    searchParams.get("q")?.trim() ?? "";

  useEffect(() => {
    const getVehicles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/v1/listing",
          {
            params: {
              skip: 0,
              take: 50,
            },
          }
        );

        setVehicles(response.data);

        console.log(
          "Listing verisi:",
          response.data
        );
      } catch (requestError) {
        console.error(
          "İlanlar alınamadı:",
          requestError
        );

        setError("İlanlar alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    getVehicles();
  }, []);

  const normalizeText = (value) => {
    return String(value ?? "")
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const getPrice = (vehicle) => {
    if (typeof vehicle.price === "number") {
      return vehicle.price;
    }

    const formattedPrice =
      vehicle.priceFormatted ??
      vehicle.price ??
      "0";

    return Number(
      String(formattedPrice).replace(
        /[^\d]/g,
        ""
      )
    );
  };

  const getDate = (vehicle) => {
    const dateValue =
      vehicle.date ??
      vehicle.createdDate ??
      vehicle.dateFormatted;

    if (!dateValue) {
      return 0;
    }

    const normalDate = new Date(dateValue);

    if (!Number.isNaN(normalDate.getTime())) {
      return normalDate.getTime();
    }

    return 0;
  };

  const getModelYear = (vehicle) => {
    if (vehicle.modelYear) {
      return Number(vehicle.modelYear);
    }

    if (vehicle.year) {
      return Number(vehicle.year);
    }

    const yearProperty =
      vehicle.properties?.find((property) => {
        const propertyName =
          property.name ??
          property.key ??
          property.label ??
          "";

        return (
          normalizeText(propertyName) === "yıl" ||
          normalizeText(propertyName) === "yil" ||
          normalizeText(propertyName) ===
            "modelyear"
        );
      });

    return Number(
      yearProperty?.value ??
        yearProperty?.text ??
        0
    );
  };

  const getVehicleSearchText = (vehicle) => {
    const propertyText = (
      vehicle.properties ?? []
    )
      .map((property) =>
        [
          property.name,
          property.label,
          property.key,
          property.value,
          property.text,
        ]
          .filter(Boolean)
          .join(" ")
      )
      .join(" ");

    return [
      vehicle.id,
      vehicle.title,
      vehicle.modelName,
      vehicle.brandName,
      vehicle.category?.name,
      vehicle.location?.cityName,
      vehicle.location?.townName,
      vehicle.location?.districtName,
      vehicle.text,
      vehicle.priceFormatted,
      getModelYear(vehicle),
      propertyText,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const displayedVehicles = useMemo(() => {
    const normalizedSearch =
      normalizeText(searchText);

    const filteredVehicles = vehicles.filter(
      (vehicle) => {
        const vehiclePrice = getPrice(vehicle);

if (
  minPrice &&
  vehiclePrice < Number(minPrice)
) {
  return false;
}

if (
  maxPrice &&
  vehiclePrice > Number(maxPrice)
) {
  return false;
}

if (!normalizedSearch) {
  return true;
}

        const vehicleSearchText =
          normalizeText(
            getVehicleSearchText(vehicle)
          );

        return vehicleSearchText.includes(
          normalizedSearch
        );
      }
    );

    const sortedVehicles = [
      ...filteredVehicles,
    ];

    sortedVehicles.sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return getPrice(a) - getPrice(b);

        case "price-desc":
          return getPrice(b) - getPrice(a);

        case "date-asc":
          return getDate(a) - getDate(b);

        case "date-desc":
          return getDate(b) - getDate(a);

        case "year-asc":
          return (
            getModelYear(a) - getModelYear(b)
          );

        case "year-desc":
          return (
            getModelYear(b) - getModelYear(a)
          );

        default:
          return 0;
      }
    });

    return sortedVehicles.slice(0, take);
  }, [
  vehicles,
  sortOption,
  take,
  searchText,
  minPrice,
  maxPrice,
]);

  if (loading) {
    return (
      <main className="page-container">
        <h2>İlanlar yükleniyor...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <h2>{error}</h2>
      </main>
    );
  }

  return (
    <main className="page-container">
      <section className="listing-top">
        <div>
          <h1>
            {searchText
              ? `"${searchText}" için sonuçlar`
              : "Vitrin"}
          </h1>

          {searchText && (
            <p className="search-result-count">
              {displayedVehicles.length} ilan
              bulundu
            </p>
          )}
        </div>

        <div className="listing-controls">
          <div className="price-filter-group">

  <label>
    Minimum Fiyat

    <input
      type="number"
      placeholder="0"
      value={minPrice}
      onChange={(event) =>
        setMinPrice(event.target.value)
      }
    />
  </label>

  <label>
    Maksimum Fiyat

    <input
      type="number"
      placeholder="5000000"
      value={maxPrice}
      onChange={(event) =>
        setMaxPrice(event.target.value)
      }
    />
  </label>

</div>
          <label>
            Sıralama

            <select
              value={sortOption}
              onChange={(event) =>
                setSortOption(
                  event.target.value
                )
              }
            >
              <option value="date-desc">
                En yeni ilanlar
              </option>

              <option value="date-asc">
                En eski ilanlar
              </option>

              <option value="price-asc">
                Fiyat: Düşükten yükseğe
              </option>

              <option value="price-desc">
                Fiyat: Yüksekten düşüğe
              </option>

              <option value="year-desc">
                Model yılı: Yeniden eskiye
              </option>

              <option value="year-asc">
                Model yılı: Eskiden yeniye
              </option>
            </select>
          </label>

          <label>
            İlan sayısı

            <select
              value={take}
              onChange={(event) =>
                setTake(
                  Number(event.target.value)
                )
              }
            >
              <option value={20}>20 ilan</option>
              <option value={50}>50 ilan</option>
            </select>
          </label>
        </div>
      </section>

      {displayedVehicles.length > 0 ? (
        <section className="vehicle-grid">
          {displayedVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
            />
          ))}
        </section>
      ) : (
        <section className="no-search-results">
          <h2>İlan bulunamadı</h2>

          <p>
            Aradığın kelimeyle eşleşen bir ilan
            bulunamadı.
          </p>
        </section>
      )}
    </main>
  );
}

export default ListingPage;