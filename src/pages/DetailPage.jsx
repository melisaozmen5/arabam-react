import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";
import formatPrice from "../utils/formatPrice";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [selectedPhoto, setSelectedPhoto] =
    useState("");
  const [
    selectedPhotoIndex,
    setSelectedPhotoIndex,
  ] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] =
    useState(false);
  const [showPhone, setShowPhone] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isCompareOpen, setIsCompareOpen] =
    useState(false);

  const [comparedVehicles, setComparedVehicles] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem("comparedCars")
          ) || []
        );
      } catch {
        return [];
      }
    });

  const [compareError, setCompareError] =
    useState("");

  useEffect(() => {
    const getVehicleDetail = async () => {
      try {
        setLoading(true);
        setError("");
        setShowPhone(false);

        const response = await api.get(
          "/api/v1/detail",
          {
            params: {
              id: Number(id),
            },
          }
        );

        console.log(
          "Detay verisinin tamamı:",
          response.data
        );

        console.log(
          "Properties:",
          response.data.properties
        );

        console.log(
          "Kategori bilgisi:",
          response.data.category
        );

        setVehicle(response.data);

        const firstPhoto =
          response.data.photos?.[0] ?? "";

        setSelectedPhoto(firstPhoto);
        setSelectedPhotoIndex(0);
      } catch (requestError) {
        console.error(
          "İlan detayları alınamadı:",
          requestError
        );

        setError("İlan detayları alınamadı.");
      } finally {
        setLoading(false);
      }
    };

    getVehicleDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="detail-status">
        <h2>İlan detayları yükleniyor...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-status">
        <h2>{error}</h2>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="detail-status">
        <h2>İlan bulunamadı.</h2>
      </div>
    );
  }

  const saveComparedVehicles = (vehicles) => {
    setComparedVehicles(vehicles);

    localStorage.setItem(
      "comparedCars",
      JSON.stringify(vehicles)
    );
  };

  const getComparableCategory = (item) => {
    return (
      item.category?.rootId ??
      item.category?.mainCategoryId ??
      item.category?.parentId ??
      null
    );
  };

  const handleAddToCompare = () => {
    setCompareError("");

    const vehicleId = String(vehicle.id);

    const alreadyAdded = comparedVehicles.some(
      (comparedVehicle) =>
        String(comparedVehicle.id) === vehicleId
    );

    if (alreadyAdded) {
      setCompareError(
        "Bu ilan zaten karşılaştırmaya eklenmiş."
      );
      return;
    }

    if (comparedVehicles.length >= 3) {
      setCompareError(
        "Maksimum 3 ilan karşılaştırma sayısına ulaştınız."
      );
      return;
    }

    if (comparedVehicles.length > 0) {
      const firstVehicle = comparedVehicles[0];

      const firstCategory =
        getComparableCategory(firstVehicle);

      const currentCategory =
        getComparableCategory(vehicle);

      if (
        firstCategory !== null &&
        currentCategory !== null &&
        String(firstCategory) !==
          String(currentCategory)
      ) {
        setCompareError(
          "Farklı kategorilerden olan ilanlar karşılaştırılamaz."
        );
        return;
      }
    }

    saveComparedVehicles([
      ...comparedVehicles,
      vehicle,
    ]);
  };

  const handleRemoveFromCompare = (vehicleId) => {
    const updatedVehicles =
      comparedVehicles.filter(
        (comparedVehicle) =>
          String(comparedVehicle.id) !==
          String(vehicleId)
      );

    saveComparedVehicles(updatedVehicles);
    setCompareError("");
  };

  const handleGoToCompare = () => {
    if (comparedVehicles.length < 2) {
      setCompareError(
        "Karşılaştırmak için en az 2 ilan eklemelisiniz."
      );
      return;
    }

    navigate("/compare");
  };

  const uniquePhotos = [
    ...new Set(vehicle.photos ?? []),
  ];

  const handleSelectPhoto = (photo, index) => {
    setSelectedPhoto(photo);
    setSelectedPhotoIndex(index);
  };

  const handlePreviousPhoto = () => {
    if (uniquePhotos.length <= 1) {
      return;
    }

    const previousIndex =
      selectedPhotoIndex === 0
        ? uniquePhotos.length - 1
        : selectedPhotoIndex - 1;

    setSelectedPhotoIndex(previousIndex);
    setSelectedPhoto(uniquePhotos[previousIndex]);
  };

  const handleNextPhoto = () => {
    if (uniquePhotos.length <= 1) {
      return;
    }

    const nextIndex =
      selectedPhotoIndex ===
      uniquePhotos.length - 1
        ? 0
        : selectedPhotoIndex + 1;

    setSelectedPhotoIndex(nextIndex);
    setSelectedPhoto(uniquePhotos[nextIndex]);
  };

  const handleOpenGallery = () => {
    if (selectedPhoto) {
      setIsGalleryOpen(true);
    }
  };

  const handleCloseGallery = () => {
    setIsGalleryOpen(false);
  };

  const formatPropertyName = (name) => {
    const propertyNames = {
      km: "Kilometre",
      kilometer: "Kilometre",
      mileage: "Kilometre",

      color: "Renk",
      colour: "Renk",

      year: "Yıl",
      modelYear: "Yıl",

      gear: "Vites Tipi",
      transmission: "Vites Tipi",

      fuel: "Yakıt Tipi",
      fuelType: "Yakıt Tipi",

      body: "Kasa Tipi",
      bodyType: "Kasa Tipi",

      engineSize: "Motor Hacmi",
      engineVolume: "Motor Hacmi",

      enginePower: "Motor Gücü",
      power: "Motor Gücü",

      traction: "Çekiş",
      driveType: "Çekiş",

      vehicleStatus: "Araç Durumu",
      condition: "Araç Durumu",

      averageFuelConsumption:
        "Ort. Yakıt Tüketimi",

      fuelConsumption:
        "Ort. Yakıt Tüketimi",

      fuelTank: "Yakıt Deposu",
      fuelTankCapacity: "Yakıt Deposu",

      heavyDamage: "Ağır Hasarlı",
      paintedChanged: "Boya-değişen",
      paintChange: "Boya-değişen",

      swap: "Takasa Uygun",
      exchange: "Takasa Uygun",

      sellerType: "Kimden",
      fromWho: "Kimden",

      brand: "Marka",
      make: "Marka",

      series: "Seri",
      model: "Model",
    };

    return propertyNames[name] ?? name;
  };

  const getPropertyName = (property) => {
    const name =
      property.name ??
      property.label ??
      property.key ??
      property.title ??
      "";

    return formatPropertyName(name);
  };

  const getPropertyValue = (property) => {
    return (
      property.value ??
      property.text ??
      property.formattedValue ??
      property.displayValue ??
      "-"
    );
  };

  const propertyRows = [
    {
      name: "İlan No",
      value: vehicle.id,
    },
    {
      name: "İlan Tarihi",
      value:
        vehicle.dateFormatted ??
        vehicle.createdDate ??
        vehicle.date ??
        "-",
    },
    ...(vehicle.properties ?? []).map(
      (property) => ({
        name: getPropertyName(property),
        value: getPropertyValue(property),
      })
    ),
  ];

  const locationText = [
    vehicle.location?.cityName,
    vehicle.location?.townName,
  ]
    .filter(Boolean)
    .join(" / ");

  const sellerName =
    vehicle.userInfo?.nameSurname ??
    vehicle.userInfo?.name ??
    "Satıcı bilgisi bulunamadı";

  const phoneNumber =
    vehicle.userInfo?.phoneFormatted ??
    vehicle.userInfo?.phone ??
    "";

  const maskPhoneNumber = (phone) => {
    let digitCount = 0;

    const totalDigits = phone.replace(
      /\D/g,
      ""
    ).length;

    return phone.replace(/\d/g, (digit) => {
      digitCount += 1;

      if (digitCount > totalDigits - 4) {
        return "*";
      }

      return digit;
    });
  };

  const maskedPhoneNumber = phoneNumber
    ? maskPhoneNumber(phoneNumber)
    : "";

  const currentVehicleAlreadyAdded =
    comparedVehicles.some(
      (comparedVehicle) =>
        String(comparedVehicle.id) ===
        String(vehicle.id)
    );

  return (
    <main className="detail-page">
      <Link to="/" className="detail-back-link">
        ← İlanlara Dön
      </Link>

      <div className="detail-actions-bar">
        <Link
          to="/favorites"
          className="detail-action-link"
        >
          <span style={{ color: "#e40030" }}>
            ☆
          </span>{" "}
          Favori İlanlarım
        </Link>

        <button
          type="button"
          className="detail-action-link detail-compare-trigger"
          onClick={() => {
            setCompareError("");

            setIsCompareOpen(
              (previousValue) => !previousValue
            );
          }}
        >
          <span style={{ color: "#e40030" }}>
            ⇄
          </span>{" "}
          İlanları Karşılaştır
        </button>

        {isCompareOpen && (
          <div className="compare-popup">
            <div className="compare-popup-header">
              <div>
                <h2>İlanları Karşılaştır</h2>

                <p>
                  Karşılaştırmak için en az 2 ilan
                  eklemelisiniz
                </p>
              </div>

              <button
                type="button"
                className="compare-popup-close"
                onClick={() =>
                  setIsCompareOpen(false)
                }
                aria-label="Karşılaştırma penceresini kapat"
              >
                ×
              </button>
            </div>

            <div className="compare-popup-list">
              {comparedVehicles.map(
                (comparedVehicle) => {
                  const comparedPhoto =
                    comparedVehicle.photos?.[0] ??
                    comparedVehicle.photo ??
                    "";

                  return (
                    <div
                      className="compare-popup-item"
                      key={comparedVehicle.id}
                    >
                      {comparedPhoto ? (
                        <img
                          src={comparedPhoto.replace(
                            "{0}",
                            "160x120"
                          )}
                          alt={
                            comparedVehicle.title
                          }
                        />
                      ) : (
                        <div className="compare-popup-image-placeholder">
                          Fotoğraf yok
                        </div>
                      )}

                      <div className="compare-popup-item-info">
                        <strong>
                          {comparedVehicle.title}
                        </strong>

                        <span>
                          {comparedVehicle.price !==
                          undefined
                            ? formatPrice(
                                comparedVehicle.price
                              )
                            : comparedVehicle.priceFormatted ??
                              "-"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className="compare-remove-button"
                        onClick={() =>
                          handleRemoveFromCompare(
                            comparedVehicle.id
                          )
                        }
                        aria-label="İlanı karşılaştırmadan çıkar"
                      >
                        ×
                      </button>
                    </div>
                  );
                }
              )}
            </div>

            {comparedVehicles.length < 3 &&
              !currentVehicleAlreadyAdded && (
                <button
                  type="button"
                  className="compare-add-button"
                  onClick={handleAddToCompare}
                >
                  ⊕ Bu ilanı ekle
                </button>
              )}

            {currentVehicleAlreadyAdded &&
              comparedVehicles.length < 3 && (
                <div className="compare-added-message">
                  ✓ Bu ilan karşılaştırmaya eklendi.
                </div>
              )}

            {comparedVehicles.length === 3 && (
              <div className="compare-limit-message">
                ⓘ Maksimum 3 ilan karşılaştırma
                sayısına ulaştınız.
              </div>
            )}

            {compareError && (
              <div className="compare-error">
                ⓘ {compareError}
              </div>
            )}

            <button
              type="button"
              className="compare-go-button"
              onClick={handleGoToCompare}
              disabled={
                comparedVehicles.length < 2
              }
            >
              Karşılaştır
            </button>
          </div>
        )}
      </div>

      <div className="detail-layout">
        <section className="detail-main-card">
          <header className="detail-header">
            <h1>{vehicle.title}</h1>

            {locationText && (
              <div className="detail-location">
                📍 {locationText}
              </div>
            )}
          </header>

          <div className="detail-content">
            <div className="detail-gallery">
              <div className="detail-main-image-wrapper">
                {selectedPhoto ? (
                  <>
                    <button
                      type="button"
                      className="detail-main-image-button"
                      onClick={handleOpenGallery}
                      aria-label="Fotoğrafı büyüt"
                    >
                      <img
                        className="detail-main-image"
                        src={selectedPhoto.replace(
                          "{0}",
                          "800x600"
                        )}
                        alt={vehicle.title}
                      />
                    </button>

                    {uniquePhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="detail-gallery-arrow detail-gallery-arrow-left"
                          onClick={
                            handlePreviousPhoto
                          }
                          aria-label="Önceki fotoğraf"
                        >
                          ‹
                        </button>

                        <button
                          type="button"
                          className="detail-gallery-arrow detail-gallery-arrow-right"
                          onClick={handleNextPhoto}
                          aria-label="Sonraki fotoğraf"
                        >
                          ›
                        </button>
                      </>
                    )}

                    <div className="detail-photo-counter">
                      {selectedPhotoIndex + 1} /{" "}
                      {uniquePhotos.length}
                    </div>
                  </>
                ) : (
                  <div className="detail-image-placeholder">
                    Fotoğraf bulunamadı
                  </div>
                )}
              </div>

              {uniquePhotos.length > 0 && (
                <div className="detail-thumbnails">
                  {uniquePhotos.map(
                    (photo, index) => (
                      <button
                        type="button"
                        className={
                          selectedPhotoIndex === index
                            ? "detail-thumbnail active-thumbnail"
                            : "detail-thumbnail"
                        }
                        key={`${photo}-${index}`}
                        onClick={() =>
                          handleSelectPhoto(
                            photo,
                            index
                          )
                        }
                      >
                        <img
                          src={photo.replace(
                            "{0}",
                            "160x120"
                          )}
                          alt={`${vehicle.title} ${
                            index + 1
                          }`}
                        />
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <div className="detail-information">
              <div className="detail-price-row">
                <span>Fiyat</span>

                <strong>
                  {vehicle.price !== undefined
                    ? formatPrice(vehicle.price)
                    : vehicle.priceFormatted}
                </strong>
              </div>

              <details
                className="detail-properties"
                open
              >
                <summary className="detail-properties-summary">
                  <span>İlan Özellikleri</span>

                  <span className="detail-properties-arrow">
                    ⌄
                  </span>
                </summary>

                <div className="detail-properties-list">
                  {propertyRows.map(
                    (property, index) => (
                      <div
                        className="detail-property-row"
                        key={`${property.name}-${index}`}
                      >
                        <span className="detail-property-name">
                          {property.name}
                        </span>

                        <strong className="detail-property-value">
                          {property.value}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </details>
            </div>
          </div>

          {vehicle.text && (
            <section className="detail-description-section">
              <h2>İlan Açıklaması</h2>

              <div
                className="detail-description"
                dangerouslySetInnerHTML={{
                  __html: vehicle.text,
                }}
              />
            </section>
          )}
        </section>

        <aside className="detail-seller-card">
          <h2>Satıcı Bilgileri</h2>

          <p className="detail-seller-name">
            {sellerName}
          </p>

          {phoneNumber ? (
            <button
              type="button"
              className="detail-phone-button"
              onClick={() => setShowPhone(true)}
            >
              <span className="detail-phone-icon">
                ☎
              </span>

              <span>
                {showPhone
                  ? phoneNumber
                  : `Telefonu göster - ${maskedPhoneNumber}`}
              </span>
            </button>
          ) : (
            <button
              type="button"
              className="detail-phone-button"
              disabled
            >
              Telefon bilgisi bulunamadı
            </button>
          )}
        </aside>
      </div>

      {isGalleryOpen && selectedPhoto && (
        <div
          className="fullscreen-gallery"
          onClick={handleCloseGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Tam ekran fotoğraf galerisi"
        >
          <button
            type="button"
            className="fullscreen-close"
            onClick={handleCloseGallery}
            aria-label="Galeriyi kapat"
          >
            ✕
          </button>

          {uniquePhotos.length > 1 && (
            <>
              <button
                type="button"
                className="fullscreen-arrow left"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePreviousPhoto();
                }}
                aria-label="Önceki fotoğraf"
              >
                ‹
              </button>

              <button
                type="button"
                className="fullscreen-arrow right"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNextPhoto();
                }}
                aria-label="Sonraki fotoğraf"
              >
                ›
              </button>
            </>
          )}

          <img
            className="fullscreen-image"
            src={selectedPhoto.replace(
              "{0}",
              "1920x1080"
            )}
            alt={vehicle.title}
            onClick={(event) =>
              event.stopPropagation()
            }
          />

          <div
            className="fullscreen-counter"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {selectedPhotoIndex + 1} /{" "}
            {uniquePhotos.length}
          </div>
        </div>
      )}
    </main>
  );
}

export default DetailPage;