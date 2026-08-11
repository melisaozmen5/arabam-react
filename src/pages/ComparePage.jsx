import { useState } from "react";
import { Link } from "react-router-dom";
import formatPrice from "../utils/formatPrice";

function ComparePage() {
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

  const [
    showOnlyDifferences,
    setShowOnlyDifferences,
  ] = useState(false);

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

      cityFuelConsumption:
        "Şehir İçi Yakıt Tüketimi",

      highwayFuelConsumption:
        "Şehir Dışı Yakıt Tüketimi",

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

      cylinderCount: "Silindir Sayısı",
      torque: "Tork",
      maximumPower: "Maksimum Güç",
      minimumPower: "Minimum Güç",

      acceleration:
        "Hızlanma (0-100)",

      maximumSpeed: "Maksimum Hız",

      length: "Uzunluk",
      width: "Genişlik",
      height: "Yükseklik",
      weight: "Ağırlık",
      emptyWeight: "Boş Ağırlığı",
      seatCount: "Koltuk Sayısı",
      luggageCapacity: "Bagaj Hacmi",
      frontTire: "Ön Lastik",
      wheelbase: "Aks Aralığı",

      bluetooth: "Bluetooth",
      usb: "USB",
      aux: "AUX",
      abs: "ABS",
      esp: "ESP",
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

  const createVehiclePropertyMap = (vehicle) => {
    const propertyMap = {};

    (vehicle.properties ?? []).forEach(
      (property) => {
        const name = getPropertyName(property);

        propertyMap[name] =
          getPropertyValue(property);
      }
    );

    return propertyMap;
  };

  const propertyMaps = comparedVehicles.map(
    createVehiclePropertyMap
  );

  const apiPropertyNames = [
    ...new Set(
      comparedVehicles.flatMap((vehicle) =>
        (vehicle.properties ?? []).map(
          getPropertyName
        )
      )
    ),
  ];

  const fixedRows = [
    {
      name: "İlan No",
      values: comparedVehicles.map(
        (vehicle) => vehicle.id ?? "-"
      ),
    },
    {
      name: "İlan Tarihi",
      values: comparedVehicles.map(
        (vehicle) =>
          vehicle.dateFormatted ??
          vehicle.createdDate ??
          vehicle.date ??
          "-"
      ),
    },
    {
      name: "Kategori",
      values: comparedVehicles.map(
        (vehicle) =>
          vehicle.category?.name ?? "-"
      ),
    },
    {
      name: "Model",
      values: comparedVehicles.map(
        (vehicle) =>
          vehicle.modelName ?? "-"
      ),
    },
    {
      name: "Konum",
      values: comparedVehicles.map(
        (vehicle) => {
          const location = [
            vehicle.location?.cityName,
            vehicle.location?.townName,
          ]
            .filter(Boolean)
            .join(" / ");

          return location || "-";
        }
      ),
    },
  ];

  const apiRows = apiPropertyNames.map(
    (propertyName) => ({
      name: propertyName,

      values: propertyMaps.map(
        (propertyMap) =>
          propertyMap[propertyName] ?? "-"
      ),
    })
  );

  const getRowSection = (rowName) => {
    const normalizedName = String(rowName)
      .toLocaleLowerCase("tr-TR")
      .trim();

    const enginePerformanceNames = [
      "motor hacmi",
      "motor gücü",
      "çekiş",
      "silindir sayısı",
      "tork",
      "maksimum güç",
      "minimum güç",
      "hızlanma (0-100)",
      "maksimum hız",
    ];

    const fuelConsumptionNames = [
      "ort. yakıt tüketimi",
      "ortalama yakıt tüketimi",
      "şehir içi yakıt tüketimi",
      "şehir dışı yakıt tüketimi",
      "yakıt deposu",
    ];

    const dimensionCapacityNames = [
      "uzunluk",
      "genişlik",
      "yükseklik",
      "ağırlık",
      "boş ağırlığı",
      "koltuk sayısı",
      "bagaj hacmi",
      "ön lastik",
      "aks aralığı",
    ];

    const interiorEquipmentNames = [
      "klima",
      "klima (analog)",
      "klima (dijital)",
      "elektrikli ön camlar",
      "elektrikli arka camlar",
      "geri görüş kamerası",
      "ön görüş kamerası",
      "hız sabitleyici",
      "yol bilgisayarı",
      "start/stop",
      "deri koltuklar",
      "kumaş koltuklar",
      "ön kol dayama",
      "arka kol dayama",
      "anahtarsız sürüş sistemi",
    ];

    const entertainmentNames = [
      "bluetooth",
      "usb",
      "aux",
      "mp3 çalar",
      "cd çalar",
      "cd değiştirici",
      "dvd değiştirici",
      "tv-navigasyon",
      "radyo/kaset",
      "6+ hoparlör",
      "ipod bağlantısı",
      "arka eğlence paketi",
    ];

    const safetyNames = [
      "abc",
      "abs",
      "esp",
      "esp/dstc",
      "eba",
      "ebd",
      "edl",
      "asr/etc",
      "bas",
      "tcs",
      "alarm",
      "immobilizer",
      "isofix",
      "merkezi kilit",
      "hava yastığı (sürücü)",
      "hava yastığı (yolcu)",
      "hava yastığı (yan)",
      "hava yastığı (perde)",
      "hava yastığı (diz)",
      "hava yastığı (tavan)",
      "yokuş kalkış desteği",
      "lastik arıza göstergesi",
      "kör nokta uyarı sistemi",
      "şeritten ayrılma ikazı",
      "şerit değiştirme yardımcısı",
      "otomatik park sistemi",
      "otomatik çarpışma önleyici sistem",
      "yorgunluk tespit sistemi",
    ];

    if (
      enginePerformanceNames.includes(
        normalizedName
      )
    ) {
      return "engine-performance";
    }

    if (
      fuelConsumptionNames.includes(
        normalizedName
      )
    ) {
      return "fuel-consumption";
    }

    if (
      dimensionCapacityNames.includes(
        normalizedName
      )
    ) {
      return "dimensions-capacity";
    }

    if (
      interiorEquipmentNames.includes(
        normalizedName
      )
    ) {
      return "interior-equipment";
    }

    if (
      entertainmentNames.includes(
        normalizedName
      )
    ) {
      return "entertainment";
    }

    if (
      safetyNames.includes(normalizedName)
    ) {
      return "safety";
    }

    return "vehicle-details";
  };

  const sections = [
    {
      id: "vehicle-details",
      title: "Araç Detayları",
    },
    {
      id: "engine-performance",
      title: "Motor ve Performans",
    },
    {
      id: "fuel-consumption",
      title: "Yakıt Tüketimi",
    },
    {
      id: "dimensions-capacity",
      title: "Boyut ve Kapasite",
    },
    {
      id: "interior-equipment",
      title: "İç Donanım",
    },
    {
      id: "entertainment",
      title: "Eğlence Sistemi",
    },
    {
      id: "safety",
      title: "Güvenlik",
    },
  ];

  const combinedRows = [
    ...fixedRows,
    ...apiRows,
  ];

  const uniqueRows = Array.from(
    new Map(
      combinedRows.map((row) => [
        row.name,
        row,
      ])
    ).values()
  );

 const normalizeComparisonValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("tr-TR");
};

const hasDifferentValues = (values) => {
  if (values.length < 2) {
    return false;
  }

  const normalizedValues = values.map(
    normalizeComparisonValue
  );

  const firstValue = normalizedValues[0];

  return normalizedValues.some(
    (value) => value !== firstValue
  );
};

const filteredRows = showOnlyDifferences
  ? uniqueRows.filter((row) =>
      hasDifferentValues(row.values)
    )
  : uniqueRows;
console.log(filteredRows);
  const sectionRows = sections.map(
    (section) => ({
      ...section,

      rows: filteredRows.filter(
        (row) =>
          getRowSection(row.name) ===
          section.id
      ),
    })
  );

  const visibleSections =
    sectionRows.filter(
      (section) =>
        section.rows.length > 0
    );

  const handleRemoveVehicle = (
    vehicleId
  ) => {
    const updatedVehicles =
      comparedVehicles.filter(
        (vehicle) =>
          String(vehicle.id) !==
          String(vehicleId)
      );

    setComparedVehicles(updatedVehicles);

    localStorage.setItem(
      "comparedCars",
      JSON.stringify(updatedVehicles)
    );
  };

  if (comparedVehicles.length < 2) {
    return (
      <main className="compare-page">
        <section className="compare-empty">
          <h1>İlan Karşılaştırma</h1>

          <p>
            Karşılaştırma yapabilmek için en az
            iki ilan seçmelisiniz.
          </p>

          <Link
            to="/"
            className="compare-back-button"
          >
            İlanlara Dön
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="compare-page">
      <div className="compare-breadcrumb">
        <Link to="/">⌂ Ana Sayfa</Link>
        <span>/</span>
        <span>İlan Karşılaştırma</span>
      </div>

      <section className="compare-top-card">
        <h1>İlan Karşılaştırma</h1>

        <nav className="compare-tabs">
          {visibleSections.map(
            (section, index) => (
              <a
                href={`#${section.id}`}
                className={
                  index === 0 ? "active" : ""
                }
                key={section.id}
              >
                {section.title}
              </a>
            )
          )}
        </nav>

        <div className="compare-vehicle-grid">
          {comparedVehicles.map(
            (vehicle) => {
              const photo =
                vehicle.photos?.[0] ??
                vehicle.photo ??
                "";

              return (
                <article
                  className="compare-vehicle-card"
                  key={vehicle.id}
                >
                  {photo ? (
                    <img
                      src={photo.replace(
                        "{0}",
                        "240x180"
                      )}
                      alt={vehicle.title}
                    />
                  ) : (
                    <div className="compare-image-placeholder">
                      Fotoğraf yok
                    </div>
                  )}

                  <div className="compare-vehicle-info">
                    <strong>
                      {vehicle.title}
                    </strong>

                    <span>
                      {vehicle.price !==
                      undefined
                        ? formatPrice(
                            vehicle.price
                          )
                        : vehicle.priceFormatted ??
                          "-"}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="compare-card-remove"
                    onClick={() =>
                      handleRemoveVehicle(
                        vehicle.id
                      )
                    }
                    aria-label="İlanı karşılaştırmadan çıkar"
                  >
                    ×
                  </button>
                </article>
              );
            }
          )}

          {comparedVehicles.length < 3 && (
            <Link
              to="/"
              className="compare-add-vehicle"
            >
              ⊕ Araç Ekle
            </Link>
          )}
        </div>
      </section>

      <section className="compare-difference-control">
        <label>
          <input
  type="checkbox"
  checked={showOnlyDifferences}
  onChange={() =>
    setShowOnlyDifferences(
      (previousValue) => !previousValue
    )
  }
/>

          <span>
            Sadece farkları göster
          </span>
        </label>
      </section>

      {visibleSections.length > 0 ? (
        visibleSections.map((section) => (
          <section
            className="compare-table-section"
            id={section.id}
            key={section.id}
          >
            <h2>{section.title}</h2>

            <div className="compare-table">
              {section.rows.map((row) => (
                <div
                  className="compare-table-row"
                  key={`${section.id}-${row.name}`}
                  style={{
                    gridTemplateColumns: `minmax(180px, 0.8fr) repeat(${comparedVehicles.length}, minmax(220px, 1fr))`,
                  }}
                >
                  <div className="compare-property-name">
                    {row.name}
                  </div>

                  {row.values.map(
                    (value, index) => (
                      <div
                        className="compare-property-value"
                        key={`${section.id}-${row.name}-${index}`}
                      >
                        {value || "-"}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      ) : (
        <section className="compare-table-section">
          <h2>
            Karşılaştırılacak farklı özellik
            bulunamadı
          </h2>

          <p>
            İki veya üç ilandaki
            karşılaştırılabilir değerler aynı
            görünüyor.
          </p>
        </section>
      )}
    </main>
  );
}

export default ComparePage;