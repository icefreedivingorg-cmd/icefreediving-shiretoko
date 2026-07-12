/* =========================================================
   ICE FREEDIVING SHIRETOKO — i18n engine
   Requires TRANSLATIONS (from translations.js) to be loaded first.
   ========================================================= */
(function(){
  var SUPPORTED = ["ja","en","zh","ko"];
  var DEFAULT_LANG = "ja";

  function getStoredLang(){
    try{
      var l = localStorage.getItem("ifs_lang");
      if(l && SUPPORTED.indexOf(l) !== -1) return l;
    }catch(e){}
    return null;
  }

  function detectLang(){
    var stored = getStoredLang();
    if(stored) return stored;
    var nav = (navigator.language || "ja").toLowerCase();
    if(nav.indexOf("en") === 0) return "en";
    if(nav.indexOf("zh") === 0) return "zh";
    if(nav.indexOf("ko") === 0) return "ko";
    return DEFAULT_LANG;
  }

  function lookup(dict, key){
    var parts = key.split(".");
    var cur = dict;
    for(var i=0;i<parts.length;i++){
      if(cur == null) return undefined;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function t(key, lang){
    var dict = (window.TRANSLATIONS && window.TRANSLATIONS[lang]) || {};
    var val = lookup(dict, key);
    if(val === undefined){
      var fallback = (window.TRANSLATIONS && window.TRANSLATIONS[DEFAULT_LANG]) || {};
      val = lookup(fallback, key);
    }
    return val;
  }

  function applyLang(lang){
    if(SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function(el){
      var key = el.getAttribute("data-i18n");
      var val = t(key, lang);
      if(val === undefined) return;
      el.innerHTML = val;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
      var spec = el.getAttribute("data-i18n-attr");
      spec.split(";").forEach(function(pair){
        pair = pair.trim();
        if(!pair) return;
        var idx = pair.indexOf(":");
        var attr = pair.slice(0, idx);
        var key = pair.slice(idx+1);
        var val = t(key, lang);
        if(val !== undefined) el.setAttribute(attr, val);
      });
    });

    document.querySelectorAll(".lang-switch button").forEach(function(btn){
      btn.classList.toggle("active", btn.getAttribute("data-lang-btn") === lang);
    });

    try{ localStorage.setItem("ifs_lang", lang); }catch(e){}
    document.dispatchEvent(new CustomEvent("langchange", {detail:{lang:lang}}));
  }

  function initLangSwitch(){
    document.querySelectorAll(".lang-switch button").forEach(function(btn){
      btn.addEventListener("click", function(){
        applyLang(btn.getAttribute("data-lang-btn"));
      });
    });
  }

  window.IFS_I18N = {
    t: function(key){ return t(key, document.documentElement.getAttribute("data-lang") || DEFAULT_LANG); },
    applyLang: applyLang,
    getLang: function(){ return document.documentElement.getAttribute("data-lang") || DEFAULT_LANG; }
  };

  document.addEventListener("DOMContentLoaded", function(){
    initLangSwitch();
    applyLang(detectLang());
  });
})();
