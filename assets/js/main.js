/* =========================================================
   ICE FREEDIVING SHIRETOKO — main.js
   ========================================================= */
(function(){
  document.addEventListener("DOMContentLoaded", function(){

    /* ---- header scroll state ---- */
    var header = document.querySelector(".site-header");
    if(header){
      var onScroll = function(){
        header.classList.toggle("scrolled", window.scrollY > 10);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, {passive:true});
    }

    /* ---- mobile nav ---- */
    var toggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    var scrim = document.querySelector(".nav-scrim");
    function closeNav(){
      if(navLinks) navLinks.classList.remove("open");
      if(scrim) scrim.classList.remove("open");
      if(toggle) toggle.setAttribute("aria-expanded","false");
    }
    if(toggle && navLinks){
      toggle.addEventListener("click", function(){
        var isOpen = navLinks.classList.toggle("open");
        if(scrim) scrim.classList.toggle("open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true":"false");
      });
      if(scrim) scrim.addEventListener("click", closeNav);
      navLinks.querySelectorAll("a").forEach(function(a){
        a.addEventListener("click", closeNav);
      });
    }

    /* ---- mark active nav link ---- */
    var path = (location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".nav-links a[href]").forEach(function(a){
      var href = a.getAttribute("href");
      if(href === path || (path === "" && href === "index.html")){
        a.classList.add("active");
      }
    });

    /* ---- lightbox ---- */
    var lightbox = document.querySelector(".lightbox");
    if(lightbox){
      var lbImg = lightbox.querySelector("img");
      var lbCap = lightbox.querySelector(".lb-cap");
      document.querySelectorAll("[data-lightbox]").forEach(function(trigger){
        trigger.addEventListener("click", function(e){
          e.preventDefault();
          var full = trigger.getAttribute("data-lightbox");
          var cap = trigger.getAttribute("data-caption") || "";
          lbImg.setAttribute("src", full);
          lbCap.textContent = cap;
          lightbox.classList.add("open");
        });
      });
      lightbox.addEventListener("click", function(e){
        if(e.target === lightbox || e.target.classList.contains("lb-close")){
          lightbox.classList.remove("open");
          lbImg.setAttribute("src","");
        }
      });
      document.addEventListener("keydown", function(e){
        if(e.key === "Escape") { lightbox.classList.remove("open"); lbImg.setAttribute("src",""); }
      });
    }

    /* ---- contact form (FormSubmit AJAX) ---- */
    var form = document.querySelector("#entry-form");
    if(form){
      var successBox = document.querySelector(".form-success");
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var submitBtn = form.querySelector("button[type=submit]");
        var originalText = submitBtn ? submitBtn.textContent : "";
        if(submitBtn){ submitBtn.disabled = true; submitBtn.textContent = "..."; }

        fetch(form.action, {
          method:"POST",
          body:new FormData(form),
          headers:{ "Accept":"application/json" }
        }).then(function(res){
          return res.json().catch(function(){ return {}; });
        }).then(function(){
          if(successBox) successBox.classList.add("show");
          form.reset();
          form.style.display = "none";
        }).catch(function(){
          window.location.href = "mailto:volcanocuporg@gmail.com";
        }).finally(function(){
          if(submitBtn){ submitBtn.disabled = false; submitBtn.textContent = originalText; }
        });
      });
    }

  });
})();
