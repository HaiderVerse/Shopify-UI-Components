document.addEventListener('DOMContentLoaded', function () {
  let docHtml = document.querySelector('html');
  let docBody = document.body;
  let navMobileMenu = document.getElementById('site-nav-mobile-menu');
  let navMobileNavParent = document.getElementById('nav-mobile');
  let navMobileNav = navMobileNavParent.querySelectorAll('.nav-mobile');
  let closeButton = document.getElementById('nav-mobile-close');
  let navMobileAccordion = navMobileNavParent.querySelectorAll('.nav-mobile__accordion');
  let navMobileAccordionHeading = navMobileNavParent.querySelectorAll('.nav-mobile__accordion-heading');
  let navMobileOverlay = document.getElementById('overlay');
  let header_height = document.querySelector('.header-nav.main_container');
  // let announcement_bar_height = document.querySelector('.section-announcement-bar');
  let site_nav__children__wrapper = document.querySelectorAll('.site-nav__children__wrapper');
  const itemLi = document.querySelectorAll('.naveMenu li');
  
  
  navMobileMenu.addEventListener("click", function( event ) {
  
    navMobileNav.forEach(function(item) {
      item.classList.toggle('nav-mobile--open');
    });
  
    docBody.classList.toggle('nav-mobile--active');
    docHtml.classList.toggle('nav-mobile--html-active');
    closeButton.classList.add('nav-mobile__mobile-menu-close-button-aicon--active');
  
    navMobileOverlay.classList.add('overlay--active');
  }, false);
  
  navMobileAccordion.forEach(function(accordionMenu) {
    accordionMenu.querySelector('.nav-mobile__accordion-heading').addEventListener("click", function (event) {
      if(!this.classList.contains('nav-mobile__accordion-heading--alt')) {
        event.preventDefault();
      }
  
      let accordion = this.closest('.nav-mobile__accordion');
      if (accordion.classList.contains('nav-mobile__accordion--open')) {
        accordion.classList.remove('nav-mobile__accordion--open');
        return;
      }
      else {
        navMobileNav.forEach((item) => {
          item.scrollTop = 0;
        });
      }
  
      navMobileAccordion.forEach(function(accordion){
        accordion.classList.remove('nav-mobile__accordion--open');
      });
  
      accordion.classList.toggle('nav-mobile__accordion--open');
  
    });
  
    if (accordionMenu.querySelector('.nav-mobile__accordion-content-prev') != null) {
      accordionMenu.querySelector('.nav-mobile__accordion-content-prev').addEventListener('click', function() {
        this.closest('.nav-mobile__accordion').classList.remove('nav-mobile__accordion--open');
      });
    }
  
  });
  
  
  
  // Add event to close button
  function closeMobileNav(event) {
    //console.log(event.target);
  
    docBody.classList.remove('nav-mobile--active');
    docHtml.classList.remove('nav-mobile--html-active');
    docBody.classList.remove('mobile-open');
    closeButton.classList.remove('nav-mobile__mobile-menu-close-button-aicon--active');
  
    navMobileOverlay.classList.remove('overlay--active');
  
    navMobileNav.forEach(function(item) {
      item.classList.remove('nav-mobile--open');
    });
  }
  if(closeButton) {
    closeButton.addEventListener("click", closeMobileNav);
  }
  
  navMobileOverlay.addEventListener("click", closeMobileNav);
  
  window.addEventListener("load", function () {
    try {
      // Trigger closing the mobile nav
      window.addEventListener('resize', function() {
        if(window.innerWidth > 1359) {
          closeButton.click();
        }
      });
  
      //Initialize Carousel on Mobile Menu
      const swiperMobile = document.getElementById('nav-mobile-swiper');
      const swiperModules = window.SwiperModules;
      const swiperArrowPrev = document.getElementById('nav-mobile-arrow-prev');
      const swiperArrowNext = document.getElementById('nav-mobile-arrow-next');
      var swiper = new window.Swiper(swiperMobile, {
        modules: [swiperModules.Navigation],
        slidesPerView: 1,
        loop: false,
        breakpoints: {
          // when window width is >= 768px
          768: {
            slidesPerView: 1
          }
        },
        navigation: {
          prevEl: swiperArrowPrev,
          nextEl: swiperArrowNext
        }
      });
    }
    catch (e) {
      // No Swiper
      console.log('catch');
    }
  });
  if (header_height) {
    // let totalHeight = announcement_bar_height.offsetHeight + header_height.offsetHeight; // Calculate total height
    // console.log(totalHeight)
    site_nav__children__wrapper.forEach(item => {
      item.style.top = `${header_height.offsetHeight}px`; // Apply combined height as `top`
    });
  }
  // itemLi.forEach(item => {
  //     item.addEventListener('mouseover', () => {
  //         const childWrapper = item.querySelector('.site-nav__children__wrapper');
  //         if (childWrapper) {
  //             childWrapper.style.opacity = '1';
  //             childWrapper.style.transform = 'scaleY(1) translateY(1px)';
  //         }
  //     });
  
  //     item.addEventListener('mouseout', () => {
  //         const childWrapper = item.querySelector('.site-nav__children__wrapper');
  //         if (childWrapper) {
  //             childWrapper.style.opacity = '0';
  //             childWrapper.style.transform = 'scaleY(0) translateY(0)';
  //         }
  //     });
  // });
})