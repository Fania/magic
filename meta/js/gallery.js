"use strict";

// modals for all images
const images = document.getElementsByTagName("img");
for(let i=0; i < images.length; i++){
  images[i].addEventListener("click", toggleModal);
}

function toggleModal() {
  let modal = document.createElement("div");
  document.body.appendChild(modal);
  modal.id = "modal";
  let img = event.srcElement.cloneNode();
  modal.appendChild(img);
  modal.addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}