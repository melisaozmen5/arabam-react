import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchAreaRef = useRef(null);

  const [searchText, setSearchText] =
    useState("");

  const [isSearchDropdownOpen, setIsSearchDropdownOpen] =
    useState(false);

  const [recentSearches, setRecentSearches] =
    useState(() => {
      try {
        return (
          JSON.parse(
            localStorage.getItem("recentSearches")
          ) || []
        );
      } catch {
        return [];
      }
    });

  useEffect(() => {
    const searchParams = new URLSearchParams(
      location.search
    );

    setSearchText(searchParams.get("q") ?? "");
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchAreaRef.current &&
        !searchAreaRef.current.contains(
          event.target
        )
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const saveRecentSearches = (searches) => {
    setRecentSearches(searches);

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(searches)
    );
  };

  const addRecentSearch = (searchValue) => {
    const updatedSearches = [
      searchValue,
      ...recentSearches.filter(
        (item) =>
          item.toLocaleLowerCase("tr-TR") !==
          searchValue.toLocaleLowerCase("tr-TR")
      ),
    ].slice(0, 6);

    saveRecentSearches(updatedSearches);
  };

  const handleSearch = (
    selectedSearch = searchText
  ) => {
    const trimmedSearch =
      selectedSearch.trim();

    if (!trimmedSearch) {
      navigate("/");
      setIsSearchDropdownOpen(false);
      return;
    }

    addRecentSearch(trimmedSearch);
    setSearchText(trimmedSearch);
    setIsSearchDropdownOpen(false);

    navigate(
      `/?q=${encodeURIComponent(trimmedSearch)}`
    );
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }

    if (event.key === "Escape") {
      setIsSearchDropdownOpen(false);
    }
  };

  const handleDeleteRecentSearch = (
    event,
    searchToDelete
  ) => {
    event.stopPropagation();

    const updatedSearches =
      recentSearches.filter(
        (item) => item !== searchToDelete
      );

    saveRecentSearches(updatedSearches);
  };

  const handleClearRecentSearches = () => {
    saveRecentSearches([]);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img
            className="site-logo"
            src={logo}
            alt="arabam.com"
          />
        </Link>

        <div
  className={`search-wrapper ${
    isSearchDropdownOpen ? "search-open" : ""
  }`}
  ref={searchAreaRef}
>
          <div className="search-area">
            <input
              type="text"
              value={searchText}
              placeholder="Kelime, galeri adı veya ilan no ile ara"
              onChange={(event) => {
                setSearchText(
                  event.target.value
                );

                setIsSearchDropdownOpen(
                  true
                );
              }}
              onFocus={() =>
                setIsSearchDropdownOpen(true)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              type="button"
              className="search-button"
              onClick={() => handleSearch()}
              aria-label="İlan ara"
            >
              <span className="search-icon" />
            </button>
          </div>
          {isSearchDropdownOpen && (
  <div
    className="search-overlay"
    onClick={() => setIsSearchDropdownOpen(false)}
  />
)}
          {isSearchDropdownOpen && (
            <div className="search-dropdown">
              <div className="search-dropdown-header">
                <strong>Son Aramalar</strong>

                {recentSearches.length > 0 && (
                  <button
                    type="button"
                    className="clear-searches-button"
                    onClick={
                      handleClearRecentSearches
                    }
                  >
                    Tümünü sil
                  </button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div className="recent-search-list">
                  {recentSearches.map(
                    (recentSearch) => (
                      <button
                        type="button"
                        className="recent-search-item"
                        key={recentSearch}
                        onClick={() =>
                          handleSearch(
                            recentSearch
                          )
                        }
                      >
                        <span className="recent-search-text">
                          {recentSearch}
                        </span>

                        <span
                          className="delete-search-button"
                          role="button"
                          tabIndex={0}
                          aria-label={`${recentSearch} aramasını sil`}
                          onClick={(event) =>
                            handleDeleteRecentSearch(
                              event,
                              recentSearch
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {
                            if (
                              event.key ===
                                "Enter" ||
                              event.key === " "
                            ) {
                              handleDeleteRecentSearch(
                                event,
                                recentSearch
                              );
                            }
                          }}
                        >
                          ×
                        </span>
                      </button>
                    )
                  )}
                </div>
              ) : (
                <p className="no-recent-searches">
                  Henüz arama yapmadınız.
                </p>
              )}
            </div>
          )}
        </div>

        <nav className="main-nav">
          <a href="/">Giriş Yap</a>
          <p>/</p>
          <a href="/">Üye Ol</a>
        </nav>

        <Link
          to="/favorites"
          className="favorites-link"
        >
          <span style={{ color: "#e40030" }}>
            ☆
          </span>{" "}
          Favori İlanlarım
        </Link>

        <button
          type="button"
          className="add-listing-button"
        >
          Ücretsiz İlan Ver
        </button>
      </div>
    </header>
  );
}

export default Header;