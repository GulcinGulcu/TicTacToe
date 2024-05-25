const cards = document.querySelectorAll('.card');
const cardArr = Array.from(cards);
const container = document.querySelector('.container');
const cardOne = document.querySelector('#one');
const cardTwo = document.querySelector('#two');
const cardThree = document.querySelector('#three');
const cardFour = document.querySelector('#four');
const cardFive = document.querySelector('#five');
const cardSix = document.querySelector('#six');
const cardSeven = document.querySelector('#seven');
const cardEight = document.querySelector('#eight');
const cardNine = document.querySelector('#nine');

const successComputerMessage = document.querySelector('.success-message-computer');
const successPlayerMessage = document.querySelector('.success-message-player');
const drawMessage =document.querySelector('.message-draw');
const playAgainButton = document.querySelector('.btn-play-again');

//In the game, when we put X, we are also going to add class x to that card to keep track of the cards.

const x = 'X';
const o = 'O';
const classX = 'x';
const classO = 'o';

function makeArr(...args) {
    const arr = []
    args.forEach(arg => arr.push(arg));
    return arr;
}

// Combinations to check the winning or defense conditions.
const combinationOne = makeArr(cardOne, cardTwo, cardThree);
const combinationTwo = makeArr(cardFour, cardFive, cardSix);
const combinationThree = makeArr(cardSeven, cardEight, cardNine);
const combinationFour = makeArr(cardOne, cardFour, cardSeven);
const combinationFive = makeArr(cardTwo, cardFive, cardEight);
const combinationSix = makeArr(cardThree, cardSix, cardNine);
const combinationSeven = makeArr(cardOne, cardFive, cardNine);
const combinationEight = makeArr(cardThree, cardFive, cardSeven);
//game arr
const gameArr = makeArr(combinationOne, combinationTwo, combinationThree, combinationFour, combinationFive, combinationSix, combinationSeven, combinationEight);

cards.forEach(card => card.addEventListener('click', handleClick));

function handleClick(e) {
    const targetEl = e.currentTarget;
    if (!targetEl.classList.contains(classX) && !targetEl.classList.contains(classO)) {
        targetEl.textContent = x;
        targetEl.classList.add(classX);
        setTimeout(computerPlay, 300);
    }

    //We exclude cards that have x and o to find unmarked cards. 
    const cardsNotContainClassX = cardArr.filter(card => !card.classList.contains(classX));
    const cardsNotContainClass = cardsNotContainClassX.filter(card => !card.classList.contains(classO));
    
    // Computer has to know the combinations that have two X in order to defend itself. In every click we keep track of 'danger' for computer side.
    const twoX = gameArr.filter(arr => arr.filter(card => card.classList.contains(classX)).length === 2);
    const oneLevelArrTwoX = [].concat(...twoX); // just making two levels of array into one level in order to work on it easily.

    
    //Just for random play to add O without x combinations
    const arrWithoutX = gameArr.filter(arr => !arr.some(card => card.classList.contains(classX)));


    function computerPlay() {
        //In order to attack, computer also keeps track of combinations that have two O.
        const cardsContainsTwoO = gameArr.filter(arr => arr.filter(card => card.classList.contains(classO)).length === 2);
        const arrContainsTwoO = [].concat(...cardsContainsTwoO); //just turning it one level array. 
        
        //the situation where two O and two X:
        if ((cardsContainsTwoO.length > 0 && twoX.length > 0) || cardsContainsTwoO.length > 0) {
            const elmWithoutClassO = arrContainsTwoO.find(card => !card.classList.contains(classO)); //winning opportunity
            const elmEmptyO = arrContainsTwoO.find(card => card.classList.length === 1); // in case defended before, looks for another winning opportunity
            const elmEmpty = oneLevelArrTwoX.find(card => card.classList.length === 1); // also check two X and danger situation: finds two X and one empty combination.
            if (!elmWithoutClassO.classList.contains(classX)) { // if there is no X there, computer wins. not making defense.
                elmWithoutClassO.innerText = o;
                elmWithoutClassO.classList.add(classO);
            } else if(elmEmptyO) {
                elmEmptyO.innerText = o;
                elmEmptyO.classList.add(classO);
            } else if (elmEmpty) {
                //commputer looks for danger and makes defense here.
                elmEmpty.innerText = o;
                elmEmpty.classList.add(classO);

            } else {
                const number = Math.floor(Math.random() * cardsNotContainClass.length);
                cardsNotContainClass[number].textContent = o;
                cardsNotContainClass[number].classList.add(classO);
            }
        } else if (twoX.length > 0) { //in case of danger
            const el = oneLevelArrTwoX.find(card => !card.classList.contains(classX)); //find the element that does not contain X;
            const ell = oneLevelArrTwoX.find(card => card.classList.length === 1); // In case defensed before, find the empty card with two X combinations if there is.
            if (!el.classList.contains(classO)) {
                //defense itself
                el.innerText = o;
                el.classList.add(classO);
            } else if (el.classList.contains(classO) && ell) {
                //if defensed before, again looks for danger and defense
                ell.innerText = o;
                ell.classList.add(classO);
            } else {
                const number = Math.floor(Math.random() * cardsNotContainClass.length);
                cardsNotContainClass[number].textContent = o;
                cardsNotContainClass[number].classList.add(classO);
            }
        } else if (arrWithoutX.length > 0) {
            //random part
            const number = Math.floor(Math.random() * arrWithoutX.length);
            const cardRandom = Math.floor(Math.random() * 3);
            
            if (!arrWithoutX[number][cardRandom].classList.contains(classO)) {
                arrWithoutX[number][cardRandom].textContent = o;
                arrWithoutX[number][cardRandom].classList.add(classO);

            } else if(arrWithoutX[number][cardRandom].classList.contains(classO)) {
                const elmWithoutO = arrWithoutX[number].find(card => !card.classList.contains(classO));
                elmWithoutO.innerText = o;
                elmWithoutO.classList.add(classO);
            }

        }

        const winnerO = gameArr.find(combination => combination.every(card => card.classList.contains(classO)));
        if(winnerO && !winnerX) {
            winnerO.forEach(card => card.style.color = 'red');
            setTimeout(successComputer, 500);
        } 
    }

    const winnerX = gameArr.find(combination => combination.every(card => card.classList.contains(classX)));

    if(winnerX) {
        winnerX.forEach(card => card.style.color = 'red');
        setTimeout(successMessage, 500);
    }

    if(cardsNotContainClass.length === 0 && !winnerX) {
        setTimeout(draw, 500);
    }

}

function successMessage() {
    successPlayerMessage.style.display = 'block';
    cards.forEach(card => card.removeEventListener('click', handleClick));
    playAgainButton.style.display = 'block';
    
}

function successComputer() {
    successComputerMessage.style.display = 'block';
    cards.forEach(card => card.removeEventListener('click', handleClick));
    playAgainButton.style.display = 'block';
}

function draw () {
    drawMessage.style.display = 'block';
    cards.forEach(card => card.removeEventListener('click', handleClick));
    playAgainButton.style.display = 'block';
}
