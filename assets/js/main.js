"use strict";

window.onload = boot;

let menuToggleButton, menuElement, carouselContainer, navigationArrows, carouselItems;
let currentSlideIndex = 0;
let translatedSlidesCount = 0;

function boot() {
    menuToggleButton = document.querySelector(".main-header__toggle");
    menuElement = document.querySelector(`.${menuToggleButton.getAttribute("aria-controls")}`);
    carouselContainer = document.querySelector(".services__gallery__container");
    navigationArrows = document.querySelectorAll(".sliderArrow");
    carouselItems = document.querySelectorAll(".services__gallery__item");

    document.documentElement.removeAttribute("class");
    menuToggleButton.onclick = handleMenuToggle;
    navigationArrows.forEach(arrow => {
        arrow.onclick = handleChangeSlide;
    });

    window.addEventListener("resize", handleResize);
}

function handleMenuToggle() {
    let isMenuOpen = menuToggleButton.getAttribute("aria-expanded") === "true";
    isMenuOpen ? closeMenu() : openMenu();
}

function openMenu() {
    menuToggleButton.setAttribute("aria-expanded", "true");
    menuToggleButton.setAttribute("aria-label", `Close main menu`);
    menuElement.classList.add("open");
    menuElement.classList.remove("close");
}

function closeMenu() {
    menuToggleButton.setAttribute("aria-expanded", "false");
    menuToggleButton.setAttribute("aria-label", `Open main menu`);
    menuElement.classList.add("close");
    menuElement.classList.remove("open");
}

function handleChangeSlide() {
    this.id === "left" ? showPreviousSlide() : showNextSlide();
}

function showNextSlide() {
    if (translatedSlidesCount >= getMaxSlidesToTranslate()) return;
    const slideWidth = getCarouselItemWidth();
    translatedSlidesCount++;
    translateCarousel(slideWidth * -1);
}

function showPreviousSlide() {
    if (translatedSlidesCount <= 0) return;
    const slideWidth = getCarouselItemWidth();
    translateCarousel(slideWidth);
    translatedSlidesCount--;
}

function getCarouselItemWidth() {
    const itemWidth = getItemWidth();
    const gapWidth = getContainerGapWidth();
    return itemWidth + gapWidth;
}

function getContainerGapWidth() {
    return parseFloat(getComputedStyle(carouselContainer).gap);
}

function getItemWidth() {
    return carouselItems[0].getBoundingClientRect().width;
}

function getMaxSlidesToTranslate() {
    const containerWidth = getContainerWidth();
    const totalWidth = getItemWidth() * carouselItems.length;
    return Math.floor((totalWidth - containerWidth) / getCarouselItemWidth());
}

function getContainerWidth() {
    return carouselContainer.getBoundingClientRect().width;
}

function translateCarousel(value) {
    currentSlideIndex += value;
    carouselContainer.style.transform = `translateX(${currentSlideIndex}px)`;
}

function resetCarouselPosition() {
    carouselContainer.style.transform = `translateX(0px)`;
}

function handleResize() {
    translatedSlidesCount = 0;
    currentSlideIndex = 0;
    resetCarouselPosition();
}

window.addEventListener("resize", handleResize);
