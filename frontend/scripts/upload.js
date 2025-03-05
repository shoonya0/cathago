document
  .getElementById("uploadForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const documentFile = document.getElementById("document").files[0];
    const formData = new FormData();
    formData.append("document", documentFile);

    fetch("/scanupload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Document uploaded successfully!");
          window.location.href = `matches.html?docId=${data.docId}`;
        } else {
          alert("Upload failed: " + data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
