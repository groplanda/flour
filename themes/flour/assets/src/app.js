import $ from 'jquery';
window.$ = window.jQuery = $;
import 'swiper/css/bundle';
require('lightbox2/dist/js/lightbox.min.js');
import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
import './helpers/modal';
import axios from 'axios';
import { onValidate, checkErr } from "./helpers/validate.js";
import Inputmask from "inputmask";

document.addEventListener("DOMContentLoaded", () => {
  Swiper.use([Navigation, Pagination, Thumbs]);

  const preloader = document.getElementById("preloader"),
        hidePreloaderClass = "loading_hide";

  const homeSlider = document.querySelector('[data-js-slider="home-slider"]');

  if (homeSlider) {

    new Swiper('[data-js-slider="home-slider"]', {
      loop: false,
      slidesPerView: 1,
      spaceBetween: 0,
      slideClass: 'slider__item',
      slideActiveClass: 'slider__item_active',
      navigation: {
        nextEl: '[data-js-action="home-slider-next"]',
        prevEl: '[data-js-action="home-slider-prev"]',
      }
    })
  }

  const gallerySlider = document.querySelector('[data-js-slider="gallery-slider"]');

  if (gallerySlider) {

    new Swiper('[data-js-slider="gallery-slider"]', {
      loop: false,
      slidesPerView: 2,
      spaceBetween: 10,
      slideClass: 'gallery__slide',
      slideActiveClass: 'gallery__slide_active',
      pagination: {
        el: '.gallery__pagination',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 0
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 10
        }
      }
    })
  }

    // mobile menu
  const triggers = document.querySelectorAll('[data-js-action="open-menu"]'),
        mobileMenu = document.querySelector('[data-menu="mobile"]');

  if (triggers) {
    triggers.forEach(trigger => {
      trigger.addEventListener("click", () => {
        mobileMenu.classList.toggle("menu_open");
        document.body.classList.toggle("modal-open");

        if (trigger.classList.contains("js-header-menu")) {
          trigger.classList.add("header__menu_active");
        } else {
          triggers.forEach(t => {
            if (t.classList.contains("js-header-menu")) t.classList.remove("header__menu_active");
          })
        }
      })
    })
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", e => {
      if (e.target && e.target.dataset.jsAction === "mobile-overlay") {
        mobileMenu.classList.remove("menu_open");
        document.body.classList.remove("modal-open");

        triggers.forEach(t => {
          if (t.classList.contains("js-header-menu")) t.classList.remove("header__menu_active");
        })
      }
    })
  }


  const forms = document.querySelectorAll('[data-js-action="send-form"]'),
        errorClass = "error-active";

  if (forms) {
    forms.forEach(form => {
      form.addEventListener("submit", sendData)
    })
  }

  function sendData(e) {
    e.preventDefault();

    preloader.classList.remove(hidePreloaderClass);

    const form = this,
        FIELD_KEYS = ['user_name', 'user_phone', 'user_email', 'user_message'],
        formData = {};

        FIELD_KEYS.forEach(key => {
          if (form[key]) formData[key] = form[key].value;
        });

        axios.post("/api/sendData", formData)
          .then(response => {
            const data = response.data;
            console.log(data);
            if (data.status === "error") {
              let errors = onValidate(data, formData);
              handleErrors(form, FIELD_KEYS, errors);
              return;
            }

            if (data.status === "success") {
              document.getElementById("reset-success").innerHTML = data.message;
              const trigger = createTrigger("message-success");
              document.body.appendChild(trigger);
              trigger.click();
              trigger.remove();

              FIELD_KEYS.forEach(key => {
                if (form[key]) form[key].value = "";
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(() => {
            preloader.classList.add(hidePreloaderClass);
          })
  }

  function handleErrors(formEl, keys, errors) {
    keys.forEach(key => {
      const msgError = checkErr(key, errors);
      if (msgError.length > 0) {
        displayError(formEl, key, msgError);
      }
    })
  }


  function displayError(formEl, key, error) {
    const errEl = formEl.querySelector(`[data-error-for="${key}"]`);
    errEl.classList.add(errorClass);
    errEl.textContent = error;
  }

  function createTrigger(target) {
    const trigger = document.createElement('a');
    trigger.setAttribute('data-js-action', 'open-modal');
    trigger.setAttribute('data-type-modal', target);
    trigger.style.cssText = 'position:absolute;opacity:0;z-index:-1';
    return trigger;
  }

  const phoneMask = document.querySelectorAll('[data-js-action="phone-mask"]');

  if (phoneMask) {
    const im = new Inputmask("8(999) 999 99 99");
    phoneMask.forEach(phone => im.mask(phone));
  }

  const dropdowns = document.querySelectorAll('[data-js-action="dropdown"]');

  if (dropdowns) {
    dropdowns.forEach(dropdown => {
      dropdown.addEventListener("click", openDropdown)
    })

    document.addEventListener("click", function(e) {
      const targer = e.target;

      if (targer && !targer.closest('[data-js-action="dropdown"]')) {
        dropdowns.forEach(dropdown => dropdown.classList.remove("active"));
      }
    })
  }

  function openDropdown() {
    removeActiveDropdowns();
    this.classList.toggle("active");
  }

  function removeActiveDropdowns() {
    const activeDropdowns = document.querySelectorAll('.nav__item.active');
    if (activeDropdowns.length > 1) {
      activeDropdowns.forEach(dropdown => {
        dropdown.classList.remove("active");
      })
    }
  }

  scrollToUp();

  function scrollToUp() {
    const upBtn = document.querySelector('[data-js-action="up"]');

    if (upBtn) {
      upBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
    }
  }

});
// import './plugins/UserAuth';
// import './plugins/AddComment';
// import './helpers/show-more';
// import Swiper, { Navigation, Pagination, Thumbs } from 'swiper';
// import Sticky from 'sticky-js';
// import { Cart } from './plugins/Cart';
// import './helpers/modal';
// import { Tabs } from './plugins/Tabs';
// import noUiSlider from 'nouislider';
// import { Wish } from './plugins/Wish';
// import { SingleProduct } from './plugins/SingleProduct';
// import { SelectCity } from './plugins/SelectCity';

// document.addEventListener("DOMContentLoaded", () => {

//   async function supportsWebp() {
//     if (!self.createImageBitmap) return false;

//     const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
//     const blob = await fetch(webpData).then(r => r.blob());
//     return createImageBitmap(blob).then(() => true, () => false);
//   }

//   (async () => {
//     const bodyEl = document.body;
//     if(await supportsWebp()) {
//       bodyEl.classList.add("webp")
//     }
//     else {
//       bodyEl.classList.add("no-webp")
//     }
//   })();

//   Swiper.use([Navigation, Pagination, Thumbs]);

//   // isMobile
//   const IS_MOBILE = window.innerWidth < 767;

//   if ( IS_MOBILE ) {
//     $('[data-js-action="open-sort"]').on("click", toggleSort)
//   }

//   // home slider

//   const homeSlider = document.querySelector('[data-js-slider="home-slider"]');

//   if (homeSlider) {

//     new Swiper('[data-js-slider="home-slider"]', {
//       loop: true,
//       slidesPerView: 1,
//       spaceBetween: 0,
//       slideClass: 'slider__item',
//       slideActiveClass: 'slider__item_active',
//     })
//   }

//   // home categories
//   const homeCategories = document.querySelectorAll(".js-category");
//   if (homeCategories) {
//     calcCategories(homeCategories);

//     const mediaQuery = [
//       '(min-width: 1340px)',
//       '(max-width: 1339px)',
//       '(min-width: 1200px)',
//       '(max-width: 1199px)',
//       '(min-width: 900px)',
//       '(max-width: 899px)'
//     ];

//     mediaQuery.forEach(query => {
//       const size = window.matchMedia(query);
//       size.addListener(handleChange)
//     })
//   }

//   function handleChange(e) {
//     if (e.matches) {
//       calcCategories(homeCategories);
//     }
//   }

//   function calcCategories(categories) {

//     if (!categories) return;
//     let skip = 0;
//     const pageWidth = window.innerWidth;

//     for(let i = skip; i < categories.length; i++) {
//       categories[i].classList.remove("home-category__item_hide")
//     }

//     if (pageWidth >= 1340) return;

//     if (pageWidth < 1340) {
//       skip = 7;
//     }
//     if (pageWidth < 1200) {
//       skip = 6;
//     }
//     if (pageWidth < 900) {
//       skip = 5;
//     }
//     for(let i = skip; i < categories.length; i++) {
//       categories[i].classList.add("home-category__item_hide")
//     }
//   }

//   // toggle sort dropdown
//   function toggleSort() {
//     const activeClass = "category__sort-label_active",
//           nextClass = ".category__sort-dropdown";
//     $(this).toggleClass(activeClass);
//     if ($(this).hasClass(activeClass)) {
//       $(this).next(nextClass).slideDown();
//     } else {
//       $(this).next(nextClass).slideUp();
//     }
//   }


//   // tabs
//   new Tabs(".modal__tabs", "modal__tabs-title_active", "modal__tabs-item_active").init();

//   // add cart
//   function addToCart() {
//     let addBtns = document.querySelectorAll('[data-js-action="add-to-cart"]');
//     const cart = new Cart(".js-cart", ".js-cart-count");
//     cart.updateCart();
//     cart.displayProductQty();
//     if (addBtns.length > 0) {
//       addBtns.forEach(btn => {
//         btn.addEventListener("click", function() {
//           const id = this.dataset.productId;
//           if (!id) return;

//           const optionId = this.dataset.optionId ? Number(this.dataset.optionId) : null,
//                 amount = this.dataset.productAmount ? Number(this.dataset.productAmount) : 1;

//           const data = { id: Number(id), amount: amount, optionId: optionId };

//           if (this.dataset.type === "qty") {
//             changeQty(this, amount);
//           } else if (this.dataset.type === "product-page") {
//             setProductPageAmount(1, this);
//             document.querySelector('[data-js-action="qty-val"]').textContent = 1;
//           } else {
//             this.classList.add("product-card__button_hide");
//             this.nextElementSibling.classList.add("qty_show");
//           }
//           cart.addToCart(data);
//         })
//       })
//     }
//   }

//   addToCart();

//   function changeQty(btn, amount) {
//     const qty = btn.parentElement;
//     if (!qty.classList.contains("qty")) return;
//     const qtyValue = qty.querySelector('[data-js-action="qty-val"]')
//     qtyValue.textContent = Number(qtyValue.textContent) + amount;

//     if (Number(qtyValue.textContent) === 0) {
//       qty.classList.remove("qty_show");
//       qty.previousElementSibling.classList.remove("product-card__button_hide");
//       qtyValue.textContent = 1;
//     }
//   }

//   productPageQty();

//   function productPageQty() {
//     const qtyEl = document.querySelector('[data-js-action="update-qty"]'),
//           buttonEl = document.querySelector('[data-js-action="add-to-cart"]');

//     if (qtyEl) {
//       qtyEl.addEventListener("click", e => {
//         const target = e.target;
//         const qtyVal = qtyEl.querySelector('[data-js-action="qty-val"]');
//         if (target && target.tagName.toLowerCase() === "button") {

//           if (target.classList.contains("js-remove-cart")) {
//             if (Number(qtyVal.textContent) === 1) return;
//             qtyVal.textContent = Number(qtyVal.textContent) - 1;
//           } else {
//             qtyVal.textContent = Number(qtyVal.textContent) + 1;
//           }
//           setProductPageAmount(qtyVal.textContent, buttonEl)
//         }
//       })
//     }
//   }

//   function setProductPageAmount(value, buttonEl) {
//     buttonEl.dataset.productAmount = value;
//   }

//   // mobile menu
//   const triggers = document.querySelectorAll('[data-js-action="open-menu"]'),
//         mobileMenu = document.querySelector('[data-menu="mobile"]');

//   if (triggers) {
//     triggers.forEach(trigger => {
//       trigger.addEventListener("click", () => {
//         mobileMenu.classList.toggle("menu_open");
//         document.body.classList.toggle("modal-open");
//       })
//     })
//   }

//   if (mobileMenu) {
//     mobileMenu.addEventListener("click", e => {
//       if (e.target && e.target.dataset.jsAction === "mobile-overlay") {
//         mobileMenu.classList.remove("menu_open");
//         document.body.classList.remove("modal-open");
//       }
//     })
//   }

//   const dropdownMenu = document.querySelectorAll('[data-js-action="open-dropdown-menu"]');

//   if (dropdownMenu) {
//     dropdownMenu.forEach(btn => {
//       btn.addEventListener("click", toggleMobileDropdown)
//     })
//   }

//   function toggleMobileDropdown() {
//     const activeClass = "menu__item-btn_active",
//           nextClass = ".menu__dropdown";
//     $('[data-js-action="open-dropdown-menu"]').not(this).removeClass(activeClass).next(nextClass).slideUp();
//     $(this).toggleClass(activeClass);
//     if ($(this).hasClass(activeClass)) {
//       $(this).next(nextClass).slideDown();
//     } else {
//       $(this).next(nextClass).slideUp();
//     }
//   }

//   // catalog filters

//   const catalogPaginate = document.getElementById("partialPaginate"),
//         categorySection = document.getElementById("categorySection"),
//         catalogSort = document.getElementById("partialSort"),
//         preloader = document.getElementById("preloader"),
//         checkboxBrands = document.querySelectorAll('[data-js-action="checkbox-brand"]'),
//         resetFilter = document.querySelector('[data-js-action="reset-filter"]'),
//         priceSlider = document.getElementById("priceFilter"),
//         priceValues = [
//           document.querySelector('[data-price="start"]'),
//           document.querySelector('[data-price="end"]'),
//         ];

//   if (catalogPaginate) {
//     catalogPaginate.addEventListener("click", function (e) {
//       if (e.target.dataset.jsAction === "paginate" ) {
//         productFilter(e);
//       }
//     })
//   }

//   if (catalogSort) {
//     catalogSort.addEventListener("click", function (e) {
//       if (e.target.dataset.jsAction === "sort-products" ) {
//         const sorted = catalogSort.querySelectorAll('[data-js-action="sort-products"]');
//         sorted.forEach(s => s.classList.remove("category__sort-item_active"));
//         e.target.classList.add("category__sort-item_active");
//         $('[data-js-action="open-sort"]').trigger("click")
//         productFilter(e);
//       }
//     })
//   }

//   if (checkboxBrands) {
//     checkboxBrands.forEach(checkbox => checkbox.addEventListener("change", productFilter));
//   }

//   if (resetFilter) {
//     resetFilter.addEventListener("click", productFilter);
//   }

//   if (priceSlider) {
//     createRange();
//   }

//   openMobileFilter('[data-js-action="toggle-mobile-filter"]');

//   function openMobileFilter(trigger) {
//     const triggerEl = document.querySelector(trigger),
//           activeFilterClass = "filter_active";

//     if (triggerEl) {
//       triggerEl.addEventListener("click", () => {
//         const filterEl = triggerEl.nextElementSibling;
//         filterEl.classList.toggle(activeFilterClass);

//         filterEl.classList.contains(activeFilterClass)
//         ? filterEl.style.minHeight = filterEl.scrollHeight + "px"
//         : filterEl.style.minHeight = 0;
//       })
//     }
//   }

//   function createRange() {
//     const maxPrice = priceSlider.dataset.max,
//           minPrice = priceSlider.dataset.min;

//     noUiSlider.create(priceSlider, {
//       start: [+minPrice, +maxPrice],
//       connect: true,
//       range: {
//       'min': +minPrice,
//       'max': +maxPrice
//       },
//       format: {
//         to: (v) => parseFloat(v).toFixed(0),
//         from: (v) => parseFloat(v).toFixed(0)
//       }
//   });
//     priceSlider.noUiSlider.on('update', function (values, handle) {
//       priceValues[handle].textContent = values[handle];
//     });

//     priceSlider.noUiSlider.on('change', function(values, handle, unencoded, tap, positions, noUiSlider) {
//       productFilter(noUiSlider);
//     });
//   }

//   function getSortValue() {
//     const sorted = document.querySelectorAll('[data-js-action="sort-products"]');
//     let result = 'price asc';
//     if (sorted) {
//       sorted.forEach(sort => {
//         if (sort.classList.contains("category__sort-item_active")) {
//           result = sort.value;
//         }
//       })
//     }
//     return result;
//   }

//   function getCheckboxVals(checkboxes) {
//     let result = [];
//     for (let i = 0; i < checkboxes.length; i++) {
//       checkboxes[i].checked && result.push(checkboxes[i].value);
//     }
//     return result
//   }

//   function getActivePage() {
//     let result = 1;
//     const page = document.querySelector(".category__pagination-btn.category__pagination-btn_current");
//     if (page) {
//       result = Number(page.dataset.page);
//     }
//     return result;
//   }

//   function productFilter(e) {
//     const target = e.target,
//           noResetType = target.type !== "reset";
//     if (noResetType && !target.classList.contains("noUi-target")) {
//       e.preventDefault();
//     }

//     if (!noResetType) {
//       priceSlider.noUiSlider.reset();
//     }

//     let sort = getSortValue();
//     let page = getActivePage();
//     let brand = getCheckboxVals(noResetType ? checkboxBrands : []);

//     if (target.dataset.jsAction === "paginate") {
//       page = Number(e.target.dataset.page);
//     }

//     const filterData = {
//       'filter[page]': page,
//       'filter[sort]': sort,
//       'filter[brand]': brand
//     }

//     if (priceValues[0] && priceValues[1]) {
//       let min = Number(priceValues[0].textContent);
//       let max = Number(priceValues[1].textContent);
//       filterData.filter[min] = min
//       filterData.filter[max] = max
//     }

//     $.request('onFilterProduct', {
//       beforeUpdate() {
//         preloader.classList.add("loading_active");
//       },
//       data: filterData,
//       update: {
//         '@list.htm' : '#partialProducts',
//         '@pagination.htm' : '#partialPaginate',
//       },
//     })
//     .done(() => {
//       setTimeout(() => {
//         preloader.classList.remove("loading_active");
//       }, 300)

//       categorySection.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start'
//       })
//       catalogQuickView();
//       addToCart();
//     });
//   }

//   // catalog quick view
//   catalogQuickView();

//   function catalogQuickView() {
//     const quickViewBtns = document.querySelectorAll(".js-quick-view");

//     if (quickViewBtns) {
//       let quickView = new SingleProduct();
//       quickViewBtns.forEach(quickBtn => {
//         quickBtn.addEventListener("click", function(e) {
//           e.preventDefault();
//           const productId = this.dataset.quickProductId;
//           if (!productId) return;
//           quickView.fecthProductData(productId);
//         })
//       })
//     }
//   }

//   // single product page
//   const productWrap = document.getElementById('partialSingleProduct');

//   if (productWrap) {
//     productWrap.addEventListener("click", handleProduct);
//     productSlider();
//     new Sticky('[data-sticky]');
//     setupOptions();
//   }

//   function productSlider() {

//     new Swiper('[data-js-slider="product-view"]', {
//       spaceBetween: 0,
//       slideClass: 'product__slider-item',
//       slideActiveClass: 'product__slider-item_active',
//       navigation: {
//         nextEl: '.product__slider-arrow_next',
//         prevEl: '.product__slider-arrow_prev',
//       }
//     });
//   }

//   function handleProduct(e) {
//     if (e.target.dataset.featured) {
//       e.preventDefault();
//       const id = e.target.dataset.featured;
//       selectFeatured(id)
//     }

//     if (e.target.dataset.jsAction === "options") {
//       e.preventDefault();
//       const selected = e.target;
//       selectOption(selected);
//     }

//     if (e.target.dataset.jsAction === "toggle-wish") {
//       e.preventDefault();
//       const target = e.target;
//       target.classList.toggle("product__wish_active");

//       new Wish().toggeWish({
//         product_id: target.dataset.productId,
//         user_id: target.dataset.userId
//       });

//     }
//   }

//   function setupOptions() {
//     const activeOptionBtn = document.querySelector(".product__options-item_active");

//     if (activeOptionBtn) {
//       selectOption(activeOptionBtn)
//     }
//   }

//   function selectOption(btn) {
//     removeActiveOptions();
//     btn.classList.add("product__options-item_active");
//     const DATA_KEYS = ['price', 'salePrice', 'type', 'name', 'optionId'];
//     const productData = {};
//     DATA_KEYS.forEach(key => productData[key] = btn.dataset[key]);
//     updateProductPrice(productData.price, productData.salePrice);
//     updateAddToCart(productData.optionId);
//   }

//   function removeActiveOptions() {
//     const buttons = document.querySelectorAll('[data-js-action="options"]');
//     for(let i = 0; i < buttons.length; i++) {
//       buttons[i].classList.remove("product__options-item_active");
//     }
//   }

//   function updateAddToCart(optionId) {
//     const addToCart = document.querySelector('[data-js-action="add-to-cart"]');
//     addToCart.setAttribute('data-option-id', optionId);
//   }

//   function updateProductPrice(price, salePrice) {
//     const $currentPrice = document.querySelector('[data-js="price-current"]'),
//           $oldPrice = document.querySelector('[data-js="price-old"]');
//     if (+salePrice > 0) {
//       $currentPrice.textContent = preparePrice(salePrice);
//       $oldPrice.textContent = preparePrice(price);
//       $oldPrice.classList.remove("product__price-old_hide");
//       return;
//     }
//     $currentPrice.textContent = preparePrice(price);
//     $oldPrice.classList.add("product__price-old_hide");
//   }

//   function preparePrice (price) {
//     return price.toLocaleString('ru') + ' ₽';
//   }

//   function selectFeatured(id) {
//     if (!id) return;

//     updateHistoryProduct(id);

//     $.request('onFeature', {
//       beforeUpdate() {
//         preloader.classList.add("loading_active");
//       },
//       data: {
//         'page': id,
//       },
//       update: {
//         '@product.htm' : '#partialSingleProduct'
//       },
//     })
//     .done(() => {
//       const productThumbs = productWrap.querySelector('[data-js-slider="product-thumbs"]');
//       if (productThumbs) {
//         productSlider();
//       }
//       addToCart();
//       new Sticky('[data-sticky]');
//       new Tabs(".tabs", "tabs__heading-item_current", "tabs__item_open").init();
//       setupOptions();
//       productWrap.addEventListener("click", handleProduct);
//       setTimeout(() => {
//         preloader.classList.remove("loading_active");
//       }, 400)

//     });
//   }

//   function updateHistoryProduct(id) {
//     const locStr = location.href;
//     const locStrSlash = locStr.lastIndexOf('/');
//     const fullLoc = locStr.substring(0, locStrSlash + 1);
//     const getParams = location.search;
//     history.pushState({id: id}, null, fullLoc + id + getParams);
//   }

//   const selectCity = new SelectCity();
//   selectCity.init();
// });