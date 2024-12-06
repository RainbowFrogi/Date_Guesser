//Home screen modal
document.addEventListener("DOMContentLoaded", () => {
  const howToButton = document.getElementById("howToButton");
  const modal = document.getElementById("modal");
  const closeButton = document.querySelector(".close");

  howToButton.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
