/** Josh Bender - jbendercode@gmail.com
 *  Last Updated: Sept 23rd, 2017
 */

// Latin phrases
const proverbs = [];

// Latin Roots
const latin_roots = [];
var refresh;
var roots;
var footer;
var phrase;
var meaning;
var phrases;


/**
 * On document loaded
 */
document.addEventListener("DOMContentLoaded", function() {
  $.getJSON("/lib/latin_roots.json", function(json) {
    $(json).each(function(layer, value){
      latin_roots.push(value);
    });
  });
  $.getJSON("/lib/latin_phrases.json", function(json) {
    $(json).each(function(layer, value){
      proverbs.push(value);
    });
    newTab();
  });
});

/**
 * Once a new tab is open initalize
 */
function newTab() {
  // Initialize refresh and footer element
  refresh = document.getElementById("refresh");
  roots   = document.getElementById("roots");
  footer  = document.getElementById("footer");
  phrase  = document.getElementById('phrase');
  meaning = document.getElementById('meaning');
  phrases = document.getElementById('phrases');

  chrome.storage.sync.get("default", function(item) {
    if (item['default'] == "root"){
      roots.classList.add("selected-mode");
    } else {
      phrases.classList.add("selected-mode");
    }

    // Fade in footer
    fadeIn(refresh);
    setTimeout(fadeIn, 550, footer);

    // Set content on load
    refreshPhrase();

    // Set on click listener for refresh button
    refresh.addEventListener("click", refreshPhrase);
    roots.addEventListener("click", setRoot);
    phrases.addEventListener("click", setPhrase);
  });
};

/**
 * Refresh content on page
 */
function refreshPhrase(){
  chrome.storage.sync.get("default", function(item) {
    if (item['default'] == "root"){
      var root = getRandomFromArray(latin_roots);

      // Set values of inner HTML objects
      phrase.innerHTML = root.root;
      meaning.innerHTML = root.meaning;
    } else {
      var latinObj = getRandomFromArray(proverbs);

      // Set values of inner HTML objects
      phrase.innerHTML = latinObj.lat;
      meaning.innerHTML = latinObj.meaning;
    }

    fadeIn(phrase);
    fadeIn(meaning);
  });
}

function setRoot(){
  // Get random phrase
  chrome.storage.sync.set({"default": "root"});
  phrases.classList.remove("selected-mode");
  roots.classList.add("selected-mode");
}

function setPhrase(){
  // Get random phrase
  chrome.storage.sync.set({"default": "phrase"});
  phrases.classList.add("selected-mode");
  roots.classList.remove("selected-mode");
}

/**
 * Get a random item from an array
 * @param {Array} arrayToChooseFrom
 */
function getRandomFromArray(arrayToChooseFrom){
  var randomIndx =  Math.floor(Math.random() * arrayToChooseFrom.length);

  return arrayToChooseFrom[randomIndx];
}

/**
 * Fade in element
 * @param {HTMLElement} element
 */
function fadeIn(element) {
  // Set opacity to zero
  element.style.opacity = 0;

  // Set up inner function for animation
  var tick = function() {
    element.style.opacity = +element.style.opacity + 0.01;


    if (+element.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  };

  // Animate
  tick();
}

