const reviewsDiv = document.getElementById("reviews");

async function loadReviews() {
  const res = await fetch("/api/reviews");
  const data = await res.json();

  reviewsDiv.innerHTML = "";

  data.forEach(r => {
    reviewsDiv.innerHTML += `
      <div style="background:#111; padding:15px; margin:10px 0; border:1px solid #333;">
        <h3>${r.movie} ⭐ ${r.rating}/10</h3>
        <p>${r.text}</p>
        <button onclick="editReview('${r._id}', '${r.movie}', '${r.text}', ${r.rating})">Edit</button>
        <button onclick="deleteReview('${r._id}')">Delete</button>
      </div>
    `;
  });
}

// CREATE
async function addReview() {
  const movie = document.getElementById("movieInput").value;
  const text = document.getElementById("textInput").value;
  const rating = document.getElementById("ratingInput").value;

  await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie, text, rating })
  });

  document.getElementById("movieInput").value = "";
  document.getElementById("textInput").value = "";
  document.getElementById("ratingInput").value = "";

  loadReviews();
}

// UPDATE
async function editReview(id, movie, text, rating) {
  const newMovie = prompt("Movie name:", movie);
  const newText = prompt("Review:", text);
  const newRating = prompt("Rating (1-10):", rating);

  if (!newMovie || !newText || !newRating) return;

  await fetch(`/api/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ movie: newMovie, text: newText, rating: newRating })
  });

  loadReviews();
}

// DELETE
async function deleteReview(id) {
  await fetch(`/api/reviews/${id}`, { method: "DELETE" });
  loadReviews();
}

loadReviews();
