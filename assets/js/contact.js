(function ($) {
  "use strict";

  function showFeedback($box, type, message) {
    $box
      .removeClass("is-success is-error")
      .addClass(type === "success" ? "is-success" : "is-error")
      .text(message)
      .show();
  }

  function bindForm(selector, successMessage) {
    var $form = $(selector);
    if (!$form.length) {
      return;
    }

    $form.on("submit", function (event) {
      event.preventDefault();

      var $feedback = $form.find(".form-feedback");
      if (!$feedback.length) {
        $feedback = $("#form-messages");
      }

      var valid = true;
      $form.find("[required]").each(function () {
        if (!$.trim($(this).val())) {
          valid = false;
        }
      });

      if (!valid) {
        showFeedback($feedback, "error", "Por favor completa los campos obligatorios.");
        return;
      }

      showFeedback($feedback, "success", successMessage);
      $form.find("input[type='text'], input[type='email'], input[type='tel'], textarea").val("");
      $form.find("select").prop("selectedIndex", 0);
    });
  }

  bindForm("#contact-form", "Gracias. Recibimos tu mensaje y te contactaremos pronto.");

  var $mobileNav = $("#mobile-navbar-menu");
  $mobileNav.find("li").has("ul").addClass("has-sub");
  $mobileNav.find(".has-sub").each(function () {
    if (!$(this).children(".submenu-button").length) {
      $(this).prepend('<span class="submenu-button"></span>');
    }
  });
  $mobileNav.on("click", ".submenu-button", function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).toggleClass("submenu-opened");
    $(this).siblings("ul").slideToggle(200);
  });
  $mobileNav.on("click", ".menu-item-has-children > a, .has-sub > a", function (event) {
    event.preventDefault();
    var $button = $(this).siblings(".submenu-button");
    if ($button.length) {
      $button.trigger("click");
    }
  });

  $("#mobile-navbar-menu").on("click", "a[href^='#']", function () {
    var href = $(this).attr("href");
    if (!href || href === "#" || $(this).parent().is(".menu-item-has-children, .has-sub")) {
      return;
    }
    $("body").removeClass("nav-expanded");
  });

  $(".nav-menu > .menu-item-has-children > a[href='#']").on("click", function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  });

  var $menu = $(".menu-sticky");
  var $hero = $("#home");
  function updatePastHero() {
    if (!$menu.length || !$hero.length || window.innerWidth > 991) {
      $menu.removeClass("past-hero");
      return;
    }
    var headerH = $menu.outerHeight() || 0;
    $menu.toggleClass("past-hero", $hero[0].getBoundingClientRect().bottom <= headerH + 40);
  }
  $(window).on("scroll resize", updatePastHero);
  updatePastHero();

  var $lightbox = $("#why-choose-lightbox");
  var $player = $lightbox.find("video");
  var defaultVideoSrc = "assets/video/why-choose.mp4";

  function closeWhyChooseVideo() {
    if ($player[0]) {
      $player[0].pause();
    }
    $lightbox.prop("hidden", true);
    $("body").removeClass("why-choose-lightbox-open");
  }

  $(".js-why-choose-play").on("click", function () {
    var videoSrc = $(this).attr("data-video-src") || defaultVideoSrc;
    if ($player.attr("src") !== videoSrc) {
      $player.attr("src", videoSrc);
    }
    $lightbox.prop("hidden", false);
    $("body").addClass("why-choose-lightbox-open");
    var playPromise = $player[0].play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  });

  $lightbox.on("click", "[data-why-choose-close]", closeWhyChooseVideo);

  var $gallery = $("#gallery-lightbox");
  var $galleryImg = $gallery.find(".gallery-lightbox__image");
  var $galleryCap = $gallery.find(".gallery-lightbox__caption");
  var galleryItems = [];
  var galleryIndex = 0;

  function galleryList() {
    var items = [];
    $("#projects .owl-item:not(.cloned) .project-item").each(function () {
      var $img = $(this).find(".project-img img");
      items.push({
        src: $img.attr("src"),
        alt: $img.attr("alt") || "",
        cat: $.trim($(this).find(".category").text())
      });
    });
    return items;
  }

  function showGallery(index) {
    galleryItems = galleryList();
    if (!galleryItems.length) {
      return;
    }
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    var item = galleryItems[galleryIndex];
    $galleryImg.attr({ src: item.src, alt: item.alt });
    $galleryCap.text(item.cat);
    $gallery.prop("hidden", false);
    $("body").addClass("gallery-lightbox-open");
  }

  function closeGallery() {
    $gallery.prop("hidden", true);
    $galleryImg.removeAttr("src");
    $("body").removeClass("gallery-lightbox-open");
  }

  $("#projects").on("click", ".project-item", function (event) {
    event.preventDefault();
    var src = $(this).find(".project-img img").attr("src");
    galleryItems = galleryList();
    var index = -1;
    $.each(galleryItems, function (i, item) {
      if (item.src === src) {
        index = i;
        return false;
      }
    });
    showGallery(index < 0 ? 0 : index);
  });

  $gallery.on("click", "[data-gallery-close]", closeGallery);
  $gallery.on("click", "[data-gallery-prev]", function (event) {
    event.stopPropagation();
    showGallery(galleryIndex - 1);
  });
  $gallery.on("click", "[data-gallery-next]", function (event) {
    event.stopPropagation();
    showGallery(galleryIndex + 1);
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape" && !$lightbox.prop("hidden")) {
      closeWhyChooseVideo();
    }
    if ($gallery.prop("hidden")) {
      return;
    }
    if (event.key === "Escape") {
      closeGallery();
    }
    if (event.key === "ArrowLeft") {
      showGallery(galleryIndex - 1);
    }
    if (event.key === "ArrowRight") {
      showGallery(galleryIndex + 1);
    }
  });

  $(".js-renaware-play").on("click", function () {
    var $btn = $(this);
    var $frame = $btn.closest(".renaware-player__frame");
    var $video = $frame.find("video");
    var videoSrc = $btn.attr("data-video-src");
    if ($video.attr("src") !== videoSrc) {
      $video.attr("src", videoSrc);
    }
    $frame.addClass("is-playing");
    var playPromise = $video[0].play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  });
})(jQuery);
