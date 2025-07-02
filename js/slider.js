document.addEventListener("DOMContentLoaded", function () {
  const track = document.querySelector(".slider-track");
  const cards = Array.from(document.querySelectorAll(".slider-card"));
  const left = document.querySelector(".slider-arrow-left");
  const right = document.querySelector(".slider-arrow-right");
  const dots = document.querySelectorAll(".slider-dot");
  const cardsToShow = 3;
  const gap = 20;
  let current = 0;
  const cardWidth = 296;
  const centerCardWidth = 340;
  const sliderWidth = 952;

  const heroBtn = document.querySelector(".hero-btn");
  if (heroBtn) {
    heroBtn.addEventListener("click", function () {
      window.location.href = "pages/catalog.html";
    });
  }

  const popularBtn = document.querySelector(".popular-btn");
  if (popularBtn) {
    popularBtn.addEventListener("click", function () {
      window.location.href = "pages/catalog.html";
    });
  }

  function updateSlider() {
    cards.forEach((card) => card.classList.remove("center"));
    const centerIdx = current + Math.floor(cardsToShow / 2);
    if (cards[centerIdx]) cards[centerIdx].classList.add("center");
    let offset =
      (cardWidth + gap) * current -
      (sliderWidth - centerCardWidth) / 2 +
      (centerCardWidth - cardWidth) / 2;
    track.style.transform = `translateX(-${offset}px)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === current);
    });
  }

  right.addEventListener("click", function () {
    if (current < cards.length - cardsToShow) {
      current++;
      updateSlider();
    }
  });

  left.addEventListener("click", function () {
    if (current > 0) {
      current--;
      updateSlider();
    }
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", function () {
      if (i <= cards.length - cardsToShow) {
        current = i;
        updateSlider();
      }
    });
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
});
