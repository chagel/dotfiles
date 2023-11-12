// ==UserScript==
// @name         iTrello 
// @description  Preferred Trello experience
// @author       mgc
// @include      https://trello.com/*
// @version      1.0.0
// @grant        none
// @run-at       document-end
// ==/UserScript==

function _hideElementsByClass(className) {
  els = document.getElementsByClassName(className)
  for (let i=0; i < els.length; i++) {
    els[i].style.display = 'none'
  }
}

function hideLists() {
  console.debug("Hide lists")
  board = document.getElementById("board")
  boards = 'Staging|Backlog|Doing|Testing'

  let re = new RegExp(boards, 'g')
  for (let i=0; i < board.children.length; i++) {
    list = board.children[i]
    title = list.firstElementChild.firstElementChild.firstElementChild.nextElementSibling
    if(title && !title.innerText.match(re)) {
      // list.style.display = 'none'
    }
  }
}

function compactCards() {
  console.debug("Compact cards")
  _hideElementsByClass("list-card-cover")
}

function hideBadges() {
  console.debug("Hide badges")
  _hideElementsByClass("badges")
}

function showCardIds() {
  console.debug("Show card id")
  ids = document.getElementsByClassName("card-short-id")
  for (let i=0; i < ids.length; i++) {
    ids[i].classList.remove('hide')
    ids[i].style.fontWeight = '600'
  }
}

function hideStickers() {
  console.debug("hide stickers")
  _hideElementsByClass("list-card-stickers-area")
}

function hideBanner() {
  console.debug("hide banner")
  var banners = document.getElementById("banners")
  banners.style.display = 'none'
}

window.iTrello = function() {
  hideLists()
  compactCards()
  hideBadges()
  showCardIds()
  hideStickers()
  hideBanner()
}

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    header = document.getElementById('header')
    magic = document.createElement("button")
    magic.innerText = "❤️"
    magic.addEventListener("click", window.iTrello, false)
    header.appendChild(magic)
  }
}
