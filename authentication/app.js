// ---------------------- Toaster ----------------------

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) {
    console.error("Toast container not found!");
    return;
  }

  const toastEl = document.createElement("div");
  toastEl.className = [
    "toast",
    "fade",
    "align-items-center",
    `text-bg-${type === "error" ? "danger" : "success"}`,
    "border-0",
  ].join(" ");
  toastEl.setAttribute("role", "alert");
  toastEl.setAttribute("aria-live", "assertive");
  toastEl.setAttribute("aria-atomic", "true");
  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close">
      </button>
    </div>
  `;

  container.appendChild(toastEl);

  const toast = new bootstrap.Toast(toastEl, { delay: 3000, autohide: true });
  toast.show();

  toastEl.addEventListener("hidden.bs.toast", () => {
    toastEl.remove();
  });
}

// ---------------------- Validation ----------------------

function isAuthenticated() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const role = localStorage.getItem("role");

  return accessToken && refreshToken && role ? true : false;
}

// ---------------------- Register ----------------------

function registerUser(user) {
  return new Promise((resolve, reject) => {
    const username = user.username.trim().toLowerCase();

    let users = [];
    try {
      const storedUsers = localStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) users = [];
    } catch {
      users = [];
    }

    const userExists = users.some(u => u.username === username);
    if (userExists) {
      reject("این نام کاربری قبلاً ثبت شده. لطفاً نام دیگری انتخاب کنید.");
      return;
    }

    users.push({
      username: username,
      password: user.password,
      role: user.role,
    });

    try {
      localStorage.setItem("users", JSON.stringify(users));
      resolve();
    } catch {
      reject("خطا در ذخیره‌سازی. دوباره تلاش کنید.");
    }
  });
}

// ---------------------- Login ----------------------

function loginUser(creds) {
  return new Promise((resolve, reject) => {
    const username = creds.username.trim().toLowerCase();

    let users = [];
    try {
      const storedUsers = localStorage.getItem("users");
      users = storedUsers ? JSON.parse(storedUsers) : [];
      if (!Array.isArray(users)) users = [];
    } catch {
      users = [];
    }

    const found = users.find(
      u => u.username === username && u.password === creds.password
    );

    if (!found) {
      reject("نام کاربری یا رمز عبور اشتباه است.");
      return;
    }

    const accessToken = "access-" + Date.now() + "-" + Math.random().toString(36).substr(2);
    const refreshToken = "refresh-" + Date.now() + "-" + Math.random().toString(36).substr(2);

    try {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", found.role);
    } catch {
      reject("خطا در فرآیند ورود. دوباره تلاش کنید.");
      return;
    }

    resolve({ accessToken, refreshToken, role: found.role });
  });
}

// ---------------------- Dashboard And Forms ----------------------

const userContent = `
  <h2>داشبورد کاربر</h2>
  <ul>
    <li>مشاهده محصولات</li>
    <li>ویرایش اطلاعات کاربری</li>
  </ul>
`;

const adminContent = `
  <h2>داشبورد مدیر</h2>
  <ul>
    <li>مشاهده محصولات</li>
    <li>ویرایش اطلاعات کاربری</li>
    <li>مشاهده کاربران</li>
    <li>اضافه کردن محصول</li>
  </ul>
`;

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const dashboardContent = document.getElementById("dashboard-content");
  const logoutBtn = document.getElementById("logout-btn");

  const currentPath = window.location.pathname.split("/").pop();

  const auth = isAuthenticated();

  if (currentPath === "dashboard.html") {
    if (!auth) {
      window.location.href = "login.html";
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "admin") {
      if (dashboardContent) dashboardContent.innerHTML = adminContent;
    } else {
      if (dashboardContent) dashboardContent.innerHTML = userContent;
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("role");
        window.location.href = "index.html";
      });
    }

  } else if (currentPath === "login.html") {
    if (auth) {
      window.location.href = "dashboard.html";
      return;
    }

    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("loginUsername");
        const passwordInput = document.getElementById("loginPassword");

        if (!usernameInput.value.trim() || !passwordInput.value) {
          showToast("لطفاً همهٔ فیلدها را کامل کنید.", "error");
          return;
        }

        const creds = {
          username: usernameInput.value,
          password: passwordInput.value,
        };

        loginUser(creds)
          .then(() => {
            showToast("ورود با موفقیت انجام شد!");
            setTimeout(() => {
              window.location.href = "dashboard.html";
            }, 1000);
          })
          .catch(err => {
            showToast(err, "error");
          });
      });
    }

  } else if (currentPath === "register.html") {
    if (auth) {
      window.location.href = "dashboard.html";
      return;
    }

    if (registerForm) {
      registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("registerUsername");
        const passwordInput = document.getElementById("registerPassword");
        const roleInput = document.getElementById("role");

        if (!usernameInput.value.trim() || !passwordInput.value || !roleInput.value) {
          showToast("لطفاً همهٔ فیلدها را کامل کنید.", "error");
          return;
        }

        const newUser = {
          username: usernameInput.value,
          password: passwordInput.value,
          role: roleInput.value,
        };

        registerUser(newUser)
          .then(() => {
            showToast("ثبت‌نام با موفقیت انجام شد!");
            setTimeout(() => {
              window.location.href = "login.html";
            }, 1000);
          })
          .catch(err => {
            showToast(err, "error");
          });
      });
    }

  } else if (currentPath === "index.html" || currentPath === "") {
    if (auth) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "login.html";
    }
  }
});
