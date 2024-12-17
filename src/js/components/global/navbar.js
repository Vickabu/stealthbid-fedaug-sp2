import { navbarStyles } from "../../utils/styles";
import { createAuthModal, openAuthModal } from "../auth/authModal";
import { logout } from "../../ui/global/logout";

/**
 * Creates a navbar with a Sign In button and a global authentication modal.
 * The modal includes Login and Register forms and supports toggling between them.
 *
 * @example
 * createNavbarAndModal();
 * document.body.appendChild(navbar);
 */

export async function createNavbarAndModal() {
  const navbar = createNavbar();
  const modal = createAuthModal();

  document.body.insertAdjacentElement("afterbegin", navbar);
  document.body.insertAdjacentElement("beforeend", modal);
}

/**
 * Creates the navbar element.
 *
 * @returns {HTMLElement} The navbar element.
 */

function createNavbar() {
  const header = document.querySelector("header");

  const navbar = document.createElement("nav");
  navbar.classList.add(...navbarStyles.container);

  const innerContainer = document.createElement("div");
  innerContainer.classList.add(...navbarStyles.innerContainer);

  const logo = document.createElement("img");
  logo.src = "/BrightLogo.png";
  logo.alt = "Logo";
  logo.classList.add(...navbarStyles.logo);
  logo.addEventListener("click", () => {
    window.location.href = "/";
  });

  const rightContainer = document.createElement("div");
  rightContainer.classList.add("flex", "gap-8");

  const authButton = document.createElement("button");
  authButton.id = "auth-btn";
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const parsedUserInfo = JSON.parse(userInfo);
    const avatarUrl = parsedUserInfo.avatar.url;
    const avatarAlt = parsedUserInfo.avatar.alt;
    const userName = parsedUserInfo.name;

    authButton.textContent = "Log Out";
    authButton.classList.add(...navbarStyles.logoutButton);
    authButton.addEventListener("click", logout);

    const profileButton = document.createElement("button");
    profileButton.classList.add(...navbarStyles.avatarButton);

    const avatarImage = document.createElement("img");
    avatarImage.src = avatarUrl;
    avatarImage.alt = avatarAlt;
    avatarImage.classList.add(...navbarStyles.avatarImage);

    profileButton.appendChild(avatarImage);

    profileButton.addEventListener("click", () => {
      window.location.href = `/profile/?name=${userName}`;
    });

    const homeLink = document.createElement("a");
    homeLink.href = "/";
    homeLink.classList.add(...navbarStyles.links);
    homeLink.textContent = "Home";

    const createListingLink = document.createElement("a");
    createListingLink.href = "/listing/create/";
    createListingLink.classList.add(...navbarStyles.links);
    createListingLink.textContent = "Create Listing";

    rightContainer.append(
      homeLink,
      createListingLink,
      profileButton,
      authButton,
    );
  } else {
    authButton.textContent = "Sign In";
    authButton.classList.add(...navbarStyles.loginButton);
    authButton.addEventListener("click", openAuthModal);

    rightContainer.append(authButton);
  }

  innerContainer.append(logo, rightContainer);
  navbar.appendChild(innerContainer);

  header.append(navbar);

  return header;
}