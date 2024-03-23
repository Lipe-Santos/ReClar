"use strict";
window.onload = boot;

let menuButton, menu, slideshow, slideshowImages, sliderArrows, services;
let isDragging = false, prevPageX, prevScrollLeft, galleryImageWidth, scrollWidth, positionDiff;

function boot() {
    menuButton = document.querySelector(".main-header__toggle");
    menu = document.querySelector(`.${menuButton.getAttribute("aria-controls")}`);
    services = document.querySelector(".services");
    slideshow = document.querySelector(".services__gallery .row");
    slideshowImages = document.querySelectorAll(".services__gallery__image");
    sliderArrows = document.querySelectorAll(".sliderArrow");
    
    document.documentElement.removeAttribute("class");
    services.addEventListener("mousemove", getSlideshowWidths);
    initializeSlider();
}

function toggleMenu() {
    let isOpen = menuButton.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
}

function openMenu() {
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", `Close main menu`);
    menu.classList.add("open");
    menu.classList.remove("close");
}

function closeMenu() {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", `Open main menu`);
    menu.classList.add("close");
    menu.classList.remove("open");
}

function getSlideshowWidths() {
    const gap = parseFloat(getComputedStyle(slideshow).gap.replace(/[^0-9\.]+/g,''));
    const firstImageWidth = slideshowImages[0].getBoundingClientRect().width;
    scrollWidth = slideshow.scrollWidth - slideshow.clientWidth;
    galleryImageWidth = firstImageWidth + gap;
}

function initializeSlider() {
    dragSlider();
    arrowsEventHandler();
}

function dragSlider() {
    menuButton.addEventListener("click", toggleMenu);
    window.addEventListener("mouseup", dragStop);
    window.addEventListener("mouseleave", dragStop);
    window.addEventListener("touchend", dragStop);

    slideshow.addEventListener("mousedown", dragStart);
    slideshow.addEventListener("touchstart", dragStart);

    slideshow.addEventListener("mousemove", dragging);
    slideshow.addEventListener("touchmove", dragging);
    preventImageDragging();
}

function arrowsEventHandler() {
    sliderArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            slideshow.scrollLeft += arrow.id === "left" ? -galleryImageWidth : galleryImageWidth;
            showOrHideNavigationArrows();
            setTimeout(() => showOrHideNavigationArrows(), 200); // chamar depois de 200ms
        });
    });
}

function showOrHideNavigationArrows() {
    //margem de segurança
    const margin = 100;

    if (slideshow.scrollLeft <= margin) {
        sliderArrows[0].classList.add("hidden")
    } else {
        sliderArrows[0].classList.remove("hidden")
    }

    if (slideshow.scrollLeft >= (scrollWidth - margin)) {
        sliderArrows[1].classList.add("hidden")
    } else {
        sliderArrows[1].classList.remove("hidden")   
    }
}

function dragStart(e) {
    prevPageX = e.pageX || e.touches[0].pageX;
    prevScrollLeft = slideshow.scrollLeft;
    isDragging = true;
}

function dragStop() {
    isDragging = false;
    slideshow.classList.remove("dragging");
}

function dragging(e) {
    e.preventDefault();
    if (!isDragging) return;
    slideshow.classList.add("dragging");
    positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;
    slideshow.scrollLeft = prevScrollLeft - positionDiff;
    showOrHideNavigationArrows();
}

function preventImageDragging() {
    slideshowImages.forEach(image => {
        image.ondragstart = () => false;
    });
}