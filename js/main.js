// Stvarne Google recenzije - ubaci do 10 komada ovdje (name, rating 1-5, text, date po želji).
// Carousel se automatski prikazuje čim ovaj niz nije prazan.
var googleReviews = [
  { name: "Tomislav Bartolic", rating: 5, text: "Jedan od najsuvremenijih i najkvalitetnijih Auto Servisa u cijeloj Zagrebačkoj županiji. Rješavaju sve vaše probleme na vašim automobilima. Za svaku preporuku svima.", date: "prije godinu dana" },
  { name: "Josip Petek", rating: 5, text: "Sve pohvale, dosao na blic, imali guzvu ali i dalje mehanicar pogledao auto, dijagnosticirao problem i uputio dalje na rješavanje.", date: "prije 3 mjeseca" },
  { name: "Tamara Korica", rating: 5, text: "Izvrsno iskustvo! Našli su problem u rekordnom vremenu, riješili iznimno brzo. Uz to su zbilja ugodna ekipa, profesionalni, brzi i ljubazni.", date: "prije 4 mjeseca" },
  { name: "Karlo Filipčić", rating: 5, text: "Kratko i jasno. Jedan od najboljih mehaničara na ovim prostorima, dečki se kuže u SVE. Svaki problem riješi se kao od šale. Brzina i kvaliteta, za svaku pohvalu!", date: "prije mjesec dana" },
  { name: "Rebeka Turina", rating: 5, text: "Ni sama ne znam koliko puta su me spasili doslovno odmah kad mi je trebalo, pristupačni, dragi, ljubazni… Sve što su ikad radili na mom autu je bilo vrhunski napravljeno, uvijek se odmah jave na telefon, svi moji ukućani i prijatelji koji su došli tamo po mojoj preporuci su isto tako zadovoljni i ponovno se tamo vraćaju iako nisu više blizu Zaprešića. Cvetko spas.", date: "prije godinu dana" },
  { name: "Teja Krušec", rating: 5, text: "Profesionalni, uslužni i prije svega pošteni autoservis!!!", date: "prije 8 mjeseci" },
  { name: "Helena", rating: 5, text: "Dugo sam bila u potrazi za korektan autoservis dok nisam došla na ovu adresu. Pristupačni, stručni, brzi i uvijek veseli. Spasili su mi auto brzom reakcijom i meni uštedili i vrijeme i novac koji sam gubila na loše automehaničare. Pohvale za gazdu i cijeli njegov tim. Iskrene preporuke.", date: "prije godinu dana" },
  { name: "Alex P.", rating: 5, text: "Ljubazno osoblje priteklo u pomoć u pravom trenutku. Uz njihovu stručnost moj ogromni problem, sa svim onim mini problemima koji bi se pojavili, postao je sitnica. Kad dečki znaju svoj posao i još su dobre volje! Hvala dečki!", date: "prije 3 godine" },
  { name: "Srećko Sabljić", rating: 5, text: "Top ekipa mehaničara i sve kaj vas muči vezano uz auto. Rijetkost da na jednom mjestu možete dobiti takvu uslugu. Svaka preporuka.", date: "prije godinu dana" },
  { name: "Ivica Mićin", rating: 5, text: "Oba Tomislava i svi dečki su super. Kvaliteta vrhunska, cijene pristupačne i posebna pohvala Ivanu Zločku. Ovo je početak jednog velikog prijateljstva. Lp od Kuge.", date: "prije 2 godine" },
];

document.addEventListener("DOMContentLoaded", function () {
  // Trust strip marquee: drive the loop distance from a measured pixel width
  // (via a CSS custom property) instead of relying on the browser to keep
  // recalculating a CSS "-50%" transform after the web font swaps in
  // (@font-face with font-display:swap reflows the text once Manrope loads,
  // and some engines don't reliably re-resolve percentage-based transforms
  // on a running animation after that reflow - that mismatch is what causes
  // the marquee to drift and land on a blank gap).
  var trustTrack = document.querySelector(".trust-track");
  var trustGroup = document.querySelector(".trust-group");
  if (trustTrack && trustGroup) {
    var setMarqueeDistance = function () {
      var w = trustGroup.getBoundingClientRect().width;
      if (w > 0) {
        trustTrack.style.setProperty("--marquee-shift", "-" + w + "px");
      }
    };
    setMarqueeDistance();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setMarqueeDistance);
    }
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setMarqueeDistance, 200);
    });
  }

  var hamburger = document.querySelector(".hamburger");
  var navLinks = document.querySelector(".nav-links");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      hamburger.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
      });
    });
  }

  var revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a");
  if (sections.length && navAnchors.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navAnchors.forEach(function (a) {
              a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach(function (sec) { navObserver.observe(sec); });
  }

  // Scroll progress bar + back-to-top button
  var progressBar = document.querySelector(".scroll-progress span");
  var backToTop = document.getElementById("back-to-top");
  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + "%";
    if (backToTop) {
      if (scrollTop > 500) backToTop.removeAttribute("hidden"), backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Animated stat counters
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute("data-count"), 10);
          var start = 0;
          var duration = 1200;
          var startTime = null;
          function step(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            el.textContent = Math.floor(start + (target - start) * progress);
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
  }

  // Google reviews carousel
  var reviewCarousel = document.getElementById("review-carousel");
  if (reviewCarousel && googleReviews.length) {
    var reviewTrack = document.getElementById("review-track");
    var reviewDots = document.getElementById("review-dots");
    var reviewPrev = document.getElementById("review-prev");
    var reviewNext = document.getElementById("review-next");

    var avatarColors = ["#6d28d9", "#1d4ed8", "#0f766e", "#b91c1c", "#c2410c", "#334155", "#1e293b", "#15803d", "#92400e", "#4338ca"];
    function colorForName(name) {
      var hash = 0;
      for (var i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
      return avatarColors[Math.abs(hash) % avatarColors.length];
    }

    googleReviews.forEach(function (r) {
      var slide = document.createElement("div");
      slide.className = "review-slide";
      var initials = r.name.split(" ").map(function (p) { return p[0]; }).slice(0, 2).join("").toUpperCase();
      slide.innerHTML =
        '<div class="review-stars" aria-hidden="true">' + "★".repeat(r.rating) + "☆".repeat(5 - r.rating) + '</div>' +
        '<p class="review-text">' + r.text + '</p>' +
        '<div class="review-author">' +
          '<span class="review-avatar" style="background:' + colorForName(r.name) + '">' + initials + '</span>' +
          '<span class="review-meta"><strong>' + r.name + '</strong><span class="review-date">' + (r.date || "Google recenzija") + '</span></span>' +
        '</div>';
      reviewTrack.appendChild(slide);

      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Prikaži recenziju od " + r.name);
      reviewDots.appendChild(dot);
    });

    reviewCarousel.removeAttribute("hidden");

    var slides = reviewTrack.querySelectorAll(".review-slide");
    var dots = reviewDots.querySelectorAll("button");
    var activeIndex = 0;
    var autoplayTimer = null;

    function goToSlide(i) {
      activeIndex = (i + slides.length) % slides.length;
      reviewTrack.scrollTo({ left: slides[activeIndex].offsetLeft, behavior: "smooth" });
      dots.forEach(function (d, idx) { d.classList.toggle("active", idx === activeIndex); });
    }
    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(function () { goToSlide(activeIndex + 1); }, 5000);
    }
    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    dots.forEach(function (d, idx) {
      d.addEventListener("click", function () { goToSlide(idx); startAutoplay(); });
    });
    reviewPrev.addEventListener("click", function () { goToSlide(activeIndex - 1); startAutoplay(); });
    reviewNext.addEventListener("click", function () { goToSlide(activeIndex + 1); startAutoplay(); });
    reviewCarousel.addEventListener("mouseenter", stopAutoplay);
    reviewCarousel.addEventListener("mouseleave", startAutoplay);
    reviewCarousel.addEventListener("touchstart", stopAutoplay, { passive: true });

    var scrollDebounce;
    reviewTrack.addEventListener("scroll", function () {
      clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(function () {
        var trackCenter = reviewTrack.scrollLeft + reviewTrack.clientWidth / 2;
        var closest = 0, closestDist = Infinity;
        slides.forEach(function (s, idx) {
          var dist = Math.abs((s.offsetLeft + s.clientWidth / 2) - trackCenter);
          if (dist < closestDist) { closestDist = dist; closest = idx; }
        });
        activeIndex = closest;
        dots.forEach(function (d, idx) { d.classList.toggle("active", idx === activeIndex); });
      }, 100);
    }, { passive: true });

    goToSlide(0);
    startAutoplay();
  }

  // Gallery lightbox
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var galleryItems = document.querySelectorAll(".gallery-item");
  function openLightbox(item) {
    var img = item.querySelector("img");
    var caption = item.querySelector(".gallery-caption");
    if (!img || !lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : "";
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.setAttribute("hidden", "");
    document.body.style.overflow = "";
  }
  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(item);
      }
    });
  });
  if (lightbox) {
    lightbox.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
      el.addEventListener("click", closeLightbox);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !lightbox.hasAttribute("hidden")) closeLightbox();
    });
  }

  // Prefill booking form from ?service= query param (CTA links coming in from /usluge/ sub-pages)
  var bfServiceSelectFromUrl = document.getElementById("bf-service");
  if (bfServiceSelectFromUrl) {
    var urlParams = new URLSearchParams(window.location.search);
    var serviceParam = urlParams.get("service");
    if (serviceParam) {
      Array.prototype.forEach.call(bfServiceSelectFromUrl.options, function (opt) {
        if (opt.value === serviceParam) bfServiceSelectFromUrl.value = serviceParam;
      });
    }
  }

  // Service quick-links (service cards + price list): prefill booking form + scroll to it
  var serviceLinks = document.querySelectorAll(".service-link");
  var bfServiceSelect = document.getElementById("bf-service");
  if (serviceLinks.length && bfServiceSelect) {
    serviceLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var service = link.getAttribute("data-service");
        if (service) bfServiceSelect.value = service;
        var target = document.getElementById("rezervacija");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(function () {
          var nameInput = document.getElementById("bf-name");
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 600);
      });
    });
  }

  // Booking form validation + simulated submit
  var bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    var dateInput = document.getElementById("bf-date");
    if (dateInput) {
      var today = new Date();
      var yyyy = today.getFullYear();
      var mm = String(today.getMonth() + 1).padStart(2, "0");
      var dd = String(today.getDate()).padStart(2, "0");
      dateInput.min = yyyy + "-" + mm + "-" + dd;
    }

    function setFieldError(input, message) {
      var field = input.closest(".field");
      var errorEl = bookingForm.querySelector('[data-error-for="' + input.id + '"]');
      if (field) field.classList.toggle("has-error", !!message);
      if (errorEl) errorEl.textContent = message || "";
    }

    var vinInput = document.getElementById("bf-vin");
    if (vinInput) {
      vinInput.addEventListener("input", function () {
        vinInput.value = vinInput.value.toUpperCase();
      });
    }

    function validateField(input) {
      if (input.name === "website") return true;
      if (input.id === "bf-date" && input.value) {
        var day = new Date(input.value + "T00:00:00").getDay();
        if (day === 0 || day === 6) {
          setFieldError(input, "Radimo pon - pet. Odaberite drugi datum.");
          return false;
        }
      }
      if (input.id === "bf-year" && input.value) {
        var year = parseInt(input.value, 10);
        var maxYear = new Date().getFullYear() + 1;
        if (year < 1960 || year > maxYear) {
          setFieldError(input, "Unesite godište između 1960. i " + maxYear + ".");
          return false;
        }
      }
      if (input.id === "bf-vin" && input.value) {
        if (!/^[A-HJ-NPR-Z0-9]{5,17}$/.test(input.value)) {
          setFieldError(input, "VIN sadrži 5-17 znakova (slova i brojevi, bez I, O, Q).");
          return false;
        }
      }
      if (input.type === "checkbox") {
        if (input.required && !input.checked) {
          setFieldError(input, "Potrebna je suglasnost za nastavak.");
          return false;
        }
        setFieldError(input, "");
        return true;
      }
      if (input.required && !input.value.trim()) {
        setFieldError(input, "Ovo polje je obavezno.");
        return false;
      }
      if (input.type === "email" && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        setFieldError(input, "Unesite ispravnu email adresu.");
        return false;
      }
      if (input.type === "tel" && input.value && input.value.replace(/[^0-9]/g, "").length < 6) {
        setFieldError(input, "Unesite ispravan broj telefona.");
        return false;
      }
      setFieldError(input, "");
      return true;
    }

    bookingForm.querySelectorAll("input, select, textarea").forEach(function (input) {
      if (input.name === "website") return;
      input.addEventListener("blur", function () { validateField(input); });
    });

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var honeypot = bookingForm.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      var fields = Array.prototype.slice.call(
        bookingForm.querySelectorAll("input[required], select[required], textarea[required]")
      );
      var allValid = fields.reduce(function (valid, input) {
        var fieldValid = validateField(input);
        return valid && fieldValid;
      }, true);

      if (!allValid) {
        var firstError = bookingForm.querySelector(".has-error input, .has-error select, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      bookingForm.classList.add("is-submitting");
      setTimeout(function () {
        bookingForm.classList.remove("is-submitting");
        bookingForm.querySelectorAll(".field, .field-check").forEach(function (f) { f.style.display = "none"; });
        bookingForm.querySelector(".form-actions").style.display = "none";
        var success = bookingForm.querySelector(".form-success");
        if (success) success.removeAttribute("hidden");
      }, 700);
    });
  }
});
