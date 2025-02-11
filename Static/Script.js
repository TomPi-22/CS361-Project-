document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const popup = document.getElementById("email-popup");
    const closeBtn = document.querySelector(".close");
    const submitEmail = document.getElementById("submit-email");
    const searchBtn = document.getElementById("search-btn");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const clearSearchPopup = document.getElementById("clear-search-popup");
    const recipeContainer = document.getElementById("recipes-container");

    let offset = 0;
    const limit = 10;
    let currentQuery = "dinner"; // Default query when no search is made

    // Ensure pop-up code only runs if the elements exist
    if (popup && closeBtn && submitEmail) {
        if (!sessionStorage.getItem("emailPopupDismissed")) {
            setTimeout(() => {
                popup.style.display = "flex";
            }, 5000);
        }

        closeBtn.addEventListener("click", () => {
            popup.style.display = "none";
            sessionStorage.setItem("emailPopupDismissed", "true");
        });

        submitEmail.addEventListener("click", () => {
            const email = document.getElementById("email-input").value.trim();
            if (email) {
                alert(`Thank you for subscribing, ${email}!`);
                popup.style.display = "none";
                sessionStorage.setItem("emailPopupDismissed", "true");
            }
        });
    }

    // Ensure fetchRecipes only runs if recipeContainer exists
    if (recipeContainer) {
        function fetchRecipes() {
            recipeContainer.innerHTML = `<p>Loading recipes...</p>`;

            fetch(`/search?query=${currentQuery}&offset=${offset}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    recipeContainer.innerHTML = "";
                    console.log("Fetched data:", data);

                    if (!data || data.length === 0) {
                        recipeContainer.innerHTML = `<p style="color: red;">No recipes found.</p>`;
                        return;
                    }

                    data.forEach(recipe => {
                        let recipeCard = document.createElement("div");
                        recipeCard.classList.add("recipe-card");

                        let title = document.createElement("h2");
                        title.textContent = recipe.title;
                        title.classList.add("recipe-title");

                        let details = document.createElement("div");
                        details.classList.add("recipe-details", "hidden");

                        let ingredientsList = recipe.ingredients
                            .split("|")
                            .map(ing => `<li>${ing.trim()}</li>`)
                            .join("");

                        details.innerHTML = `
                            <h3>Ingredients:</h3>
                            <ul>${ingredientsList}</ul>
                            <h3>Instructions:</h3>
                            <p>${recipe.instructions}</p>
                        `;

                        title.addEventListener("click", function () {
                            details.classList.toggle("hidden");
                        });

                        recipeCard.appendChild(title);
                        recipeCard.appendChild(details);
                        recipeContainer.appendChild(recipeCard);
                    });

                    document.getElementById("prevBtn").disabled = (offset === 0);
                })
                .catch(error => {
                    recipeContainer.innerHTML = `<p style="color: red;">Error fetching recipes: ${error.message}</p>`;
                    console.error("Error fetching recipes:", error);
                });
        }

        fetchRecipes(); // Load recipes on page load

        // Search functionality
        if (searchBtn) {
            searchBtn.addEventListener("click", function () {
                let query = document.getElementById("search-bar").value.trim();
                if (!query) return;

                currentQuery = query;
                offset = 0;
                fetchRecipes();
                clearSearchBtn.classList.remove("hidden");
            });
        }

        // Clear search pop-up functionality
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener("click", () => {
                let searchBarValue = document.getElementById("search-bar").value.trim();
                if (searchBarValue.length > 0) {
                    clearSearchPopup.style.display = "flex";
                }
            });

            document.getElementById("confirm-clear").addEventListener("click", () => {
                document.getElementById("search-bar").value = "";
                clearSearchPopup.style.display = "none";
                clearSearchBtn.classList.add("hidden");
                currentQuery = "dinner";
                fetchRecipes();
            });

            document.getElementById("cancel-clear").addEventListener("click", () => {
                clearSearchPopup.style.display = "none";
            });
        }

        // Pagination controls
        document.getElementById("nextBtn").addEventListener("click", () => {
            offset += limit;
            fetchRecipes();
        });

        document.getElementById("prevBtn").addEventListener("click", () => {
            if (offset >= limit) {
                offset -= limit;
                fetchRecipes();
            }
        });

        // Show or hide the clear search button based on input
        document.getElementById("search-bar").addEventListener("input", () => {
            let searchBarValue = document.getElementById("search-bar").value.trim();
            if (searchBarValue.length > 0) {
                clearSearchBtn.classList.remove("hidden");
            } else {
                clearSearchBtn.classList.add("hidden");
            }
        });
    }
});
