document.addEventListener("DOMContentLoaded", () => {
  // Isotope
  if (document.querySelector(".grid")) {
    const iso = new Isotope(".grid", {
      itemSelector: ".thumbs",
      layoutMode: "fitRows",
    });

    const categories = document.querySelectorAll(".categories a");

    for (const categorie of categories) {
      categorie.addEventListener("click", (event) => {
        event.preventDefault();

        iso.arrange({ filter: categorie.dataset.filter });

        for (const link of categories) {
          link.classList.remove("selected");
        }

        categorie.classList.add("selected");
      });
    }
  }

  // Set current year
  document.querySelector("#year").innerHTML = String(new Date().getFullYear());
});
