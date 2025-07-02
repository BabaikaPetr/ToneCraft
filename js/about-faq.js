document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".faq-item");
      item.classList.toggle("open");
    });
  });
});
