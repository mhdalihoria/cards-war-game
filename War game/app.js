//Constant variable declarations
const newDeck = document.getElementById('btn-deck')
const drawCard = document.querySelector('.btn-draw')
const cardContainer= document.getElementById('card-container')
const card1Container = document.getElementById('card1-container')
const card2Container = document.getElementById('card2-container')
const remainingCards = document.getElementById('remaining')
const result = document.getElementById('result')
const computerScoreSpan = document.getElementById('computer-score')
const playerScoreSpan = document.getElementById('player-score')

//Changable variable declarations
let deckId
let cardsArray = ["2", "3", "4", "5", "6", "7", "8", "9", "JACK", "QUEEN", "KING", "ACE"]
let computerScore = 0
let playerScore = 0

//----------------------------------------------------------------------------------//

//adding event listener for the newDeck button
newDeck.addEventListener('click', generateNewDeck)

//Generating new Deck function
function generateNewDeck() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
        .then(response => response.json())
        .then(data => {
            deckId = data.deck_id
            remainingCards.innerHTML = `Remaining Cards: ${data.remaining}`
        })
    
    // Making the drawCard button functional & Adding an event listener to it
    drawCard.classList.remove('disabled')
    drawCard.addEventListener('click', drawNewCard)
}

//Drawing new Card
function drawNewCard(){
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(response => response.json())
        .then(data => {
            cardContainer.children[0].innerHTML = `
                    <img src="${data.cards[0].image}" id="cards">
            `
            cardContainer.children[1].innerHTML = `
                    <img src="${data.cards[1].image}" id="cards">
            `

            remainingCards.innerHTML = `Remaining Cards: ${data.remaining}`

            //Adding Score to the score variables and showing them in the DOM
            addingScore(data.cards[0], data.cards[1])

            //Deciding the winner when the game is done
            determineWinner(data.remaining)

            //Restarting the game when there's no cards in the deck
            if(data.remaining === 0 && drawCard.classList.contains('disabled')){
                newDeck.addEventListener('click', restartGame)
            }

        })
}

function addingScore(card1, card2){
    //Getting the cards values and converting these values into numbers
    let card1Value = card1.value
    let card1Index = cardsArray.indexOf(card1Value)
    let card2Value = card2.value
    let card2Index = cardsArray.indexOf(card2Value)

    //Compairing the value numbers to add Score
    if(card1Index > card2Index) {
        computerScoreSpan.textContent = ++computerScore
    }
    else if(card1Index < card2Index) {
        playerScoreSpan.textContent = ++playerScore
    }
}

function determineWinner(Remaining) {

    if(Remaining === 0){
        //Disabling the newCard feature when there is no more cards in the deck
        drawCard.removeEventListener('click', drawNewCard)
        drawCard.classList.add('disabled')

        //Displaying the winner when the game is over
        if(playerScore > computerScore) {
            result.textContent = `Player Wins!`
        } else if(playerScore < computerScore) {
            result.textContent = `You Lose`
        } else if(playerScore === computerScore) {
            result.textContent = `It's a tie! Try again`
        }
    }
}

function restartGame(){
    //Resetting Score
    playerScore = 0
    computerScore = 0

    //Resetting DOM Elements
    playerScoreSpan.textContent = playerScore
    computerScoreSpan.textContent = computerScore
    result.textContent = `It's a War!`
    remainingCards.textContent = `Remaining Cards: 0`

    //Reactivating the "Draw Card" button
    drawCard.classList.remove('disabled')
    drawCard.addEventListener('click', drawNewCard)

    //Removing the images from the previous game
    cardContainer.children[0].innerHTML =``
    cardContainer.children[1].innerHTML =``

    generateNewDeck()
}