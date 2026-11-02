/**
 * Unified Menu functionality
 * Handles mobile menu, dropdown panels, and TOC smooth scrolling
 */

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // MOBILE MENU FUNCTIONALITY
  // ========================================

  // Make toggleMobileMenu globally available
  window.toggleMobileMenu = function () {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.toggle("hidden");
    }
  };

  // ========================================
  // DROPDOWN FUNCTIONALITY
  // ========================================

  // Initialize all dropdowns with common classes
  const dropdownToggles = document.querySelectorAll(".menu-button");

  dropdownToggles.forEach(function (toggle) {
    const panel = document.getElementById(
      toggle.id.replace("-toggle", "-panel")
    );

    if (panel) {
      let isPinned = false;
      let hoverTimeout;

      // Show dropdown on hover
      toggle.addEventListener("mouseenter", function () {
        if (!isPinned) {
          clearTimeout(hoverTimeout);
          panel.classList.remove("invisible");
          panel.classList.add("visible");
        }
      });

      // Hide dropdown when leaving button (unless pinned)
      toggle.addEventListener("mouseleave", function () {
        if (!isPinned) {
          hoverTimeout = setTimeout(() => {
            panel.classList.add("invisible");
            panel.classList.remove("visible");
          }, 150);
        }
      });

      // Keep dropdown open when hovering over it
      panel.addEventListener("mouseenter", function () {
        clearTimeout(hoverTimeout);
      });

      // Hide dropdown when leaving the panel (unless pinned)
      panel.addEventListener("mouseleave", function () {
        if (!isPinned) {
          hoverTimeout = setTimeout(() => {
            panel.classList.add("invisible");
            panel.classList.remove("visible");
          }, 150);
        }
      });

      // Click to pin/unpin dropdown
      toggle.addEventListener("click", function () {
        isPinned = !isPinned;
        clearTimeout(hoverTimeout);

        if (isPinned) {
          panel.classList.remove("invisible");
          panel.classList.add("visible");
        } else {
          panel.classList.add("invisible");
          panel.classList.remove("visible");
        }

        // Toggle TOC icon if this is the TOC button
        if (toggle.id === "toc-toggle") {
          const icon = document.getElementById("toc-icon");
          if (icon) {
            if (isPinned) {
              icon.className = "fas fa-times text-xl";
            } else {
              icon.className = "fas fa-list-ul text-xl";
            }
          }
        }
      });

      // Click outside to close (only if pinned)
      document.addEventListener("click", function (e) {
        if (
          isPinned &&
          !toggle.contains(e.target) &&
          !panel.contains(e.target)
        ) {
          isPinned = false;
          clearTimeout(hoverTimeout);
          panel.classList.add("invisible");
          panel.classList.remove("visible");

          // Reset TOC icon if this is the TOC button
          if (toggle.id === "toc-toggle") {
            const icon = document.getElementById("toc-icon");
            if (icon) {
              icon.className = "fas fa-list-ul text-xl";
            }
          }
        }
      });
    }
  });

  // ========================================
  // TABLE OF CONTENTS FUNCTIONALITY
  // ========================================

  const tocOverlay = document.getElementById("toc-panel");

  if (tocOverlay) {
    // Smooth scroll for TOC links
    const tocLinks = tocOverlay.querySelectorAll('a[href^="#"]');
    tocLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Calculate offset to account for fixed header
          const headerOffset = 8 * 16; // 8rem = 128px
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });

          // Close TOC after clicking a link (unless pinned)
          // Check if the dropdown is currently pinned by looking at the panel visibility
          const isPinned = !tocOverlay.classList.contains("invisible");
          if (!isPinned) {
            tocOverlay.classList.add("invisible");
            tocOverlay.classList.remove("visible");

            // Reset TOC icon when closing via link click
            const icon = document.getElementById("toc-icon");
            if (icon) {
              icon.className = "fas fa-list-ul text-xl";
            }
          }
        }
      });
    });
  }
});
