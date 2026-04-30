(function () {
  // ===== Бургер-меню: открытие/закрытие =====
  const burger = document.getElementById("burgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (burger && navMenu) {
    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (event) {
      if (
        navMenu.classList.contains("active") &&
        !navMenu.contains(event.target) &&
        !burger.contains(event.target)
      ) {
        navMenu.classList.remove("active");
      }
    });
  }

  // ===== ЛУПА: открытие модального окна поиска =====
  const searchIcon = document.getElementById("searchIcon");
  const searchIconMob = document.getElementById("searchIconMob");
  const searchModal = document.getElementById("searchModal");
  const closeSearchBtn = document.getElementById("closeSearchBtn");
  const searchSubmitBtn = document.getElementById("searchSubmitBtn");
  const searchInput = document.getElementById("searchInput");

  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add("active");
      if (searchInput) searchInput.focus();
    }
  }

  function closeSearchModal() {
    if (searchModal) {
      searchModal.classList.remove("active");
    }
  }

  function performSearch() {
    const query = searchInput.value.trim();
    if (query === "") {
      alert("Введите поисковый запрос");
      return;
    }
    alert(
      "Поиск: " +
        query +
        "\n(Функция поиска может быть реализована на бэкенде)",
    );
    closeSearchModal();
    if (searchInput) searchInput.value = "";
  }

  if (searchIcon) searchIcon.addEventListener("click", openSearchModal);
  if (searchIconMob) searchIconMob.addEventListener("click", openSearchModal);
  if (closeSearchBtn)
    closeSearchBtn.addEventListener("click", closeSearchModal);
  if (searchSubmitBtn) searchSubmitBtn.addEventListener("click", performSearch);

  // Закрытие по Escape
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      searchModal &&
      searchModal.classList.contains("active")
    ) {
      closeSearchModal();
    }
  });

  // Клик вне контента модалки — закрыть
  if (searchModal) {
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) {
        closeSearchModal();
      }
    });
  }

  // Enter в поле поиска
  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch();
      }
    });
  }

  // ===== Кнопки "Оставить проект" / "Обсудить проект" =====
  const desktopBtn = document.getElementById("desktopProjectBtn");
  const mobileBtn = document.getElementById("mobileProjectBtn");

  const handleProjectClick = () => {
    alert(
      "Спасибо за интерес! Наш менеджер свяжется с вами для обсуждения проекта.",
    );
  };

  if (desktopBtn) desktopBtn.addEventListener("click", handleProjectClick);
  if (mobileBtn) mobileBtn.addEventListener("click", handleProjectClick);

  // ===== ФУНКЦИИ ДЛЯ СЛАЙДЕРОВ (точки пагинации для 360/320px) =====
  function initSliderDots(sliderWrapperId, cardsId, dotsContainerId) {
    const wrapper = document.getElementById(sliderWrapperId);
    const cardsContainer = document.getElementById(cardsId);
    const dotsContainer = document.getElementById(dotsContainerId);

    // Проверяем наличие всех элементов
    if (!wrapper || !cardsContainer || !dotsContainer) {
      console.warn("Slider elements not found:", {
        sliderWrapperId,
        cardsId,
        dotsContainerId,
      });
      return;
    }

    if (window.innerWidth > 400) return;

    const cards = cardsContainer.children;
    const cardCount = cards.length;

    if (cardCount === 0) return;

    // Очищаем и создаем точки
    dotsContainer.innerHTML = "";
    for (let i = 0; i < cardCount; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");

      // Создаем замыкание для правильного индекса
      dot.addEventListener(
        "click",
        (function (index) {
          return function () {
            const card = cards[index];
            const scrollPosition = card.offsetLeft - wrapper.offsetLeft;
            wrapper.scrollTo({ left: scrollPosition, behavior: "smooth" });
          };
        })(i),
      );
      dotsContainer.appendChild(dot);
    }

    // Обновляем активную точку при скролле
    function updateActiveDot() {
      const scrollLeft = wrapper.scrollLeft;
      const wrapperWidth = wrapper.clientWidth;
      const viewportCenter = scrollLeft + wrapperWidth / 2;

      let activeIndex = 0;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const cardStart = card.offsetLeft;
        const cardEnd = cardStart + card.offsetWidth;
        if (viewportCenter >= cardStart && viewportCenter <= cardEnd) {
          activeIndex = i;
          break;
        }
      }

      const dots = dotsContainer.querySelectorAll(".dot");
      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    wrapper.addEventListener("scroll", updateActiveDot);
    setTimeout(updateActiveDot, 100);
  }

  function initSlidersIfNeeded() {
    if (window.innerWidth <= 400) {
      initSliderDots(
        "recomendationSlider",
        "recomendationCards",
        "recomendationDots",
      );
      initSliderDots("stackSlider", "stackCards", "stackDots");
    }
  }

  // Запускаем слайдеры после полной загрузки страницы
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSlidersIfNeeded);
  } else {
    initSlidersIfNeeded();
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth <= 400) {
      // ✅ было 320, стало 400
      setTimeout(function () {
        initSliderDots(
          "recomendationSlider",
          "recomendationCards",
          "recomendationDots",
        );
        initSliderDots("stackSlider", "stackCards", "stackDots");
      }, 50);
    } else {
      const recomendationDots = document.getElementById("recomendationDots");
      const stackDots = document.getElementById("stackDots");
      if (recomendationDots) recomendationDots.innerHTML = "";
      if (stackDots) stackDots.innerHTML = "";
    }
  });

  // ===== SWIPER СЛАЙДЕР для кейсов =====
  if (typeof Swiper !== "undefined" && document.querySelector(".caseSwiper")) {
    new Swiper(".caseSwiper", {
      slidesPerView: 1,
      spaceBetween: 18,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        360: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        640: {
          slidesPerView: 1.5,
          spaceBetween: 18,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 18,
        },
        1024: {
          slidesPerView: 2.3,
          spaceBetween: 18,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 18,
        },
      },
      autoHeight: false,
      centeredSlides: false,
    });
  }

  // ===== АККОРДЕОН =====
  const accordionItems = document.querySelectorAll(".accordion-item");

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      if (header) {
        header.addEventListener("click", () => {
          accordionItems.forEach((otherItem) => {
            if (otherItem !== item && otherItem.classList.contains("active")) {
              otherItem.classList.remove("active");
            }
          });
          item.classList.toggle("active");
        });
      }
    });
  }
})();
