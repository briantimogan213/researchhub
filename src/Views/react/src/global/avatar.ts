export default function() {
  // dropdown avatar
  const avatarBtn = document.getElementById("profile-avatar-dropdown-btn");
  const avatarDropdown = document.getElementById("profile-avatar-dropdown");
  if (avatarBtn && avatarDropdown) {

    const hideDropdown = () => {
      if (!avatarDropdown.classList.contains("hidden")) {
        avatarDropdown.classList.add("scale-y-0");
        setTimeout(() => {
          avatarDropdown.classList.add("hidden");
        }, 200)
      }
    }
    const showDropdown = () => {
      if (avatarDropdown.classList.contains("hidden")) {
        avatarDropdown.classList.remove("hidden");
        setTimeout(() => {
          avatarDropdown.classList.remove("scale-y-0");
        }, 10)
      }
    }
    const toggleDropdown = () => {
      if (avatarDropdown.classList.contains("hidden")) {
        showDropdown()
      } else {
        hideDropdown()
      }
    }

    avatarBtn.addEventListener("click", toggleDropdown);
    document.getElementById('root')?.setAttribute("tabindex", "0");
    document.getElementById('root')?.addEventListener("focus", (e) => {
      e.preventDefault();
      hideDropdown();
    });
  }
}