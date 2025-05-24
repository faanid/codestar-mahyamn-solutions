const card = document.querySelector(".card");

card.addEventListener("mousemove", (e) => {
  const { width, height, left, top } = card.getBoundingClientRect();
  const x = e.clientX - left;
  const y = e.clientY - top;
  const rotateX = (y / height - 0.5) * -20;
  const rotateY = (x / width - 0.5) * 20;
  card.style.setProperty("--rotateX", `${rotateX}deg`);
  card.style.setProperty("--rotateY", `${rotateY}deg`);
  card.classList.add("tilt");
});

card.addEventListener("mouseleave", () => {
  card.style.setProperty("--rotateX", `0deg`);
  card.style.setProperty("--rotateY", `0deg`);
  card.classList.remove("tilt");
});
