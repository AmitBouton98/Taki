// dict for suits
let Suits = {
	clubs: 1,
	diamonds: 2,
	hearts: 3,
	spades: 4
}
// Constactur for Card
function Card(number, suit) {
	this.number = number;
	this.suit = suit;
}
// Constactur for player
function Player(name) {
	this.name = name;
	this.cards = [];
}
// Constactur for Game
function Game(player1, player2) {
	this.player1 = new Player(player1);
	this.player2 = new Player(player2);
	this.cashierStack = [];
	this.trashStack = [];
	this.activePlayer = this.player1;
	this.computerChosenSuit = "";
}
// Constactur for Game (loaded)
function LoadGame(player1, player2, cashierStack, trashStack, activePlayer) {
	this.player1 = player1;
	this.player2 = player2;
	this.cashierStack = cashierStack;
	this.trashStack = trashStack;
	this.activePlayer = activePlayer;
	this.computerChosenSuit = "";
}
// this function start the game
startGame = function (name) {
	newGame = new Game(name, 'computer');
	newGame.deal();
	newGame.printAll();
	newGame.pickCard();
	newGame.SaveGame();
}

// this function pick card
Game.prototype.pickCard = function () {
	if (newGame.activePlayer.name == newGame.player1.name) {
		document.getElementById("cashierStack").onclick = function (e) {
			newGame.pickFromCashier();
			newGame.printAll();
			newGame.Indication();
			return;
		}
		document.getElementById("trashStack").onclick = function (e) {
			newGame.pickFromTrash();
			newGame.printAll();
			newGame.Indication();
			return;
		}
		return;
	}
	else {
		document.getElementById("cashierStack").onclick = ""
		document.getElementById("trashStack").onclick = ""
	}
}
// this function print all the object to the html body
Game.prototype.printAll = function () {
	SortPlayers(newGame.player1)
	SortPlayers(newGame.player2)
	deleteAll();
	let e = showDeck(newGame.player1);
	e.id = "player1";
	e = CashierAndTrash(newGame.cashierStack, newGame.trashStack)
	e.id = "cashAndTrash";
	e = showDeck(newGame.player2);
	e.id = "player2";
	newGame.text()
	newGame.SaveGame();
}
// this function write the text on the body (who is player1 and player2 and turn who is the player to play)
Game.prototype.text = function () {
	let b = document.body
	b.style.backgroundImage = "url('background/Green.jpg')";
	b.style.backgroundRepeat = "no-repeat";
	b.style.backgroundSize = "cover";
	let element = document.createElement("div")
	let h1 = document.createElement("h1")
	h1.innerText = "Turn : " + newGame.activePlayer.name + " to play"
	h1.style.fontSize = "80px"
	h1.id = "turnText"
	element.style.textAlign = "center"
	element.append(h1)
	b.append(element)
}
// this function deal the cards
Game.prototype.deal = function () {
	for (var i = 1; i < 14; i++) {
		for (var j = 0; j < 4; j++) {
			this.cashierStack.push(new Card(i, Object.keys(Suits)[j]));
		}
	}
	this.cashierStack.push(new Card(0, "black_joker"));
	this.cashierStack.push(new Card(0, "red_joker"));
	shuffle(this.cashierStack);
	for (var i = 0; i < 13; i++) {
		this.player1.cards.push(this.cashierStack.pop());
		this.player2.cards.push(this.cashierStack.pop());
	}
	this.trashStack.push(this.cashierStack.pop());
}
// this function indicate with player is playing by giving him onclick on the objects
Game.prototype.Indication = function () {
	// indicate for player1
	if (newGame.activePlayer.name == newGame.player1.name) {
		for (let i = 0; i < newGame.player1.cards.length; i++) {
			let element = document.getElementById(newGame.player1.cards[i].number + newGame.player1.cards[i].suit)
			// function ThrowToTrash
			element.onclick = function () {
				for (var i = 0; i < newGame.player1.cards.length; i++) {

					if (element.id == newGame.player1.cards[i].number + newGame.player1.cards[i].suit) {
						//newGame.trashStack = newGame.player1.cards.splice(i, 1);
						newGame.trashStack.push(new Card(newGame.player1.cards[i].number, newGame.player1.cards[i].suit));
						newGame.player1.cards.splice(i, 1)
						newGame.printAll();
						if (newGame.checkWin()) {
							//document.getElementById("turnText").innerText = newGame.player1.name + "has won"
							alert(newGame.player1.name + " has won!!")
							alert("Now the game will start again")
							localStorage.clear();
							document.body.innerHTML = ""
							startGame(newGame.player1.name);
							return
						}
						newGame.activePlayer = newGame.player2;
						newGame.printAll();
						newGame.SaveGame();
						newGame.computerPlay();
						return
					}
				}
			}
		}
	}
}
// show card, return element of image - UPDATE for part B: if card is owned by computer (player2), show back of card.
showCard = function (card) {
	let element = document.createElement("img");
	element.style.width = '10vh';
	for (let i = 0; i < newGame.player2.cards.length; i++) {
		if (newGame.player2.cards[i].number == card.number && newGame.player2.cards[i].suit == card.suit) {
			element.src = 'images/back.png';
			element.id = card.number + card.suit;
			return element;
		}
	}
	element.src = 'images/' + card.number + '_of_' + card.suit + '.png';
	element.id = card.number + card.suit;
	return element;
}
// show deck, return div that represent deck
showDeck = function (arr) {
	let b = document.body;
	let d = document.createElement("div");
	d.className = 'row';
	d.style.textAlign = "center";
	let h1 = document.createElement("h1")
	h1.style.fontSize = "35px"
	h1.innerText = arr.name
	d.append(h1)
	for (var i = 0; i < arr.cards.length; i++) {
		d.append(showCard(arr.cards[i]));
	}
	b.append(d);
	return d;
}
//cashier and trash images, return div with the image of trash and casiers
CashierAndTrash = function (cashierStack, trashStack) {
	let b = document.body;
	let div = document.createElement("div");
	div.style.textAlign = "center"
	div.style.height = '15vh';
	let e = showCashierStack(cashierStack, trashStack);
	e.id = "cashierStack";
	div.append(e);
	e = showTrashStack(trashStack)
	e.id = "trashStack";
	div.append(e);
	b.append(div)
	return div;
}
// this functhion show cashier stack, she return element of image of the last card in the casier stack
showCashierStack = function (arr, arrTrashWhenEnd) {
	let element = document.createElement('img')
	if (arr.length != 0)
		element.src = 'images/back.png';
	else {
		//adding trash to cashier affter the cashier end
		let lengthTrashh = arrTrashWhenEnd.length
		for (let i = lengthTrashh - 1; i > 0; i--) {
			let card = new Card(arrTrashWhenEnd[i].number, arrTrashWhenEnd[i].suit)
			arr.push(card)
			arrTrashWhenEnd.splice(i, 1)
		}
		shuffle(arr)
		element.src = 'images/back.png';
	}
	element.style.width = '9.6vh';
	element.style.border = "2px solid black"
	element.id = "cashierStack";
	return element;
}
// show trash stack, this functhion return element of span with the card in the trash(black)
showTrashStack = function (arr) {
	let element = document.createElement('span')
	if (arr.length != 0) {
		element.append(showCard(new Card(arr[arr.length - 1]['number'], arr[arr.length - 1]['suit'])))
	}
	else {
		let x = document.createElement("img");
		x.style.width = '10vh';
		x.src = 'images/X.png';
		x.id = 'X';
		element.append(x)
	}

	element.id = "trashStack";
	return element;
}
// this function sort the player cards
SortPlayers = function (player) {
	player.cards.sort(
		(a, b) =>
			a.number - b.number ||
			a.suit.localeCompare(b.suit),
	)
}
// this function shuffle the array
shuffle = function (arr) {
	let i = arr.length, j, temp;
	while (--i > 0) {
		j = Math.floor(Math.random() * (i + 1));
		temp = arr[j];
		arr[j] = arr[i];
		arr[i] = temp;
	}
}
// this function pick card from trash and add it to activeplayer cards
Game.prototype.pickFromTrash = function () {
	let pickedCard = this.trashStack.pop();
	newGame.activePlayer.cards.push(pickedCard);
}
// this function pick card from cashier and add it to activeplayer cards
Game.prototype.pickFromCashier = function () {
	let pickedCard = this.cashierStack.pop();
	newGame.activePlayer.cards.push(pickedCard);
}
// this function clear the body innerHTML
deleteAll = function () {
	document.body.innerHTML = "";
}
// this function check if the activeplayer win 
Game.prototype.checkWin = function () {
	// Check if all the cards in players hand have the same suit
	for (let i = 0; i < this.activePlayer.cards.length - 1; i++) {
		if (this.activePlayer.cards[i].suit != this.activePlayer.cards[i + 1].suit
			&& this.activePlayer.cards[i].suit != "red_joker"
			&& this.activePlayer.cards[i].suit != "black_joker")
			return false;
	}
	return true;
}
//////////////////////////////////////////////// 6.B
// Save data in localStorage
Game.prototype.SaveGame = function () {
	localStorage.setItem('Player1', JSON.stringify(this.player1))
	localStorage.setItem('player2', JSON.stringify(this.player2))
	localStorage.setItem('cashierStack', JSON.stringify(this.cashierStack))
	localStorage.setItem('trashStack', JSON.stringify(this.trashStack))
	localStorage.setItem('activePlayer', JSON.stringify(this.activePlayer))
}
// load data from localStorage
Load = function () {
	Loaded = new LoadGame(JSON.parse(localStorage.getItem("Player1")), JSON.parse(localStorage.getItem("player2")), JSON.parse(localStorage.getItem("cashierStack")), JSON.parse(localStorage.getItem("trashStack")), JSON.parse(localStorage.getItem("activePlayer")));
	newGame = new Game("player1", "player2")
	Object.assign(newGame, Loaded);
	if (newGame.activePlayer.name == newGame.player1.name) {
		newGame.activePlayer = newGame.player1
	}
	else {
		newGame.activePlayer = newGame.player2
		if (newGame.activePlayer.cards.length <= 13) {
			newGame.computerPlay()
		}
		else {
			setTimeout(function () {
				newGame.ComputerThrowCard();
				newGame.printAll();
				newGame.pickCard();
			}, 1000);
		}
	}
	newGame.printAll();
	if (newGame.activePlayer.cards.length <= 13) {
		newGame.pickCard();
	}
	else {
		newGame.Indication();
	}
}
// Welcome Page
Welcome = function () {
	deleteAll();
	let b = document.body
	b.style.backgroundImage = "url('background/Green.jpg')";
	b.style.backgroundRepeat = "no-repeat";
	b.style.backgroundSize = "cover";
	let h1 = document.createElement('h1');
	h1.innerHTML = "Welcome to card  game";
	h1.style.textAlign = "center"
	h1.style.fontSize = "100px";
	b.appendChild(document.createElement('div').appendChild(h1));
	if (localStorage["Player1"] == undefined || localStorage["player2"] == undefined || localStorage["cashierStack"] == undefined || localStorage["trashStack"] == undefined) {
		WelcomeUnloaded();
	}
	else {
		LoadOrUnload();
	}
}
// Create Welcome when there isnt a game loaded
WelcomeUnloaded = function () {
	let b = document.body;
	let div = document.createElement('div');
	div.style.textAlign = "center"
	div.style.fontSize = "50px"
	let text = document.createElement('input');
	text.type = "text";
	text.id = "PlayerName";
	text.style.height = "30px"
	text.size = "20"
	let lbl = document.createElement("label")
	lbl.innerHTML = "Enter your name: "
	div.appendChild(lbl)
	div.appendChild(text)
	let button = document.createElement("button")
	button.textContent = "Start"
	button.style.height = "30px"
	button.style.width = "200px"
	let div2 = document.createElement("div")
	div2.style.textAlign = "center"
	div2.style.paddingTop = "50px"
	button.onclick = function () {
		startGame(document.getElementById("PlayerName").value);
	}
	b.appendChild(div)
	div2.appendChild(button)
	b.appendChild(div2)
}
// Create Welcome when there is a game loaded
LoadOrUnload = function () {
	//alert("Find game from localStorage!!!")
	let b = document.body;
	let div = document.createElement("div")
	div.style.textAlign = "center"
	let startNewGame = document.createElement("button")
	startNewGame.textContent = "New Game"
	startNewGame.style.height = "30px"
	startNewGame.style.width = "200px"
	startNewGame.onclick = function () {
		localStorage.clear();
		Welcome();
	}
	let StartLoadGame = document.createElement("button")
	StartLoadGame.textContent = "Load Game"
	StartLoadGame.style.height = "30px"
	StartLoadGame.style.width = "200px"
	StartLoadGame.onclick = function () {
		Load();
	}
	div.appendChild(startNewGame)
	div.appendChild(StartLoadGame)
	b.appendChild(div)
}
//This function checks sum of each suit in computer's hand. it returns the max suit.
Game.prototype.computerChooseSuit = function () {
	let computerSuit = {
		clubs: 0,
		diamonds: 0,
		hearts: 0,
		spades: 0
	}
	computerSuit[this.trashStack[this.trashStack.length - 1].suit]++;
	for (let i = 0; i < this.player2.cards.length; i++) {
		if (this.player2.cards[i].suit == "clubs")
			computerSuit.clubs++;
		if (this.player2.cards[i].suit == "diamonds")
			computerSuit.diamonds++;
		if (this.player2.cards[i].suit == "hearts")
			computerSuit.hearts++;
		if (this.player2.cards[i].suit == "spades")
			computerSuit.spades++;
	}
	let maxSuit = 0;
	let maxKey = "";

	for (let suit in computerSuit) {
		if (computerSuit[suit] > maxSuit) {
			maxSuit = computerSuit[suit];
			maxKey = suit
		}
	}
	return maxKey;
}
// this funthion is the move of the computer
Game.prototype.computerPlay = function () {
	console.log(newGame.computerChosenSuit)
	setTimeout(function () {
		newGame.ComputerPickTashOrCashier();
		newGame.printAll();
		newGame.pickCard();
	}, 1000);
	setTimeout(function () {
		newGame.ComputerThrowCard();
		newGame.printAll();
		newGame.pickCard();
	}, 2000);
}
// Computer choose to pick from trash or Cashier
Game.prototype.ComputerPickTashOrCashier = function () {
	if (newGame.trashStack[newGame.trashStack.length - 1].suit == newGame.computerChooseSuit() || newGame.trashStack[newGame.trashStack.length - 1].number == 0) {
		newGame.pickFromTrash();
	}
	else {
		newGame.pickFromCashier();
	}
}
// Computer choose what card to throw
Game.prototype.ComputerThrowCard = function () {
	for (let i = 0; i < this.player2.cards.length; i++) {
		if (this.player2.cards[i].suit != newGame.computerChooseSuit() && this.player2.cards[i].number != 0) {
			this.trashStack.push(new Card(this.player2.cards[i].number, this.player2.cards[i].suit))
			this.player2.cards.splice(i, 1)
			this.printAll();
			if (newGame.checkWin()) {
				alert(newGame.player2.name + " has won!!");
				alert("Now the game will start again");
				localStorage.clear();
				document.body.innerHTML = ""
				startGame(newGame.player1.name);
				return
			}
			newGame.activePlayer = newGame.player1;
			newGame.printAll();
			newGame.SaveGame();
			newGame.pickCard();
			console.log(newGame.player2.cards)
			return
		}
	}
}
Welcome();
