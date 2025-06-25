document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".box");

  boxes.forEach((box) => {
    const editIcon = box.querySelector(".edit-icon");
    const portNumber = box.querySelector(".port-number");

    editIcon.addEventListener("click", () => {
      if (box.querySelector("input")) return;

      const currentValue = portNumber.textContent.trim();
      const input = document.createElement("input");
      input.type = "number";
      input.className = "edit-input";
      input.value = currentValue;

      const saveButton = document.createElement("button");
      saveButton.textContent = "ثبت";
      saveButton.className = "save-button";

      portNumber.style.display = "none";

      box.append(input, saveButton);

      saveButton.addEventListener("click", () => {
        const newValue = input.value.trim();

        const isValueEmpty = newValue === "";
        if (!isValueEmpty) {
          portNumber.textContent = newValue;
        }

        portNumber.style.display = "inline";
        editIcon.style.display = "inline";

        input.remove();
        saveButton.remove();
      });
    });
  });
});
