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
        this.dataUrl = {}
    }

    makeObject() {
        names.forEach((image, i) => {
            finalObject[i + 2] = {
                image: image,
                status: 0
            }
        })

        if (this.getUrlData() !== undefined) {
            // 0s2p2s1p3s2p4s1p5s1p6s2p8s1p10s1p11s1p12s1p13s1
            let urlData = this.getUrlData();
            urlData = urlData.split('p');
            urlData.forEach(element => {
                let elementId = element.split('s')[0];
                let elementStatus = element.split('s')[1];
                finalObject[elementId].status = elementStatus;
            })

            console.log(finalObject);
        }
    }

    getUrlData() {
        let urlText = window.location.href;
        let urlData = urlText.split('?data=')[1];
        return urlData
    }

    renderAllCards() {
        for (let key in finalObject) {
            let cardImage = finalObject[key].image;
            let cardId = key;
            let cardStatus = finalObject[key].status;
            let newCard = new Card(cardImage, cardId, cardStatus);
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
const copyText = document.querySelector('.copy__body-text');
const copyInput = document.querySelector('.copy__input');

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
    if (!copyCircle.classList.contains('copy__circle--active')) {
        copyCircle.classList.toggle('copy__circle--active');
    } else {
        setTimeout(function() {
            copyCircle.classList.toggle('copy__circle--active');
        }, 500)
    }
    copyButton.querySelector('.copy__body').classList.toggle('copy__body--show');
    let newLink = window.location.href + `?data=${makeLinkText()}`;
    navigator.clipboard.writeText(newLink).then(function() {
        copyText.classList.add('copy__body-text--success');
        copyText.classList.remove('copy__body-text--fail');
        copyText.innerText = 'Успешно скопировано в буфер обмена';
    }, function(err) {
        copyText.classList.add('copy__body-text--fail');
        copyText.classList.remove('copy__body-text--success');
        copyText.innerText = 'Что-то пошло не так';
    });
    copyInput.value = newLink;
    copyInput.select();
    window.history.pushState("", "", `/?data=${makeLinkText()}`);
})