// Function to start a new game and fetch game data
// Function to start a new game and fetch game data
// Function to start a new game and fetch game data
function startNewGame() {
    const playerNames = [
        document.getElementById('player1').value,
        document.getElementById('player2').value,
        document.getElementById('player3').value,
        document.getElementById('player4').value
    ];

    if (playerNames.some(name => name.trim() === '')) {
        alert("Please enter all player names.");
        return;
    }

    fetch('https://nowaunoweb.azurewebsites.net/api/game/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(playerNames)
    })
    .then(response => response.json())
    .then(data => {
        const gameId = data.Id;
        document.getElementById('game-id').textContent = gameId;

        data.Players.forEach((player, index) => {
            displayPlayerCards(player.Cards, index + 1, playerNames[index]);
        });

        fetchTopCard(gameId); // Fetch and display the top card
    })
    .catch(error => console.error("Error starting game:", error));
}

// Function to display the cards of a specific player
function displayPlayerCards(cards, playerNumber, playerName) {
    // Set the player's name in the header
    document.getElementById(`player${playerNumber}-name`).textContent = `${playerName}'s Cards`;

    const cardListElement = document.getElementById(`card-list-player${playerNumber}`);
    cardListElement.innerHTML = ''; // Clear previous cards

    cards.forEach(card => {
        const cardImage = document.createElement('img');
        const imageUrl = getCardImageUrl(card);
        cardImage.src = imageUrl || 'https://nowaunoweb.azurewebsites.net/Content/Cards/default.png';
        cardImage.alt = `${card.Text} card image`;
        cardImage.classList.add('card-image'); // Apply the CSS class

        cardListElement.appendChild(cardImage);
    });
}

// Function to fetch and display the top card
function fetchTopCard(gameId) {
    fetch(`https://nowaunoweb.azurewebsites.net/api/game/TopCard/${gameId}`)
        .then(response => response.json())
        .then(topCard => {
            const topCardImage = document.getElementById('top-card');
            const topCardUrl = getCardImageUrl(topCard);
            topCardImage.src = topCardUrl || 'https://nowaunoweb.azurewebsites.net/Content/back.png';
            console.log(`Top card: ${topCard.Color} ${topCard.Text}, URL: ${topCardUrl}`);
        })
        .catch(error => console.error("Error fetching top card:", error));
}

// Function to display a card in the UI
function displayCard(card) {
    const cardImage = document.createElement('img');
    const imageUrl = getCardImageUrl(card);
    cardImage.src = imageUrl || 'https://nowaunoweb.azurewebsites.net/Content/Cards/default.png';
    cardImage.alt = `${card.Text} card image`;
cardImage.classList.add('card-image'); // Apply the CSS class

    document.getElementById('card-list').appendChild(cardImage);
}

// Function to generate the image URL based on card information
function getCardImageUrl(card) {
    const colorCodeMap = {
        "RED": "r",
        "BLUE": "b",
        "YELLOW": "y",
        "GREEN": "g"
        // "BLACK" wird nicht benötigt
    };

    const specialCardsMap = {
        "WILD": "wild",
        "DRAW4": "wd4",
        "CHANGECOLOR": "wild"
    };

    const specialActionMap = {
        "SKIP": "s",
        "REVERSE": "r",
        "DRAW2": "d2"
    };

    const color = card.Color ? card.Color.toUpperCase() : null;
    const text = card.Text ? card.Text.toUpperCase() : null;
    const colorCode = colorCodeMap[color];

    console.log(`Processing card: Color=${color}, Text=${text}, Value=${card.Value}`);

    // Spezialkarten ohne Farbe (z.B. "WILD", "DRAW4")
    if (specialCardsMap[text]) {
        return `https://nowaunoweb.azurewebsites.net/Content/Cards/${specialCardsMap[text]}.png`;
    }
    // Aktionskarten mit Farbe (z.B. "SKIP", "REVERSE", "DRAW2")
    else if (colorCode && specialActionMap[text]) {
        return `https://nowaunoweb.azurewebsites.net/Content/Cards/${colorCode}${specialActionMap[text]}.png`;
    }
    // Zahlenkarten (0-9)
    else if (colorCode && typeof card.Value === 'number') {
        return `https://nowaunoweb.azurewebsites.net/Content/Cards/${colorCode}${card.Value}.png`;
    }

    return null;
}

// Add event listener to the button to trigger startNewGame on click
document.getElementById('start-game-btn').addEventListener('click', startNewGame);
