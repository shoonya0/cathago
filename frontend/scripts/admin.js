document.addEventListener("DOMContentLoaded", function () {
  fetch("/admin/analytics")
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const analyticsData = document.getElementById("analyticsData");
        analyticsData.innerHTML = `
                <p>Total Scans: ${data.totalScans}</p>
                <p>Top Users: ${data.topUsers.join(", ")}</p>
                <p>Common Topics: ${data.commonTopics.join(", ")}</p>
            `;
      } else {
        alert("Failed to load analytics: " + data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});
