import { calculateTimeRemaining } from "../../utils/timeManagement";
import { onDeleteListing } from "../../ui/listing/delete";
import { createSellerCard } from "./sellerCard";
import { onBidListing } from "../../ui/listing/bid";
import { createImageCarousel } from "../../utils/imageCarousel";
import { viewBidsModal } from "./viewBidsModal";
import { openAuthModal } from "../auth/authModal";

export function createListingDetailCard(listing) {
  const { title, description, media, seller, bids = [], endsAt, id } = listing;

  const timeRemaining = calculateTimeRemaining(endsAt);
  const isExpired = timeRemaining === "Expired";

  const currentUser = JSON.parse(localStorage.getItem("userInfo"));
  const isLoggedIn = currentUser && currentUser.name && currentUser.email;

  const isCurrentUserSeller =
    currentUser &&
    seller &&
    currentUser.name &&
    seller.name &&
    currentUser.email &&
    seller.email &&
    currentUser.name === seller.name &&
    currentUser.email === seller.email;

  const card = document.createElement("div");
  card.classList.add(
    "bg-white",
    "rounded-sm",
    "shadow-lg",
    "overflow-hidden",
    "flex",
    "flex-col",
    "w-full",
    "max-w-screen-lg",
    "mx-auto",
    "mt-10",
    "font-primary",
  );

  const imageCarousel = createImageCarousel(media);
  imageCarousel.classList.add("w-full", "h-96", "object-cover");
  card.appendChild(imageCarousel);

  const contentSection = document.createElement("div");
  contentSection.classList.add(
    "flex",
    "flex-col",
    "md:flex-row",
    "gap-6",
    "mt-6",
    "my-8",
    "p-6",
  );

  const detailsSection = document.createElement("div");
  detailsSection.classList.add("flex-1");

  const titleElement = document.createElement("h1");
  titleElement.classList.add("text-3xl", "font-semibold", "mb-4");
  titleElement.textContent = title;

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("text-gray-700", "mb-6");
  descriptionElement.textContent = description || "No description available.";

  const sellerCardElement = createSellerCard(seller);

  detailsSection.append(titleElement, descriptionElement, sellerCardElement);

  const actionsSection = document.createElement("div");
  actionsSection.classList.add("w-full", "md:w-72", "flex-shrink-0");

  const bidInfoContainer = document.createElement("div");
  bidInfoContainer.classList.add(
    "flex",
    "justify-between",
    "items-center",
    "mb-6",
  );

  const highestBidElement = document.createElement("span");
  highestBidElement.classList.add("font-bold", "text-xl", "text-deepTeal");
  highestBidElement.innerHTML =
    bids.length > 0
      ? `Highest Bid:<br>${new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.max(...bids.map((bid) => bid.amount)))}`
      : "No bids yet";

  const timeRemainingElement = document.createElement("span");
  timeRemainingElement.classList.add(
    "text-sm",
    "text-gray-500",
    "mb-auto",
    "text-right",
  );
  timeRemainingElement.innerHTML = "Time Remaining:<br>" + timeRemaining;

  bidInfoContainer.append(highestBidElement, timeRemainingElement);

  actionsSection.append(bidInfoContainer);

  if (bids.length > 0 && isLoggedIn) {
    const viewBidsButton = document.createElement("button");
    viewBidsButton.classList.add(
      "bg-freshSage",
      "font-bold",
      "border",
      "border-deepTeal",
      "py-2",
      "px-4",
      "rounded-sm",
      "hover:bg-freshSage/80",
      "hover:underline",
      "w-full",
      "mb-6",
    );
    viewBidsButton.textContent = "View Bids";

    viewBidsButton.addEventListener("click", () => {
      viewBidsModal(bids, title);
    });

    actionsSection.appendChild(viewBidsButton);
  }

  if (!isExpired && !isCurrentUserSeller) {
    if (isLoggedIn) {
      const bidInput = document.createElement("input");
      bidInput.type = "number";
      bidInput.name = "bidAmount";
      bidInput.placeholder = "Enter your bid amount";
      bidInput.classList.add(
        "w-full",
        "border",
        "border-deepTeal",
        "rounded-sm",
        "p-3",
        "mb-4",
      );
      bidInput.min = 1;

      const bidButton = document.createElement("button");
      bidButton.classList.add(
        "bg-deepTeal",
        "text-white",
        "py-3",
        "px-6",
        "rounded-sm",
        "hover:bg-deepTeal/85",
        "hover:underline",
        "w-full",
        "mb-6",
      );
      bidButton.textContent = "Place A Bid";

      bidButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const bidAmount = parseFloat(bidInput.value);

        if (!bidAmount || bidAmount <= 0) {
          alert("Please enter a valid bid amount.");
          return;
        }

        try {
          await onBidListing(id, bidAmount);
          toastr.success("Bid placed successfully!");
          bidInput.value = "";
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Failed to place bid:", error);
          alert(
            "Error placing bid. Make sure the bid is higher than the highest bid. Please try again.",
          );
        }
      });

      actionsSection.append(bidInput, bidButton);
    } else {
      const signInButton = document.createElement("button");
      signInButton.classList.add(
        "bg-deepTeal",
        "text-white",
        "py-3",
        "px-6",
        "rounded-sm",
        "hover:bg-deepTeal/85",
        "hover:underline",
        "w-full",
        "mb-6",
      );
      signInButton.textContent = "Sign In To Place A Bid";

      signInButton.addEventListener("click", () => {
        openAuthModal();
      });

      actionsSection.appendChild(signInButton);
    }
  }
  const actionButtonsContainer = document.createElement("div");
  actionButtonsContainer.classList.add("space-y-4");

  if (isCurrentUserSeller) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add(
      "bg-red-600",
      "text-white",
      "py-2",
      "px-6",
      "rounded-sm",
      "hover:bg-red-500",
      "hover:underline",
      "w-full",
      "border",
      "border-deepTeal",
    );
    deleteButton.textContent = "Delete Listing";
    deleteButton.dataset.listingId = id;
    deleteButton.addEventListener("click", onDeleteListing);
    actionButtonsContainer.appendChild(deleteButton);
  }

  actionsSection.append(actionButtonsContainer);

  contentSection.appendChild(detailsSection);
  contentSection.appendChild(actionsSection);

  card.appendChild(contentSection);

  return card;
}