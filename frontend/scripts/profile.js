document.addEventListener("DOMContentLoaded", function () {
  fetch("/user/profile")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const profileInfo = document.getElementById("profileInfo");
        profileInfo.innerHTML = `
                <p>Username: ${data.user.username}</p>
                <p>Credits: ${data.user.credits}</p>
                <p>Past Scans: ${data.user.pastScans.join(", ")}</p>
            `;
      } else {
        alert("Failed to load profile: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});
