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