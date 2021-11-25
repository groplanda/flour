(function(){

const showMore = document.querySelector('[data-js-action="open-category"]'),
      activeShowMoreClass = "home-category__open_active";

if (showMore) {
  showMore.addEventListener("click", showCategories);
}

function showCategories() {
  const showMoreText = this.firstElementChild,
        categories = document.querySelectorAll(".home-category__item_hide"),
        catHeight = categories[0].firstElementChild.offsetHeight + 20;

  this.classList.toggle(activeShowMoreClass);

  if (this.classList.contains(activeShowMoreClass)) {
    showMoreText.textContent = "Свернуть";
    updateHeightCategories(categories, catHeight);
  } else {
    showMoreText.textContent = "Посмотреть все";
    updateHeightCategories(categories);
  }
}


function updateHeightCategories(categories, height = 0) {
  categories.forEach(cat => {
    Object.assign(cat.style, {
      height: height + 'px',
      overflow: height === 0 ? 'hidden' : 'initial',
    });
  })
}


})();