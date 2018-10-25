let deckPromise = getDeck();

startPlayer('One');

let pOneTotal = 0;
let pTwoTotal = 0;

let pOneStand = false;
let pTwoStand = false;

let evalAce = false;

function getDeck() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
            type: 'GET',
            success: (response) => {
                resolve(response);
            },
            error: (error) => {
                reject(error);
            }
        })
    });
}

function startPlayer(playerNum) {
    if(playerNum == 'One') {
        deckPromise.then((data) => {
            getCards(data.deck_id, 2).then((cardData) => {
                $('.pOneCardOne').attr('src', cardData.cards[0].image);
                $('.pOneCardTwo').attr('src', cardData.cards[1].image);
                getValue(cardData.cards[0].code, 'One');
                getValue(cardData.cards[1].code, 'One');
            });
        });
    } else {
        deckPromise.then((data) => {
            getCards(data.deck_id, 2).then((cardData) => {
                $('.pTwoCardOne').attr('src', cardData.cards[0].image);
                $('.pTwoCardTwo').attr('src', cardData.cards[1].image);
                getValue(cardData.cards[0].code, 'Two');
                getValue(cardData.cards[1].code, 'Two');
            });
        });
    }
}

function getCards(deckId, cardAmount) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${cardAmount}`,
            type: 'GET',
            success: (response) => {
                resolve(response);
            },
            error: (error) => {
                reject(error);
            }
        })
    })
}

function hit(playerNum) {
    deckPromise.then((data) => {
        getCards(data.deck_id, 1).then((cardData) => {
            if(playerNum == 'One') {
                $('.cardContainerOne').append(`<img src=${cardData.cards[0].image}>`);
                getValue(cardData.cards[0].code, playerNum);
            }
            else {
                $('.cardContainerTwo').append(`<img src=${cardData.cards[0].image}>`);
                getValue(cardData.cards[0].code, playerNum);
            }
        })
    })
}

function getValue(code, playerNum) {
    let val;
    if(code.charAt(0) == 'K' || code.charAt(0) == 'Q' || code.charAt(0) == 'J' || code.charAt(0) == 0) {
        val = 10;
    }
    else if(code.charAt(0) == 'A') {
        val = 0;
        evalAce = true;
    }
    else {
        val = Number(code.charAt(0));
    }
    return totalValue(val, playerNum);
}

function totalValue(cardVal, playerNum) {
    if (playerNum === 'One') {
        pOneTotal += cardVal;
        $('.pOneTotal').text(pOneTotal);
    }
    else {
        pTwoTotal += cardVal;
        $('.pTwoTotal').text(pTwoTotal);
    }
    endGame();
}

function stand(playerNum) {
    if(playerNum == 'One') {
        pOneStand = true;
        $('.standOne').attr('onclick', 'disabled');
        $('.hitOne').attr('onclick', 'disabled');
        startPlayer('Two');
        evaluateAce(playerNum);
    }
    else {
        pTwoStand = true;
        $('.standTwo').attr('onclick', 'disabled');
        $('.hitTwo').attr('onclick', 'disabled');
        evaluateAce(playerNum);
    }

    endGame();
}

function evaluateAce(playerNum) {
    if(evalAce == true) {
        let addVal = prompt('Would you like your Ace to equal 1 or 11?');
        evalAce = false;
        totalValue(Number(addVal), playerNum);
    }
}

function endGame() {
    if(pOneTotal > 21) {
        alert('Exceeded 21. Player Two Wins!');
        disable();
    }
    else if(pTwoTotal > 21) {
        alert('Exceeded 21. Player One Wins!');
        disable();
    }

    if(pOneStand == true && pTwoStand == true) {
        disable();

        if(pOneTotal > pTwoTotal) {
            alert('Player One Wins!');
        }
        else if (pOneTotal == pTwoTotal) {
            alert('Game Ended in a Tie!')
        }
        else {
            alert('Player Two Wins!');
        }
    }
}

function disable() {
    $('.standOne').attr('onclick', 'disabled');
    $('.hitOne').attr('onclick', 'disabled');
    $('.standTwo').attr('onclick', 'disabled');
    $('.hitTwo').attr('onclick', 'disabled');
}