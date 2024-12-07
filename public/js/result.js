
//// Get The Score From The URL And Display It To The User!
document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    const segments = path.split("/");
    const scoreValue = segments[segments.length - 1];
  
    const scoreElement = document.getElementById("score");
    scoreElement.textContent = scoreValue;
});
  