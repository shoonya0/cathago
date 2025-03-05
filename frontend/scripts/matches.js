document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const docId = urlParams.get("docId");

  fetch(`/matches/${docId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const matchesList = document.getElementById("matchesList");
        matchesList.innerHTML = data.matches
          .map((match) => `<p>${match}</p>`)
          .join("");
      } else {
        alert("Failed to load matches: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});
