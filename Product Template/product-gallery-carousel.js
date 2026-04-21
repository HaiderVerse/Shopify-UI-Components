document.addEventListener('DOMContentLoaded', function () {

    // ─── Swiper not loaded guard ───────────────────────────────────────────────
    if (typeof Swiper === 'undefined') {
        console.error('Swiper is not loaded');
        return;
    }

    // ─── References ───────────────────────────────────────────────────────────
    let mainSwiper = null;
    let popupSwiper = null;

    const mainGalleryEl   = document.querySelector('.product-gallery_galleryCarousel');
    const thumbButtons    = document.querySelectorAll(
        '.product-gallery-navigator_navigatorContainer .product-gallery-navigator_navigatorButton'
    );
    const arrowPrev       = document.querySelector('.carousel-utils_arrowL__e_hk7');
    const arrowNext       = document.querySelector('.carousel-utils_arrowR__7AZ0v');
    const galleryButtons  = document.querySelectorAll('.product-gallery_galleryButton__S3y_y');
    const portalRoot      = document.getElementById('headlessui-portal-root');
    const popupDialog     = document.querySelector('.product-gallery_galleryDialog__b4AJu');

    // ─── 1. Main Vertical Swiper ───────────────────────────────────────────────
    if (mainGalleryEl) {
        mainSwiper = new Swiper(mainGalleryEl, {
            direction: 'vertical',
            loop: false,
            slidesPerView: 1,
            spaceBetween: 10,
            on: {
                slideChange: function () {
                    syncThumbnails(mainSwiper.activeIndex);
                    updateArrowStates();
                }
            }
        });
    }

    // ─── 2. Thumbnail Sync ────────────────────────────────────────────────────
    function syncThumbnails(activeIndex) {
        thumbButtons.forEach(function (btn, i) {
            btn.classList.toggle('product-gallery-navigator_active', i === activeIndex);
            btn.setAttribute('aria-checked', i === activeIndex ? 'true' : 'false');
        });
    }

    // ─── Arrow Disable State ──────────────────────────────────────────────────
    function updateArrowStates() {
        if (!mainSwiper) return;
        const total = mainSwiper.slides ? mainSwiper.slides.length : 0;
        const idx   = mainSwiper.activeIndex;

        if (arrowPrev) {
            const isFirst = idx === 0;
            arrowPrev.disabled = isFirst;
            arrowPrev.setAttribute('aria-disabled', isFirst ? 'true' : 'false');
            arrowPrev.style.opacity      = isFirst ? '0.35' : '1';
            arrowPrev.style.pointerEvents = isFirst ? 'none' : 'auto';
        }

        if (arrowNext) {
            const isLast = idx === total - 1;
            arrowNext.disabled = isLast;
            arrowNext.setAttribute('aria-disabled', isLast ? 'true' : 'false');
            arrowNext.style.opacity      = isLast ? '0.35' : '1';
            arrowNext.style.pointerEvents = isLast ? 'none' : 'auto';
        }
    }

    // Thumbnail click → slide to that index
    thumbButtons.forEach(function (btn, index) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (mainSwiper) {
                mainSwiper.slideTo(index);
            }
        });
    });

    // ─── 3. Arrow Navigation ──────────────────────────────────────────────────
    if (arrowPrev) {
        arrowPrev.addEventListener('click', function () {
            if (mainSwiper) mainSwiper.slidePrev();
        });
    }

    if (arrowNext) {
        arrowNext.addEventListener('click', function () {
            if (mainSwiper) mainSwiper.slideNext();
        });
    }

    // ─── 4. Zoom Functionality (Main Gallery only) ────────────────────────────
    let customCursor = null;
    const ZOOM_LEVEL = 1.8;

    function getOrCreateCursor() {
        if (!customCursor) {
            customCursor = document.createElement('div');
            customCursor.id = 'custom-zoom-cursor';

            // Magnifying glass SVG (with + sign) inside a frosted white circle
            customCursor.innerHTML = [
                '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"',
                '     fill="none" stroke="rgba(0,0,0,0.72)" stroke-width="2.2"',
                '     stroke-linecap="round" stroke-linejoin="round">',
                '  <circle cx="11" cy="11" r="7"></circle>',
                '  <line x1="16.5" y1="16.5" x2="22" y2="22"></line>',
                '  <line x1="11" y1="8.5" x2="11" y2="13.5"></line>',
                '  <line x1="8.5" y1="11" x2="13.5" y2="11"></line>',
                '</svg>'
            ].join('');

            Object.assign(customCursor.style, {
                position:        'fixed',
                width:           '46px',
                height:          '46px',
                borderRadius:    '50%',
                pointerEvents:   'none',
                zIndex:          '10000',
                display:         'none',
                background:      'rgba(255,255,255,0.05)',
                boxShadow:       '0 2px 14px rgba(0,0,0,0.16)',
                transform:       'translate(-50%, -50%)',
                transition:      'opacity 0.12s',
                alignItems:      'center',
                justifyContent:  'center',
            });

            document.body.appendChild(customCursor);
        }
        return customCursor;
    }

    function moveCursor(x, y) {
        const cursor = getOrCreateCursor();
        cursor.style.left    = x + 'px';
        cursor.style.top     = y + 'px';
        cursor.style.display = 'flex';
    }

    function hideCursor() {
        if (customCursor) customCursor.style.display = 'none';
    }

    function applyZoom(img, btn) {
        img.style.transition      = 'transform 0.2s ease';
        img.style.transform       = 'scale(' + ZOOM_LEVEL + ')';
        img.style.transformOrigin = 'center center';
        btn.style.overflow        = 'hidden';
        // Hide native cursor on the element via JS property (no CSS)
        btn.style.cursor = 'none';
    }

    function resetZoom(img, btn) {
        img.style.transform       = 'scale(1)';
        img.style.transformOrigin = 'center center';
        btn.style.cursor          = 'default';
    }

    function updateZoomOrigin(img, btn, e) {
        const rect     = btn.getBoundingClientRect();
        const pctX     = ((e.clientX - rect.left) / rect.width)  * 100;
        const pctY     = ((e.clientY - rect.top)  / rect.height) * 100;
        img.style.transformOrigin = pctX + '% ' + pctY + '%';
    }

    galleryButtons.forEach(function (btn) {
        // Only add zoom if this button is NOT inside the popup dialog
        if (popupDialog && popupDialog.contains(btn)) return;

        btn.addEventListener('mouseenter', function () {
            const img = this.querySelector('img');
            if (img) applyZoom(img, this);
        });

        btn.addEventListener('mousemove', function (e) {
            const img = this.querySelector('img');
            if (img) updateZoomOrigin(img, this, e);
            moveCursor(e.clientX, e.clientY);
        });

        btn.addEventListener('mouseleave', function () {
            const img = this.querySelector('img');
            if (img) resetZoom(img, this);
            hideCursor();
        });

        btn.addEventListener('mousedown', function () {
            this.style.cursor = 'none'; // keep hidden while dragging
        });

        btn.addEventListener('mouseup', function () {
            this.style.cursor = 'none';
        });
    });

    // ─── 5. Popup Open ────────────────────────────────────────────────────────
    galleryButtons.forEach(function (btn) {
        // Only main gallery buttons open the popup (not popup's own buttons)
        if (popupDialog && popupDialog.contains(btn)) return;

        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const activeIndex = mainSwiper ? mainSwiper.activeIndex : 0;

            if (!portalRoot || !popupDialog) return;

            const img = this.querySelector('img');
            if (img) resetZoom(img, this);
            hideCursor();

            // Show the portal/dialog
            portalRoot.style.display = 'block';
            portalRoot.setAttribute('data-headlessui-portal-state', 'open');
            document.body.style.overflow = 'hidden'; // prevent background scroll
            // Find swiper element inside popup
            const popupSwiperEl = popupDialog.querySelector('.swiper');

            if (popupSwiperEl) {
                // If already initialized → just slide to correct index
                if (popupSwiperEl.swiper) {
                    popupSwiperEl.swiper.slideTo(activeIndex, 0);
                    popupSwiper = popupSwiperEl.swiper;
                } else {
                    // Initialize popup swiper — vertical, no zoom
                    popupSwiper = new Swiper(popupSwiperEl, {
                        direction:     'vertical',
                        loop:          false,
                        slidesPerView: 1,
                        initialSlide:  activeIndex,
                    });
                }

                // Sync popup thumbnail nav (if any inside popup)
                syncPopupThumbnails(activeIndex);

                // Keep popup thumbnails in sync on slide change
                if (popupSwiper) {
                    popupSwiper.off('slideChange'); // avoid duplicate listeners
                    popupSwiper.on('slideChange', function () {
                        syncPopupThumbnails(popupSwiper.activeIndex);
                    });
                }
            }

            // Close button
            const closeBtn = popupDialog.querySelector('.product-gallery_galleryPanelClose__ySOUG');
            if (closeBtn) {
                // Replace onclick so no duplicate listeners build up
                closeBtn.onclick = function () {
                    portalRoot.style.display = 'none';
                    portalRoot.setAttribute('data-headlessui-portal-state', '');
                    document.body.style.overflow = 'auto'; // restore background scroll
                };
            }
        });
    });

    // ─── 6. Popup Thumbnail Sync (inside popup, if exists) ───────────────────
    function syncPopupThumbnails(activeIndex) {
        if (!popupDialog) return;
        const popupThumbs = popupDialog.querySelectorAll('.product-gallery-navigator_navigatorButton');
        popupThumbs.forEach(function (btn, i) {
            btn.classList.toggle('product-gallery-navigator_active', i === activeIndex);
            btn.setAttribute('aria-checked', i === activeIndex ? 'true' : 'false');
        });
    }

    // Popup thumbnail clicks → move popup swiper
    if (popupDialog) {
        const popupThumbs = popupDialog.querySelectorAll('.product-gallery-navigator_navigatorButton');
        popupThumbs.forEach(function (btn, index) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                if (popupSwiper) popupSwiper.slideTo(index);
            });
        });

        // Popup arrow buttons (if present)
        const popupArrowPrev = popupDialog.querySelector('.carousel-utils_arrowL__e_hk7');
        const popupArrowNext = popupDialog.querySelector('.carousel-utils_arrowR__7AZ0v');
        if (popupArrowPrev) {
            popupArrowPrev.addEventListener('click', function () {
                if (popupSwiper) popupSwiper.slidePrev();
            });
        }
        if (popupArrowNext) {
            popupArrowNext.addEventListener('click', function () {
                if (popupSwiper) popupSwiper.slideNext();
            });
        }
    }

    // ─── 7. Initial thumbnail state & arrow state ─────────────────────────────
    if (mainSwiper) {
        syncThumbnails(mainSwiper.activeIndex);
        updateArrowStates();
    }

});