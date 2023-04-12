"use strict"


function mainAILoop() {
    
    const delay = "100"
    if (isNaN(delay) || delay.trim() === "") {
        setTimeout(mainAILoop, 100)
    } else if (Number(delay) <= 1000 && Number(delay) > 0) {
        setTimeout(mainAILoop, Number(delay))
    } else {
        setTimeout(mainAILoop, 100)
    }
    if (board.gameover) {
        return
    }
    nextAIMove(false)
}

function nextAIMove(manual=true) {
    // Si esta función se llama automáticamente,
    // solo debe hacer el próximo movimiento si la IA está habilitada.
    // Si esta función se llama manualmente, debería moverse independientemente.
    const foxEnabled = document.getElementById("controls-ai-fox").checked
    if (board.currentTurn === "fox" && (manual || foxEnabled)) {
        foxAI.makeMove()
    }
}

class IA {
    // Super class for the AI
    constructor() {
        this.name = ""
    }

    makeMove() {
        // Comprueba qué algoritmo está seleccionado en el control de selección y llama al método correspondiente.
        const controlsId = `controls-ai-algorithm-${this.name}`
        const algorithm = document.getElementById(controlsId)
        if (algorithm.selectedIndex === 0) {
            this.random()
        } else {
            const depth = 1
            if (isNaN(depth) || Number(depth) < 1 || Number(depth) > 6) {
                const notes = document.getElementById("notifications")
                
            } else {
                this.evaluarMinimax(board, depth, true)
            }
        }
    }

    random() {
        // Selecciona un animal aleatorio del nombre correcto y realiza un movimiento aleatorio. 
        // Este algoritmo proporciona una proporción de victorias de alrededor de 1:9.5 a favor del zorro. 
        // Por lo general, porque los perros se quedan sin movimientos eventualmente. 
        const animals = []
        board.animals.forEach(animal => {
            if (animal.name === this.name) {
                animals.push(animal)
            }
        })
        let chosenAnimal = animals[Math.floor(Math.random() * animals.length)]
        let moves = chosenAnimal.possibleMoves()
        while (moves.length === 0) {
            chosenAnimal = animals[Math.floor(Math.random() * animals.length)]
            moves = chosenAnimal.possibleMoves()
        }
        const chosenMove = moves[Math.floor(Math.random() * moves.length)]
        chosenAnimal.moveTo(chosenMove.x, chosenMove.y)
    }

    terminalScore(boardState) {
        //chequea si termino la partida 
        const victory = boardState.checkVictory(false)
        if (victory === "") {
            return 0
        }
        if (victory === this.name) {
            return 2
        } else {
            return -2
        }
    }

    cloneBoard(boardState) {
        /*crea una copia del estado actual del tablero. Toma una matriz de objetos animal como entrada, 
        y devuelve una nueva instancia de la clase Tablero que tiene los mismos animales en la misma posición*/
        const animals = []
        boardState.animals.forEach(animal => {
            if (animal.name === "fox") {
                animals.push(new Zorro(animal.x, animal.y))
            } else if (animal.name === "hound") {
                animals.push(new Sabueso(animal.x, animal.y))
            }
        })
        return new Tablero(animals, boardState.currentTurn)
    }

    average(scores) {
        let total = 0
        scores.forEach(score => {
            total += score
        })
        return total / scores.length
    }

    evaluarMinimax(currentBoard, depth, root=false) {

        /*Implementación del algoritmo minimax con poda alfa-beta para determinar la mejor jugada para el zorro. 
        Toma el estado actual del tablero, 
        la profundidad de búsqueda 
        y una bandera booleana opcional que indica si la llamada es la raíz de la búsqueda. 
        Devuelve el puntaje mínimo de los nodos hoja alcanzados en la búsqueda, 
        así como una matriz de todos los puntajes calculados.*/
        
        const animals = []
        currentBoard.animals.forEach(animal => {
            if (animal.name === currentBoard.currentTurn) {
                animals.push(animal)
            }
        })
        if (root) {
            let highestSoFar = -1000
            let bestAnimal = null
            let bestMove = null
            let averageScoreOfBestMove
            animals.forEach(animal => {
                const moves = animal.possibleMoves(currentBoard)
                moves.forEach(move => {
                    const newBoard = this.cloneBoard(currentBoard)
                    newBoard.animalAt(animal.x, animal.y)
                        .moveTo(move.x, move.y, newBoard)
                    const scores = this.evaluarMinimax(newBoard, depth - 1)
                    if (scores.lowest > highestSoFar) {
                        highestSoFar = scores.lowest
                        bestAnimal = animal
                        bestMove = move
                        averageScoreOfBestMove = this.average(scores.all)
                    } else if (scores.lowest === highestSoFar) {
                        const averageThisMove = this.average(scores.all)
                        if (averageThisMove > averageScoreOfBestMove) {
                            bestAnimal = animal
                            bestMove = move
                            averageScoreOfBestMove = averageThisMove
                        }
                    }
                })
            })
            bestAnimal.moveTo(bestMove.x, bestMove.y)
            return
        } else if (depth === 0 || this.terminalScore(currentBoard) !== 0) {
            return {
                lowest: this.evaluateScore(currentBoard),
                all: [this.evaluateScore(currentBoard)]
            }
        } else {
            let lowestScore = 2
            const allScores = []
            animals.forEach(animal => {
                const moves = animal.possibleMoves(currentBoard)
                moves.forEach(move => {
                    const newBoard = this.cloneBoard(currentBoard)
                    newBoard.animalAt(animal.x, animal.y)
                        .moveTo(move.x, move.y, newBoard)
                    const scores = this.evaluarMinimax(newBoard, depth - 1)
                    if (scores.lowest < lowestScore) {
                        lowestScore = scores.lowest
                    }
                    allScores.push(...scores.all)
                })
            })
            return {
                lowest: lowestScore,
                all: allScores
            }
        }
    }
}

class ZorroIA extends IA {
    constructor() {
        super()
        this.name = "fox"
    }

    evaluateScore(boardState) {
        let score = 0
        // Motiva al zorro para que se mueva a la parte superior del tablero
        boardState.animals.forEach(animal => {
            if (animal.name === "fox") {
                score = -animal.y * 2
            }
        })
        // Hacer perder un devolverse si es posible
        // y ganando máxima prioridad
        score += this.terminalScore(boardState)
        return score
    }
}



const foxAI = new ZorroIA()
