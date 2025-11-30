const track = document.querySelector('.carousel-track');
  const items = Array.from(track.children);
  let index = 0;

  function updateCarousel() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  // Cambia de item cada 3 segundos
  setInterval(() => {
    index = (index + 1) % items.length;
    updateCarousel();
  }, 3000);
