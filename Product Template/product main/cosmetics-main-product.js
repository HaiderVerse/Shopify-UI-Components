(() => {
  function initCosmeticsPdp(section) {
    const productDataEl = section.querySelector('[data-product-json]');
    if (!productDataEl) return;

    let productData;
    try {
      productData = JSON.parse(productDataEl.textContent);
    } catch (error) {
      console.error('Invalid product JSON for cosmetics PDP', error);
      return;
    }

    const state = {
      selectedVariantId: Number(productData.selectedVariantId),
      cartByVariantId: new Map(),
      lineKeyByVariantId: new Map(),
      mainSwiper: null,
      popupSwiper: null
    };

    const variantsById = new Map(
      (productData.variants || []).map((variant) => [Number(variant.id), variant])
    );

    const dom = {
      variantButtons: Array.from(section.querySelectorAll('[data-variant-id]')),
      selectedVariantLabel: section.querySelector('[data-selected-variant-label]'),
      variantPrice: section.querySelector('[data-variant-price]'),
      addToBag: section.querySelector('[data-add-to-bag]'),
      quantityWrap: section.querySelector('[data-quantity-wrap]'),
      quantityInput: section.querySelector('[data-quantity-input]'),
      quantityButtons: Array.from(section.querySelectorAll('[data-qty-action]')),
      shadesWrapper: section.querySelector('[data-shades-wrapper]'),
      shadesToggle: section.querySelector('[data-shades-toggle]'),
      disclosureButtons: Array.from(section.querySelectorAll('.product-more-info_disclosureButton')),
      desktopThumbWrap: section.querySelector('[data-thumbs-desktop]'),
      mainGallery: section.querySelector('[data-main-gallery]'),
      galleryArrows: section.querySelector('[data-gallery-arrows]'),
      mainCarousel: section.querySelector('[data-gallery-carousel]'),
      mainThumbs: Array.from(section.querySelectorAll('[data-thumbs-main] [data-gallery-thumb]')),
      allMainThumbs: Array.from(section.querySelectorAll('[data-gallery-thumb]')),
      popupRoot: document.getElementById('headlessui-portal-root'),
      popupCarousel: document.querySelector('[data-popup-carousel]'),
      popupThumbs: Array.from(document.querySelectorAll('[data-popup-thumb]')),
      popupPrev: document.querySelector('[data-popup-arrow="prev"]'),
      popupNext: document.querySelector('[data-popup-arrow="next"]'),
      openPopup: section.querySelector('[data-open-popup]'),
      closePopup: document.querySelector('[data-close-popup]'),
      mainPrev: section.querySelector('[data-arrow="prev"]'),
      mainNext: section.querySelector('[data-arrow="next"]')
    };

    function formatMoney(cents) {
      if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
        return window.Shopify.formatMoney(cents, productData.moneyFormat);
      }

      return `${(cents / 100).toFixed(2)}`;
    }

    function getSelectedVariant() {
      return variantsById.get(Number(state.selectedVariantId)) || productData.variants[0];
    }

    function getMaxPurchasable(variant) {
      const isTracked = !!variant.inventory_management;
      const policyContinue = variant.inventory_policy === 'continue';
      if (!isTracked || policyContinue) return Infinity;
      return Math.max(0, Number(variant.inventory_quantity || 0));
    }

    function getVariantCartQuantity(variantId) {
      return Number(state.cartByVariantId.get(String(variantId)) || 0);
    }

    function clampQuantity(value, max) {
      const normalized = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
      if (max === Infinity) return normalized;
      return Math.min(normalized, max);
    }

    function updateThumbSelection(index, thumbs) {
      thumbs.forEach((thumb, i) => {
        const active = i === index;
        thumb.classList.toggle('product-gallery-navigator_active', active);
        thumb.setAttribute('aria-checked', active ? 'true' : 'false');
      });
    }

    function setGallerySingleMode(isSingle) {
      const shouldHide = isSingle ? 'add' : 'remove';
      if (dom.desktopThumbWrap) dom.desktopThumbWrap.classList[shouldHide]('is-hidden');
      if (dom.galleryArrows) dom.galleryArrows.classList[shouldHide]('is-hidden');
      const mainThumbList = section.querySelector('[data-thumbs-main]');
      if (mainThumbList) mainThumbList.classList[shouldHide]('is-hidden');

      const popupArrowWrap = document.querySelector('[data-popup-arrows]');
      const popupThumbList = document.querySelector('[data-popup-thumbs]');
      if (popupArrowWrap) popupArrowWrap.classList[shouldHide]('is-hidden');
      if (popupThumbList) popupThumbList.classList[shouldHide]('is-hidden');

      if (isSingle && state.mainSwiper) {
        state.mainSwiper.destroy(true, true);
        state.mainSwiper = null;
      }

      if (isSingle && state.popupSwiper) {
        state.popupSwiper.destroy(true, true);
        state.popupSwiper = null;
      }
    }

    function initMainGallery() {
      const mediaCount = Number(section.dataset.mediaCount || 0);
      if (!dom.mainCarousel || mediaCount <= 1) {
        setGallerySingleMode(true);
        return;
      }

      if (typeof Swiper === 'undefined') {
        console.error('Swiper is required for multi-image gallery');
        return;
      }

      setGallerySingleMode(false);

      state.mainSwiper = new Swiper(dom.mainCarousel, {
        direction: window.innerWidth >= 900 ? 'vertical' : 'horizontal',
        loop: false,
        slidesPerView: 1,
        spaceBetween: 10,
        on: {
          slideChange(swiper) {
            updateThumbSelection(swiper.activeIndex, dom.allMainThumbs);
          }
        },
        breakpoints: {
          900: {
            direction: 'vertical'
          }
        }
      });

      dom.allMainThumbs.forEach((thumb) => {
        thumb.addEventListener('click', () => {
          const index = Number(thumb.dataset.index || 0);
          if (state.mainSwiper) state.mainSwiper.slideTo(index);
        });
      });

      if (dom.mainPrev) {
        dom.mainPrev.addEventListener('click', () => {
          if (state.mainSwiper) state.mainSwiper.slidePrev();
        });
      }

      if (dom.mainNext) {
        dom.mainNext.addEventListener('click', () => {
          if (state.mainSwiper) state.mainSwiper.slideNext();
        });
      }
    }

    function initPopupGallery() {
      if (!dom.popupRoot || !dom.popupCarousel || !dom.openPopup || !dom.closePopup) return;

      dom.openPopup.addEventListener('click', (event) => {
        event.preventDefault();

        dom.popupRoot.style.display = 'block';
        dom.popupRoot.setAttribute('data-headlessui-portal-state', 'open');
        document.body.style.overflow = 'hidden';

        const initialIndex = state.mainSwiper ? state.mainSwiper.activeIndex : 0;

        if (!state.popupSwiper && Number(section.dataset.mediaCount || 0) > 1 && typeof Swiper !== 'undefined') {
          state.popupSwiper = new Swiper(dom.popupCarousel, {
            direction: window.innerWidth >= 900 ? 'vertical' : 'horizontal',
            loop: false,
            slidesPerView: 1,
            initialSlide: initialIndex,
            breakpoints: {
              900: {
                direction: 'vertical'
              }
            },
            on: {
              slideChange(swiper) {
                updateThumbSelection(swiper.activeIndex, dom.popupThumbs);
              }
            }
          });

          dom.popupThumbs.forEach((thumb) => {
            thumb.addEventListener('click', () => {
              const index = Number(thumb.dataset.index || 0);
              if (state.popupSwiper) state.popupSwiper.slideTo(index);
            });
          });
        }

        if (state.popupSwiper) {
          state.popupSwiper.slideTo(initialIndex, 0);
          updateThumbSelection(initialIndex, dom.popupThumbs);
        }
      });

      dom.closePopup.addEventListener('click', () => {
        dom.popupRoot.style.display = 'none';
        dom.popupRoot.setAttribute('data-headlessui-portal-state', '');
        document.body.style.overflow = '';
      });

      if (dom.popupPrev) {
        dom.popupPrev.addEventListener('click', () => {
          if (state.popupSwiper) state.popupSwiper.slidePrev();
        });
      }

      if (dom.popupNext) {
        dom.popupNext.addEventListener('click', () => {
          if (state.popupSwiper) state.popupSwiper.slideNext();
        });
      }
    }

    function scrollGalleryToVariantMedia(variant) {
      if (!variant || !variant.featured_media_id || !state.mainSwiper) return;

      const slide = section.querySelector(`[data-gallery-carousel] [data-media-id="${variant.featured_media_id}"]`);
      if (!slide) return;

      const index = Array.from(slide.parentElement.children).indexOf(slide);
      if (index >= 0) state.mainSwiper.slideTo(index);
    }

    async function refreshCartState() {
      const response = await fetch('/cart.js', {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const cart = await response.json();
      state.cartByVariantId.clear();
      state.lineKeyByVariantId.clear();

      (cart.items || []).forEach((item) => {
        const variantId = String(item.variant_id);
        state.cartByVariantId.set(variantId, Number(item.quantity));
        state.lineKeyByVariantId.set(variantId, item.key);
      });
    }

    async function addToCart(variantId, quantity) {
      const payload = {
        id: Number(variantId),
        quantity: Number(quantity)
      };

      const response = await fetch('/cart/add.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Add to cart failed');
      }
    }

    async function changeCart(lineKey, quantity) {
      const payload = {
        id: lineKey,
        quantity: Number(quantity)
      };

      const response = await fetch('/cart/change.js', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Change cart quantity failed');
      }
    }

    function updateQuantityControls(variant) {
      if (!dom.quantityInput || !dom.quantityWrap || !dom.addToBag) return;

      const variantId = Number(variant.id);
      const inCartQty = getVariantCartQuantity(variantId);
      const max = getMaxPurchasable(variant);
      const addVisible = inCartQty === 0;

      dom.quantityInput.value = String(inCartQty);
      dom.quantityInput.max = max === Infinity ? '' : String(max);

      dom.addToBag.classList.toggle('is-hidden', !addVisible);
      dom.quantityWrap.classList.toggle('is-hidden', addVisible);

      const outOfStockNoCart = !variant.available && inCartQty === 0;
      dom.addToBag.disabled = outOfStockNoCart;
      dom.addToBag.textContent = outOfStockNoCart ? 'Sold out' : 'Add to bag';

      dom.quantityButtons.forEach((button) => {
        const action = button.dataset.qtyAction;
        if (action === 'decrease') {
          button.disabled = inCartQty <= 0;
        }
        if (action === 'increase') {
          button.disabled = max !== Infinity && inCartQty >= max;
        }
      });
    }

    function updateVariantVisualState() {
      const selectedVariant = getSelectedVariant();
      if (!selectedVariant) return;

      if (dom.selectedVariantLabel) {
        dom.selectedVariantLabel.textContent = selectedVariant.title;
      }

      if (dom.variantPrice) {
        dom.variantPrice.textContent = formatMoney(Number(selectedVariant.price));
      }

      dom.variantButtons.forEach((button) => {
        const buttonVariantId = Number(button.dataset.variantId);
        const isSelected = buttonVariantId === Number(selectedVariant.id);

        button.classList.toggle('product-shade-selector_selectedShadeSelectorButton__6WqQv', isSelected);
        button.classList.toggle('product-shade-selector_shadeSelectorButton__RJJvK', !isSelected);
        button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });

      scrollGalleryToVariantMedia(selectedVariant);
      updateQuantityControls(selectedVariant);
    }

    function initVariantSelection() {
      dom.variantButtons.forEach((button) => {
        button.addEventListener('click', () => {
          state.selectedVariantId = Number(button.dataset.variantId);
          updateVariantVisualState();
        });
      });
    }

    function initQuantityActions() {
      if (!dom.addToBag || !dom.quantityInput) return;

      dom.addToBag.addEventListener('click', async () => {
        const selectedVariant = getSelectedVariant();
        if (!selectedVariant || !selectedVariant.available) return;

        dom.addToBag.disabled = true;

        try {
          await addToCart(selectedVariant.id, 1);
          await refreshCartState();
          updateVariantVisualState();
        } catch (error) {
          console.error(error);
        } finally {
          dom.addToBag.disabled = false;
        }
      });

      dom.quantityButtons.forEach((button) => {
        button.addEventListener('click', async () => {
          const selectedVariant = getSelectedVariant();
          if (!selectedVariant) return;

          const variantId = String(selectedVariant.id);
          const currentQty = getVariantCartQuantity(variantId);
          const max = getMaxPurchasable(selectedVariant);
          const delta = button.dataset.qtyAction === 'increase' ? 1 : -1;
          const nextQty = clampQuantity(currentQty + delta, max);

          const lineKey = state.lineKeyByVariantId.get(variantId);
          if (!lineKey) return;

          button.disabled = true;

          try {
            await changeCart(lineKey, nextQty);
            await refreshCartState();
            updateVariantVisualState();
          } catch (error) {
            console.error(error);
          } finally {
            button.disabled = false;
          }
        });
      });

      dom.quantityInput.addEventListener('change', async () => {
        const selectedVariant = getSelectedVariant();
        if (!selectedVariant) return;

        const variantId = String(selectedVariant.id);
        const max = getMaxPurchasable(selectedVariant);
        const desired = clampQuantity(Number(dom.quantityInput.value), max);
        const inCart = getVariantCartQuantity(variantId);

        dom.quantityInput.value = String(desired);
        if (desired === inCart) return;

        dom.quantityInput.disabled = true;

        try {
          const lineKey = state.lineKeyByVariantId.get(variantId);

          if (lineKey) {
            await changeCart(lineKey, desired);
          } else if (desired > 0) {
            await addToCart(variantId, desired);
          }

          await refreshCartState();
          updateVariantVisualState();
        } catch (error) {
          console.error(error);
        } finally {
          dom.quantityInput.disabled = false;
        }
      });
    }

    function initShadesToggle() {
      if (!dom.shadesWrapper || !dom.shadesToggle) return;

      const shadesSelector = dom.shadesWrapper.querySelector('.product-shade-selector_shadesSelector');
      if (!shadesSelector) return;

      function updateHeights() {
        const firstItem = shadesSelector.querySelector('button');
        if (!firstItem) return;

        const rowTop = firstItem.offsetTop;
        let rowHeight = firstItem.offsetHeight;

        Array.from(shadesSelector.children).forEach((item) => {
          if (item.offsetTop === rowTop) {
            rowHeight = Math.max(rowHeight, item.offsetHeight);
          }
        });

        dom.shadesWrapper.dataset.fullHeight = String(shadesSelector.scrollHeight);
        dom.shadesWrapper.dataset.rowHeight = String(rowHeight);

        if (dom.shadesWrapper.dataset.expanded !== 'true') {
          dom.shadesWrapper.style.height = `${rowHeight}px`;
        }
      }

      updateHeights();
      window.addEventListener('resize', updateHeights);

      const initialLabel = dom.shadesToggle.textContent;
      dom.shadesToggle.addEventListener('click', () => {
        const expanded = dom.shadesWrapper.dataset.expanded === 'true';
        if (expanded) {
          dom.shadesWrapper.style.height = `${dom.shadesWrapper.dataset.rowHeight || 0}px`;
          dom.shadesWrapper.dataset.expanded = 'false';
          dom.shadesToggle.textContent = initialLabel;
          return;
        }

        dom.shadesWrapper.style.height = `${dom.shadesWrapper.dataset.fullHeight || 0}px`;
        dom.shadesWrapper.dataset.expanded = 'true';
        dom.shadesToggle.textContent = 'Show less';
      });
    }

    function initDisclosure() {
      dom.disclosureButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const panel = button.nextElementSibling;
          const isOpen = button.getAttribute('aria-expanded') === 'true';

          dom.disclosureButtons.forEach((other) => {
            if (other === button) return;
            other.setAttribute('aria-expanded', 'false');
            other.setAttribute('data-headlessui-state', '');
            const otherPanel = other.nextElementSibling;
            if (otherPanel) otherPanel.setAttribute('data-headlessui-state', '');
          });

          button.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
          button.setAttribute('data-headlessui-state', isOpen ? '' : 'open');
          if (panel) panel.setAttribute('data-headlessui-state', isOpen ? '' : 'open');
        });
      });
    }

    (async function boot() {
      initShadesToggle();
      initDisclosure();
      initMainGallery();
      initPopupGallery();
      initVariantSelection();
      initQuantityActions();

      try {
        await refreshCartState();
      } catch (error) {
        console.error(error);
      }

      updateVariantVisualState();
    })();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-cosmetics-pdp]').forEach(initCosmeticsPdp);
  });
})();
