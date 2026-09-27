// Image lightbox: click an image inside post content to view it full-size.
// Close by clicking anywhere on the overlay or pressing Escape.
(function () {
    "use strict";

    var overlay = null;
    var zoomedImage = null;
    var captionElement = null;

    function createOverlay() {
        var container = document.createElement("div");
        container.className = "image-lightbox";
        container.setAttribute("role", "dialog");
        container.setAttribute("aria-modal", "true");

        zoomedImage = document.createElement("img");
        zoomedImage.className = "image-lightbox-figure";

        captionElement = document.createElement("div");
        captionElement.className = "image-lightbox-caption";

        container.appendChild(zoomedImage);
        container.appendChild(captionElement);
        container.addEventListener("click", closeLightbox);
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeLightbox();
            }
        });
        document.body.appendChild(container);
        return container;
    }

    function openLightbox(sourceImage) {
        if (!overlay) {
            overlay = createOverlay();
        }
        // currentSrc reflects the resolution actually picked by srcset/lazy-loading.
        zoomedImage.src = sourceImage.currentSrc || sourceImage.src;
        zoomedImage.alt = sourceImage.alt || "";
        captionElement.textContent = sourceImage.alt || "";
        captionElement.hidden = !sourceImage.alt;
        overlay.classList.add("image-lightbox-visible");
        // Lock background scrolling while the lightbox is open.
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        if (!overlay || !overlay.classList.contains("image-lightbox-visible")) {
            return;
        }
        overlay.classList.remove("image-lightbox-visible");
        document.body.style.overflow = "";
    }

    // Event delegation instead of per-image listeners, so images rendered
    // after page load (e.g. by client-side markdown or Vue) also work.
    document.addEventListener("click", function (event) {
        var target = event.target;
        if (!(target instanceof HTMLImageElement)) {
            return;
        }
        // Only post content images should zoom, not avatars, icons or banners.
        if (!target.closest(".post-body")) {
            return;
        }
        // Images wrapped in a link keep their own navigation behavior.
        if (target.closest("a")) {
            return;
        }
        event.preventDefault();
        openLightbox(target);
    });
})();
