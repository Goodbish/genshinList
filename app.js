// import file names 
import {names} from './names.js';

function init() {
    let cards = new List();
    cards.makeObject();
    cards.renderAllCards();
    cards.attachStatusEvent();
    console.log(cardList);
}

let finalObject = {
    0: {
        image: 'UI_AvatarIcon_PlayerBoy.png',
        status: 0
    },
    1: {
        image: 'UI_AvatarIcon_PlayerGirl.png',
        status: 0
    }
};

let cardList = [];

const listElement = document.querySelector('.list');
const mainCharactersElement = document.querySelector('.header__characters');

class Card {
    constructor(image, id, status = 0) {
        this.image = image,
        this.status = status,
        this.id = id,
        this.cardHTML = `<div class="card" data-id="${this.id}" data-status="${this.status}">
            <img src="./assets/${this.image}" alt="" class="card__image">
            <div class="card__check circle"></div>
        </div>`
    }

    renderCard() {
        listElement.insertAdjacentHTML('beforeend', this.cardHTML);
    }

    renderMainCharacters() {
        mainCharactersElement.insertAdjacentHTML('beforeend', this.cardHTML);
    }
}

class List {
    constructor() {
        this.statusValues = {
            unset: 0,
            have: 1,
            want: 2
        };
    }

    makeObject() {
        names.forEach((image, i) => {
            finalObject[i + 2] = {
                image: image,
                status: 0
            }
        })
    }

    renderAllCards() {
        for (let key in finalObject) {
            let cardImage = finalObject[key].image;
            let cardId = key;
            let newCard = new Card(cardImage, cardId);
            cardList.push(newCard);
            // id 0 and 1 for main characters
            if (cardId < 2) {
                newCard.renderMainCharacters();
            } else {
                newCard.renderCard();
            }
        }
    }

    attachStatusEvent() {
        const allCards = document.querySelectorAll('.card');
        let statuses = this.statusValues;
        allCards.forEach(card => {
            card.addEventListener('click', function() {
                // so the idea is that status values are numbers
                // First of all we check current status
                // then we convert it to number and + 1. Simple!
                // but before that we need to check if it is last status number
                // in that case we just reset status to 0

                let currentStatus = Number(card.getAttribute('data-status'));
                let lastKey = Object.keys(statuses).pop();
                let lastStatusElement = Number(statuses[lastKey]);
                currentStatus !== lastStatusElement ? currentStatus++ : currentStatus = 0;
                card.setAttribute('data-status', currentStatus);

                // change status in main object
                let dataId = Number(card.getAttribute('data-id'));
                finalObject[dataId].status = currentStatus;
                console.log(finalObject);
            })
        })
    }
}

init();

const copyButton = document.querySelector('.copy__button');
const copyCircle = document.querySelector('.copy__circle');

function makeLinkText() {
    let newResult = {};
    for (let key in finalObject) {
        if (!finalObject[key].status == 0) {
            newResult[Number(key)] = {
                s : finalObject[key].status
            }
        }
    }
    newResult = JSON.stringify(newResult);
    newResult = newResult.replaceAll('},','p');
    newResult = newResult.replaceAll(/[{}":]/gm,'');
    return newResult
}

copyCircle.addEventListener('click', function() {
    copyButton.querySelector('.copy__body').classList.toggle('copy__body--show');
    // let newLink = window.location.href + `?data=${makeLinkText()}`;
    window.history.pushState("", "", `/?data=${makeLinkText()}`);
})



// Copy functional