const header = document.querySelector("header"),
        triggerCloseModal  = document.querySelectorAll('[data-role="modal-close"]'),
        modalId = document.getElementById("modal"),
        modalList = modalId.querySelectorAll("[data-modal]"),
        mobileMenu = document.querySelector('[data-menu="mobile"]');

  document.body.addEventListener("click", function (e) {
    if (e.target.dataset.jsAction === "open-modal" ) {
      openModal(e);
    }
  })

  if (triggerCloseModal) {
    triggerCloseModal.forEach(trigger => trigger.addEventListener("click", handleCloseModal));
  }

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape" && modalId.classList.contains("modal_active")) {
      closeModal();
    }
  })

  if(window.location.hash) {
    const hash = window.location.hash.substring(1);
    const hashTrigger = createTrigger(hash);
    header.appendChild(hashTrigger);
    hashTrigger.click();
    hashTrigger.remove();
    history.pushState("", document.title, window.location.pathname);
  }

  function createTrigger(target) {
    const trigger = document.createElement('a');
    trigger.setAttribute('data-js-action', 'open-modal');
    trigger.setAttribute('data-type-modal', target);
    trigger.style.cssText = 'position:absolute;opacity:0;z-index:-1';
    return trigger;
  }

  function getScrollBarWith() {
    const documentWidth = parseInt(document.documentElement.clientWidth);
    const windowsWidth = parseInt(window.innerWidth);
    return windowsWidth - documentWidth;
  }

  function openModal(e) {
    e.preventDefault();
    if (!e.target) {
      return;
    }
    const target = e.target,
          offsetBody = getScrollBarWith() + "px",
          typeModal = target.dataset.typeModal;
    if (!typeModal) {
      return;
    }
    closeAllModals();
    const currentModal = modalId.querySelector(`[data-modal="${typeModal}"]`);
    if (!currentModal) return;
    modalId.classList.add("modal_active");
    currentModal.classList.add("modal__popup_open");
    document.body.classList.add("modal-open");
    document.body.style.paddingRight = offsetBody;
    setFixedElOffset(offsetBody);

    if (target.dataset.productId) { // если это карточка товара
      currentModal.querySelector('[data-input="product-id"]').value = target.dataset.productId;
    }

  }

  function closeAllModals() {
    for(let i = 0; i < modalList.length; i++) {
      modalList[i].classList.remove("modal__popup_open");
    }
    if (mobileMenu) mobileMenu.classList.remove("menu_open");

  }

  function handleCloseModal(e) {
    if (e.target && e.target.dataset.role === "modal-close") {
      closeModal();
    }
  }

  function closeModal() {
    modalId.classList.remove("modal_active");
    closeAllModals();
    setFixedElOffset(0);
    document.body.classList.remove("modal-open");
    document.body.style.paddingRight = '';
  }

  function setFixedElOffset(offset) {
    const fixed = document.querySelectorAll(".js-fixed");
    if (fixed) {
      fixed.forEach(el => el.style.marginRight = offset);
    }
  }