import images from './gallery-items.js';

const galleryRef = document.querySelector('.js-gallery');
const backdropRef = document.querySelector('.js-lightbox');
const boxOverlayRef = document.querySelector('.lightbox__overlay');
const imageModalRef = document.querySelector('img.lightbox__image');
const buttonCloseModalRef = document.querySelector(
  'button[data-action="close-lightbox"]',
);

let currentNumberImage = 0;

galleryRef.append(...createItemTag(images));
galleryRef.addEventListener('click', showModal);
buttonCloseModalRef.addEventListener('click', closeModal);
boxOverlayRef.addEventListener('click', onOverlayClick);

function createItemTag(array) {
  return array.map(({ preview, original, description }) => {
    const li = document.createElement('li');
    const markup = `
        <a class="gallery__link" href="${original}"> 
            <img
                class="gallery__image"
                src="${preview}" 
                data-source="${original}" 
                alt="${description}"
            />
        </a>`;

    li.classList.add('gallery__item');
    li.insertAdjacentHTML('afterbegin', markup);

    return li;
  });
}

function showModal(event) {
  event.preventDefault();

  if (event.target.nodeName !== 'IMG') {
    return;
  }

  window.addEventListener('keydown', onPressKey);

  const imgHighQuality = event.target.dataset.source;
  const imgAltText = event.target.getAttribute('alt');

  currentNumberImage = getNumberImage(images, imgHighQuality);

  backdropRef.classList.add('is-open');
  imageModalRef.setAttribute('src', imgHighQuality);
  imageModalRef.setAttribute('alt', imgAltText);
}

function closeModal() {
  window.removeEventListener('keydown', onPressKey);
  backdropRef.classList.remove('is-open');
  imageModalRef.setAttribute('src', '');
  imageModalRef.setAttribute('alt', '');
}

function onOverlayClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function onPressKey(event) {
  if (event.code === 'Escape') {
    closeModal();
  } else {
    switchImage(event.code);
  }
}

function getNumberImage(array, image) {
  return array.findIndex(({ original }, index, arr) => {
    if (original === image) {
      return arr[index];
    }
  });
}

function switchImage(key) {
  // Next image
  if (key === 'ArrowRight') {
    if (currentNumberImage > images.length - 2) {
      return;
    } else {
      currentNumberImage += 1;
    }
    imageModalRef.setAttribute('src', images[currentNumberImage].original);

    // Previous image
  } else if (key === 'ArrowLeft') {
    if (currentNumberImage < 1) {
      return;
    } else {
      currentNumberImage -= 1;
    }
    imageModalRef.setAttribute('src', images[currentNumberImage].original);
  } else {
    return;
  }
}
