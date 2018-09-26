// Character class
function Character(startPositionX, startPositionY, maxCountOfBoxes) {
    this.positionX = startPositionX;
    this.positionY = startPositionY;
    this.maxCountOfBoxes = maxCountOfBoxes;
    this.currentCountOfBoxes = 0;
    this.createCharacter();
}

Character.prototype.createCharacter = function () {
    var character = document.createElement('div');
    character.setAttribute("id", "character");
    character.style.width = "100%";
    character.style.height = "100%";
    character.style.top = "0px";
    character.style.left = "0px";
    character.innerText = 0;
    this.character = character;
}

Character.prototype.addBox = function () {
    if (this.currentCountOfBoxes < this.maxCountOfBoxes) {
        this.currentCountOfBoxes += 1;
        this.character.innerText = this.currentCountOfBoxes;
    }
}

Character.prototype.removeBox = function () {
    if (this.currentCountOfBoxes > 0) {
        this.currentCountOfBoxes -= 1;
        this.character.innerText = this.currentCountOfBoxes;
    }
}

Character.prototype.getCurrentPosition = function () {
    return {
        currentPositionX: this.positionX,
        currentPositionY: this.positionY
    }
}

Character.prototype.moveCharacter = function (newPositionX, newPositionY) {

    this.positionX = newPositionX;
    this.positionY = newPositionY;
}

Character.prototype.getCountOfBoxes = function () {
    return this.currentCountOfBoxes;
}

Character.prototype.getCharacter = function () {
    // make function and change character.character to character.getCharacter()
    return this.character;
}
// end character class

// Storage class
function Storage(positionIndex, maxCountOfBoxes, currentCountOfBoxes) {
    this.positionIndex = positionIndex;
    this.maxCountOfBoxes = maxCountOfBoxes;
    this.currentCountOfBoxes = currentCountOfBoxes;
    this.createStorage();
}

Storage.prototype = Object.create(Character.prototype);

Storage.prototype.createStorage = function () {
    var storage = document.createElement('td');
    storage.setAttribute("class", "storage");
    storage.innerText = this.currentCountOfBoxes;
    this.storage = storage;
}

Storage.prototype.removeBox = function () {
    if (this.currentCountOfBoxes > 0) {
        this.currentCountOfBoxes -= 1;
        this.storage.innerText = this.currentCountOfBoxes;
    }
}

Storage.prototype.getStorage = function () {
    return this.storage;
}
// end storage class

// class Grid
function Grid(heightCountSquares, widthCountSquares, storages, character) {
    // check if storageCount <= heightCountSquares * widthCountSquares
    this.heightCountSquares = heightCountSquares;
    this.widthCountSquares = widthCountSquares;
    this.storages = storages;
    this.character = character;
    this.grid = null;
    this.createGrid();
}

Grid.prototype.createGrid = function () {
    // Create grid table with td as storage or without them
    var grid = document.createElement("table");
    grid.setAttribute("id", "grid");

    for (var i = 0; i < this.heightCountSquares; i++) {
        //create tr element
        var tr = document.createElement('tr');
        grid.appendChild(tr);

        for (var j = 0; j < this.widthCountSquares; j++) {
            // Add character to last cell
            if (i == this.heightCountSquares - 1 && j == this.widthCountSquares - 1) {
                var td = document.createElement("td");
                td.innerText = 0;
                td.setAttribute('id', 'exit');
                td.appendChild(this.character.getCharacter());
                tr.appendChild(td);
                // Add empty td if cell has not to be storage
            } else if (this.storages[i * this.widthCountSquares + j] == undefined) {

                tr.appendChild(document.createElement("td"));
                // Add empty td if cell has not to be storage
            } else {
                var storage = this.storages[i * this.widthCountSquares + j].getStorage();
                storage.setAttribute('data-index', i * this.widthCountSquares + j);

                tr.appendChild(storage);
            }
        }
    }

    this.grid = grid;
}

Grid.prototype.getGrid = function () {
    return this.grid;
}
// end class Grid

// class Game
function Game() {

    this.showWelcomeForm();
    this.win = false;

    this.countOfAllBoxes = 0;
    this.grid = null;
    this.storages = [];
    this.character = null;

}

Game.prototype.showWelcomeForm = function () {

    if (this.grid) {
        this.grid.getGrid().parentElement.removeChild(this.grid.getGrid());
        document.onkeydown = null;
    }


    var welcomeForm = document.getElementById("welcomeForm");
    // Add You Win message if you win
    if (this.win) {


        this.win = false;
        var h1 = document.createElement("h1");
        h1.style.color = "red";
        h1.innerText = "You win";

        if (welcomeForm.getElementsByTagName('h1').length == 0) {
            welcomeForm.appendChild(h1);
        }

    }

    welcomeForm.style.display = "block";
    var that = this;
    this.grid = null;
    this.storages = [];
    this.character = null;
    this.countOfAllBoxes = 0;

    welcomeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var forms = document.forms['welcomeForm'].elements;
        if (parseInt(forms[0].value) * parseInt(forms[1].value) < parseInt(forms[2].value)) {

            return;
        }
        that.widthCountSquares = parseInt(forms[0].value);
        that.heightCountSquares = parseInt(forms[1].value) + 1;
        that.storagesCount = parseInt(forms[2].value);
        that.maxCountOfBoxesPerStorage = parseInt(forms[3].value);
        that.maxCountOfBoxesPerCharacter = parseInt(forms[4].value);

        that.hideWelcomeForm();
    }, {
        once: true
    });

}

Game.prototype.hideWelcomeForm = function () {
    var welcomeForm = document.getElementById("welcomeForm");
    welcomeForm.style.display = "none";
    this.createStorages();
    this.createCharacterInstance();
    this.createGridInstance();
    this.createGame();
    this.addDragEventsToStorages();
}

Game.prototype.createStorages = function () {
    var randomPositions = [];
    var countOfSquares = this.widthCountSquares * (this.heightCountSquares - 1);

    while (randomPositions.length < this.storagesCount) {
        var randomNumber = Math.floor(Math.random() * countOfSquares);
        if (randomPositions.indexOf(randomNumber) > -1) continue;
        randomPositions[randomPositions.length] = randomNumber;
    }

    for (var randomPosition of randomPositions) {
        var countOfBoxesPerStorage = Math.floor(Math.random() * this.maxCountOfBoxesPerStorage) + 1;
        this.storages[randomPosition] = countOfBoxesPerStorage;

    }

    var that = this;
    this.storages = this.storages.map(function (countOfBoxesPerStorage, index) {
        if (countOfBoxesPerStorage != "undefined") {
            that.countOfAllBoxes += countOfBoxesPerStorage;
            return new Storage(index, that.maxCountOfBoxesPerStorage,
                countOfBoxesPerStorage);
        }
    });
}

Game.prototype.createGridInstance = function () {
    this.grid = new Grid(this.heightCountSquares, this.widthCountSquares, this.storages, this.character);
}

Game.prototype.createCharacterInstance = function () {
    this.character = new Character(this.widthCountSquares - 1, this.heightCountSquares - 1, this.maxCountOfBoxesPerCharacter);
}

Game.prototype.addDragEventsToStorages = function () {
    var that = this;
    var storages = document.getElementsByClassName('storage');
    var exit = document.getElementById('exit');

    var characterOnDraggedElement = false;
    var indexOfDraggedElement;

    function dragStart(e) {
        characterOnDraggedElement = that.character.getCharacter() == e.target.children.item(0);

        if (parseInt(e.target.innerText) == 0) {
            return;
        }
        if (e.target == that.character.getCharacter()) {


        }
        indexOfDraggedElement = parseInt(e.target.dataset.index);
    }

    function dragEnd(e) {

    }

    function dragOver(e) {
        e.preventDefault();

    }

    function dragDrop(e) {
        if (that.storages[indexOfDraggedElement].getCountOfBoxes()) {
            that.storages[indexOfDraggedElement].removeBox();
            if (characterOnDraggedElement)
                that.storages[indexOfDraggedElement].getStorage().appendChild(that.character.getCharacter())

            if (e.target.parentElement == exit) {
                that.character.getCharacter().parentElement.removeChild(that.character.getCharacter());
                exit.innerText = parseInt(exit.innerText) + 1;
                exit.appendChild(that.character.getCharacter());
            } else {
                exit.innerText = parseInt(exit.innerText) + 1;
            }


            if (parseInt(exit.innerHTML) == that.countOfAllBoxes) {
                that.win = true;
                that.showWelcomeForm();
            }
        }
    }


    exit.addEventListener('dragstart', dragStart);
    exit.addEventListener('dragend', dragEnd);
    exit.addEventListener('dragover', dragOver);
    exit.addEventListener('drop', dragDrop);



    Array.prototype.forEach.call(storages, function (storage) {
        storage.addEventListener('dragstart', dragStart);
        storage.addEventListener('dragend', dragEnd);
        storage.addEventListener('dragover', dragOver);
    });


}

Game.prototype.makeStoragesDraggable = function () {
    var storages = document.getElementsByClassName('storage');



    Array.prototype.forEach.call(storages, function (storage) {
        storage.setAttribute('draggable', true);
    });

}


Game.prototype.makeStoragesUndraggable = function () {
    var storages = document.getElementsByClassName('storage');
    Array.prototype.forEach.call(storages, function (storage) {
        storage.removeAttribute('draggable');
    });
}

Game.prototype.createGame = function () {
    document.getElementById("game").appendChild(this.grid.getGrid());
    var that = this;
    var tds = document.getElementsByTagName('td');

    document.onkeydown = function (e) {


        let {
            currentPositionX,
            currentPositionY
        } = that.character.getCurrentPosition();



        switch (e.keyCode) {

            case 37: // Left
                if (currentPositionX != 0 && currentPositionY !=
                    that.heightCountSquares + 1 && currentPositionY != that.heightCountSquares - 1) {
                    that.character.getCharacter().parentNode.removeChild(that.character.getCharacter());
                    currentPositionX -= 1;
                    that.character.moveCharacter(currentPositionX, currentPositionY);
                    tds[currentPositionY * that.widthCountSquares + currentPositionX].appendChild(that.character
                        .getCharacter());
                }

                break;
            case 38: // Up
                if (currentPositionY != 0) {
                    that.character.getCharacter().parentNode.removeChild(that.character.getCharacter());
                    currentPositionY -= 1;
                    that.character.moveCharacter(currentPositionX, currentPositionY);

                    tds[currentPositionY * that.widthCountSquares + currentPositionX].appendChild(that.character
                        .getCharacter());
                }

                break;
            case 39:
                if (currentPositionX != that.widthCountSquares - 1) {
                    that.character.getCharacter().parentNode.removeChild(that.character.getCharacter());
                    currentPositionX += 1;
                    that.character.moveCharacter(currentPositionX, currentPositionY);

                    tds[currentPositionY * that.widthCountSquares + currentPositionX].appendChild(that.character
                        .getCharacter());
                }

                break;
            case 40:
                if (currentPositionY != that.heightCountSquares - 1 && currentPositionX == that.widthCountSquares -
                    1) {
                    that.character.getCharacter().parentNode.removeChild(that.character.getCharacter());
                    currentPositionY += 1;
                    that.character.moveCharacter(currentPositionX, currentPositionY);

                    tds[currentPositionY * that.widthCountSquares + currentPositionX].appendChild(that.character
                        .getCharacter());
                } else if (currentPositionY != that.heightCountSquares - 2 && currentPositionX !=
                    that.widthCountSquares -
                    1) {
                    that.character.getCharacter().parentNode.removeChild(that.character.getCharacter());
                    currentPositionY += 1;
                    that.character.moveCharacter(currentPositionX, currentPositionY);

                    tds[currentPositionY * that.widthCountSquares + currentPositionX].appendChild(that.character
                        .getCharacter());
                }
                break;
            case 32: // Space
                var positionIndex = currentPositionY * that.widthCountSquares + currentPositionX;

                if (positionIndex == that.widthCountSquares * that.heightCountSquares - 1) {

                    // On Exit position
                    if (that.character.getCountOfBoxes() > 0) {
                        var countOfBoxesOnExit = parseInt(tds[positionIndex].innerHTML);
                        tds[positionIndex].innerText = countOfBoxesOnExit + 1;
                        that.character.removeBox();
                        tds[positionIndex].appendChild(that.character.getCharacter());


                        if (countOfBoxesOnExit + 1 == that.countOfAllBoxes) {
                            that.win = true;
                            that.showWelcomeForm();
                        }
                    } else {
                        alert("You are empty");
                    }
                } else if (tds[positionIndex].classList.contains('storage')) {
                    // In storages

                    var countOfBoxes = that.storages[positionIndex].getCountOfBoxes();

                    if (countOfBoxes > 0 && that.character.getCountOfBoxes() < that.maxCountOfBoxesPerCharacter) {
                        that.storages[positionIndex].removeBox();
                        that.character.addBox();
                        tds[positionIndex].appendChild(that.character.getCharacter());
                    } else {
                        alert("Too many boxes for you or storage is empty");
                    }
                }
            case 17:
                that.makeStoragesDraggable();
        }

    }

    document.onkeyup = function (e) {

        if (e.keyCode == 17)
            that.makeStoragesUndraggable();
    }
}
// end class
var game = new Game();