import { tabStyles } from "./styles";

/**
 * Creates tab buttons for switching between Login and Register forms.
 *
 * @returns {HTMLElement} The tabs container.
 */

export function createAuthTabs() {
  const tabs = document.createElement("div");
  tabs.classList.add(...tabStyles.container);

  const loginTab = document.createElement("button");
  loginTab.id = "login-tab";
  loginTab.textContent = "Login";
  loginTab.classList.add(...tabStyles.tab, ...tabStyles.activeTab);

  const registerTab = document.createElement("button");
  registerTab.id = "register-tab";
  registerTab.textContent = "Register";
  registerTab.classList.add(...tabStyles.tab, "text-gray-500");

  loginTab.addEventListener("click", () => {
    document.getElementById("login-form").classList.remove("hidden");
    document.getElementById("register-form").classList.add("hidden");
    loginTab.classList.add(...tabStyles.activeTab);
    loginTab.classList.remove("text-gray-500");
    registerTab.classList.remove(...tabStyles.activeTab);
    registerTab.classList.add("text-gray-500");
  });

  registerTab.addEventListener("click", () => {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
    registerTab.classList.add(...tabStyles.activeTab);
    registerTab.classList.remove("text-gray-500");
    loginTab.classList.remove(...tabStyles.activeTab);
    loginTab.classList.add("text-gray-500");
  });

  tabs.append(loginTab, registerTab);
  return tabs;
}
