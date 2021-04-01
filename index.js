

function CreateBoardContainer() {
	playground = document.getElementById('board');
	for (var i = 0; i < 12; i++) {
		newNode = document.createElement('li');
		newNode.classList.add("card_container");
		newNode.innerHTML = '<span class="card front"></span><span class="card back"></span>';
		playground.appendChild(newNode);
	}
}

function Game(desk, timer, popup) {
	this.desk = desk;
	this.cardsList = [];
	this.timer = timer;
	this.popup = popup;
	this.isWin = false;

	this.init = function (emodji) {
		var setEmodji = emodji.concat(emodji);
		var cards = this.desk.querySelectorAll('.card_container');
		for (var i = 0; i < cards.length; i++) {
			var icon = this.setContent(setEmodji);
			this.cardsList[i] = new Card(cards[i], i, icon);
		}
	};

	this.setContent = function (setEmodji) {
		var randomNumber = Math.floor(Math.random() * 10000) % setEmodji.length;
		var icon = setEmodji.splice(randomNumber, 1)[0];
		return icon;
	};

	this.togglePopup = function (result) {
		var message='';
		if (result) {
			message="Win";
		} else {
			message="Lose";
		}
		this.popup.classList.toggle('active');
		this.popup.firstElementChild.firstElementChild.innerHTML = message;
	};

	this.rePlay = function (emodji) {
		this.togglePopup();
		this.isWin = false;
		this.timer.innerHTML = '01:00';
		this.cardsList.forEach(function (item) {
			var card = item.elem.lastElementChild;
			if (item.isOpen) item.rotate();
			if (card.classList.contains('unequal')) card.classList.remove('unequal');
			if (card.classList.contains('equal')) card.classList.remove('equal');
		});
		this.cardsList = [];
		this.init(emodji);

	}
}

function Card(elem, id, icon) {
	this.elem = elem;
	this.elem.id = id;
	this.icon = icon;
	this.isOpen = false;
	this.isCompare = false;
	this.toRotate = true;
	this.isSingle = false;
	this.elem.lastElementChild.dataset.icon = icon;
}
Card.prototype.rotate = function () {
	this.elem.classList.toggle('active');
	if (this.elem.classList.contains('active')) {
		this.isOpen = true;
		this.toRotate = false;
	} else this.isOpen = false;
};
Card.prototype.isEqual = function (nextCard) {
	if (this.icon === nextCard.icon) {
		this.elem.lastElementChild.classList.add('equal');
		nextCard.elem.lastElementChild.classList.add('equal');
	} else {
		this.elem.lastElementChild.classList.add('unequal');
		nextCard.elem.lastElementChild.classList.add('unequal');
		this.toRotate = true;
		nextCard.toRotate = true;
	}
};

var emodji = ['🐟', '🐙', '🐊', '🦄', '🐿', '🐸'];
var desk = document.querySelector('.board');
var timer = document.querySelector('.timer');
var popup = document.querySelector('.popup');
CreateBoardContainer();
var game = new Game(desk, timer, popup);
game.init(emodji);
var idTimer = null;
var timer = 59;

game.desk.addEventListener('click', function (event) {
		if (event.target.classList.contains('card')){
		if (!idTimer) {
			idTimer = setTimeout(function nextTime() {
				var timeString = '';
				if (timer < 10) timeString = '00:0' + timer;
				else timeString = '00:' + timer;
				game.timer.innerHTML = timeString;
				timer--;
				if (timer >= 0 && !game.isWin) timerId = setTimeout(nextTime, 1000);
				else if (game.isWin) game.togglePopup(true);
				else game.togglePopup(false);
			}, 1000);
		}
	}
});

game.desk.addEventListener('click', function (event) {
	if (timer > 0) {
		if (event.target.tagName === 'SPAN') {
			var card = game.cardsList[event.target.parentNode.id];
			if (card.toRotate) {
				card.rotate();
				var openedNotCompareCards = game.cardsList.filter(function (item) {
					if (item.isOpen && item.isSingle) return true;
					else return false;
				});
				if (openedNotCompareCards.length) {
					openedNotCompareCards[0].isEqual(card);
					game.isWin = game.cardsList.every(function (item) {
						return (item.elem.lastElementChild.classList.contains('equal'));
					});
					openedNotCompareCards[0].isSingle = false;
					openedNotCompareCards[0].isCompare = true;
					card.isCompare = true;
				} else {
					card.isSingle = true;
					var openedNotEqualCards = game.cardsList.filter(function (item) {
						if (item.toRotate && item.isCompare) return true;
						else return false;
					});
					if (openedNotEqualCards.length) {
						openedNotEqualCards.forEach(function (item) {
							item.rotate();
							item.isCompare = false;
							item.elem.lastElementChild.classList.remove('unequal');
						});
					}
				}
			}
		}
	}
});

var popupBtn = document.querySelector('.popup-btn');
popupBtn.addEventListener('click', function () {
	game.rePlay(emodji);
	idTimer = null;
	timer = 59;
});
