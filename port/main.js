document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    const editIcon = box.querySelector(".edit-icon");
    const portNumber = box.querySelector(".port-number");

    editIcon.addEventListener("click", () => {
      if (box.querySelector(".edit-input")) return;

      const currentValue = portNumber.textContent.trim();

      portNumber.style.display = "none";
      editIcon.style.display = "none";

      const input = document.createElement("input");
      input.type = "number";
      input.className = "edit-input";
      input.value = currentValue;
      input.min = "0";
      input.autofocus = true;

      const saveButton = document.createElement("button");
      saveButton.textContent = "ثبت";
      saveButton.className = "save-button";

      box.appendChild(input);
      box.appendChild(saveButton);
      input.addEventListener("input", () => {
        if (input.value && !/^\d+$/.test(input.value)) {
          input.value = input.value.replace(/[^\d]/g, "");
        }
      });

      saveButton.addEventListener("click", () => {
        const newValue = input.value.trim();

        if (newValue === "") {
          portNumber.style.display = "inline";
          editIcon.style.display = "inline";
        } else {
          portNumber.textContent = newValue;
          portNumber.style.display = "inline";
          editIcon.style.display = "inline";
        }

        input.remove();
        saveButton.remove();
      });
    });
  });
});
