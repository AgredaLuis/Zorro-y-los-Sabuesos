"use strict"

let board

class Tablero {
    constructor(animals, firstTurn="fox") {
        this.animals = animals
        this.currentTurn = firstTurn
        this.focussedAnimal = null
        this.gameover = false
    }

    isValidMove(animal, x, y) {
        // Comprueba si un movimiento determinado es válido para el objeto animal proporcionado.
        // Se comprueban todos los escenarios fallidos, antes de devolver verdadero.


        // El primer error es si la nueva posición es la misma que la anterior
        if (animal.x === x && animal.y === y) {
            return false
        }
        // La segunda falla es cuando un cazador intenta volver a subir a una fila más alta.
        if (animal.name === "hound" && y <= animal.y) {
            return false
        }
        // El tercer error es si el movimiento no es una ficha diagonal en el eje x
        if (animal.x + 1 !== x && animal.x - 1 !== x) {
            return false
        }
        // Cuarto error es si el movimiento no es una ficha diagonal tile en el eje y
        if (animal.y + 1 !== y && animal.y - 1 !== y) {
            return false
        }
        // Quinto error es si la nueva ubicación es fuera del campo de juego
        if (x < 0 || x > 7 || y < 0 || y > 7) {
            return false
        }
        // Final chequea que no haya un animal ahí 
        let allGood = true
        this.animals.forEach(a => {
            if (x === a.x && y === a.y) {
                allGood = false
            }
        })
        return allGood
    }

    animalAt(x, y) {
        let foundAnimal = null
        this.animals.forEach(animal => {
            if (animal.x === x && animal.y === y) {
                foundAnimal = animal
            }
        })
        return foundAnimal
    }

    movimientosPosibles(animalName) {
        // Hace una lista de los posibles movimientos para un tipo de animal
        let validMoves = []
        this.animals.forEach(animal => {
            if (animal.name === animalName) {
                validMoves = validMoves.concat(animal.possibleMoves())
            }
        })
        return validMoves
    }

    checkVictory(register=true) {
        // Después de cada movimiento se llama a esta función para comprobar si el juego ha terminado:
        // Primero comprueba si el zorro está encerrado, lo que significa que los sabuesos ganan.
        // En segundo lugar, comprueba si los sabuesos están atascados, lo que significa que gana el zorro.
        // Por último, comprueba si el zorro ha llegado a la fila superior del tablero,
        // lo que resulta en una victoria para el zorro.
        // el tablero se restablece al estado de inicio y puede comenzar un nuevo juego
        if (this.movimientosPosibles("fox").length === 0) {
            if (register) {
                notify("info", `Los sabuesos ganan!`)
                this.addVictory("hound")
            }
            return "hound"
        } else if (this.movimientosPosibles("hound").length === 0) {
            if (register) {
                notify("info", `El zorro gana!`)
                this.addVictory("fox")
            }
            return "fox"
        } else {
            this.animals.forEach(animal => {
                if (animal.name === "fox" && animal.y === 0) {
                    if (register) {
                        notify("info", `El zorro gana!`)
                        this.addVictory("fox")
                    }
                    return "fox"
                }
            })
        }
        return ""
    }

    addVictory(animal) {
        // Actualizar el contador de ganancias del animal ganador
        this.gameover = true
        const ourCounter = document.getElementById(`win-${animal}`)
        const ourWins = Number(ourCounter.innerHTML) + 1
        ourCounter.innerHTML = ourWins
        generateNewBoard()
    }
}

class Animal {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.name = ""
    }

    moveTo(x, y, place=board) {
        // Mueve el animal a la ubicación especificada si este es un movimiento válido
        if (this.name !== place.currentTurn || place.gameover) {
            return
        }
        const allowInvalidMoves = false
        if (place.isValidMove(this, x, y) || allowInvalidMoves) {
            this.x = x
            this.y = y
            place.currentTurn = place.currentTurn === "fox" ? "hound" : "fox"
            place.focussedAnimal = null
            if (place === board) {
                updateBoard()
                board.checkVictory()
            }
        } else {
            notify("warn", "movimiento invalido")
        }
    }
}

class Sabueso extends Animal {
    // Siempre hay 4 cazadores en el tablero
    constructor(x, y) {
        super(x, y)
        this.name = "hound"
    }

    possibleMoves(place=board) {
        // Returns all possible moves for this hound
        const allMoves = [
            {
                x: this.x + 1,
                y: this.y + 1
            },
            {
                x: this.x - 1,
                y: this.y + 1
            }
        ]
        const validMoves = []
        allMoves.forEach(move => {
            if (place.isValidMove(this, move.x, move.y)) {
                validMoves.push(move)
            }
        })
        return validMoves
    }
}
class Zorro extends Animal {
    // There will always be one fox (or Wolf) on the board
    constructor(x, y) {
        super(x, y)
        this.name = "fox"
    }

    possibleMoves(place=board) {
        // Returns all possible moves for the fox
        const allMoves = [
            {
                x: this.x + 1,
                y: this.y + 1
            },
            {
                x: this.x - 1,
                y: this.y + 1
            },
            {
                x: this.x + 1,
                y: this.y - 1
            },
            {
                x: this.x - 1,
                y: this.y - 1
            }
        ]
        const validMoves = []
        allMoves.forEach(move => {
            if (place.isValidMove(this, move.x, move.y)) {
                validMoves.push(move)
            }
        })
        return validMoves
    }
}

function generateNewBoard() {
    // This function resets the board to the default state
    board = new Tablero([
        new Zorro(0, 7),
        new Sabueso(1, 0),
        new Sabueso(3, 0),
        new Sabueso(5, 0),
        new Sabueso(7, 0)
    ])
    updateBoard()
}

function updateBoard() {
    // This function generates the board as html from the board object
    // It also adds the listeners to handle user interaction
    const boardElement = document.getElementById("board")
    boardElement.innerHTML = `<div id="animals"></div>`
    
    let squareColor = "white"
    for (let i = 0; i < 64; i++) {
        const square = document.createElement("span")
        square.className = `${squareColor}-square`
        if (squareColor === "black") {
            square.onclick = () => {
                if (board.focussedAnimal !== null) {
                    board.focussedAnimal.moveTo(i % 8, Math.floor(i / 8))
                }
            }
        }
        boardElement.appendChild(square)
        squareColor = squareColor === "black" ? "white" : "black"
        if ((i + 1 )% 8 === 0) {
            boardElement.appendChild(document.createElement("br"))
            squareColor = squareColor === "black" ? "white" : "black"
        }
    }
    const animalsHtml = document.getElementById("animals")
    board.animals.forEach(animal => {
        const animalImage = document.createElement("img")
        animalImage.src = `img/${nombreFicha(animal.name)}.png`
        //animalImage.src = `img/hound.png`
        animalImage.onclick = () => {
            if (animal === board.focussedAnimal) {
                board.focussedAnimal = null
            } else if (animal.name !== board.currentTurn) {
                const prettyName = nombreFicha(board.currentTurn, true)
                notify("warn", `Ya hizo su jugada debe esperar la jugada del contrincante`)
            } else {
                board.focussedAnimal = animal
            }
            updateBoard()
        }
        const animalElement = document.createElement("span")
        if (animal === board.focussedAnimal) {
            animalElement.className = "focussed animal"
        } else {
            animalElement.className = "animal"
        }
        animalElement.style = `top: ${animal.y * 4}em;left: ${animal.x * 4}em;`
        animalElement.appendChild(animalImage)
        animalsHtml.appendChild(animalElement)
    })
}
