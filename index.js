

// классы
class SnakeGame {

    constructor({ canvas, score, highScore, scale, speed }) {
        this.scale = scale
        this.speed = speed
        this.fieldWidth = Math.floor(canvas.width / scale)
        this.fieldHeight = Math.floor(canvas.height / scale)
        this.canvas = canvas
        this.scoreElement = score
        this.highScoreElement = highScore
    }

    start() {
        this.field = new PlayingField(this.fieldWidth, this.fieldHeight)
        this.snake = new Snake(Math.floor(this.field.width / 2), Math.floor(this.field.height / 2))
        this.foods = []
        this.score = new Score(localStorage.getItem("highScore") || 0)
        this.controls = new PlayerControls()
        this.renderer = new CanvasRenderer(this.canvas, this.scoreElement, this.snake, this.field, this.foods, this.score, this.scale)
        this.lastFrameTimestamp = 0

        this.placeFood()
        this._step = this.step.bind(this)
        window.requestAnimationFrame(this._step)
        this.renderer.render()
        this.updateHighScore()

        this.controls.onDirectionChange(direction => this.snake.setDirection(direction))
    }

    step(timestamp) {
        if (timestamp - this.lastFrameTimestamp > 500 / this.speed) {
            this.lastFrameTimestamp = timestamp
            this.snake.tick()
            this.score.onTick()
            this.renderer.render()
            this.checkWallCollision()
            this.checkSnakeCollision()
            const isFoodEaten = this.checkFoodCollision()
            if (isFoodEaten) {
                this.speed += 0.2
            }
        }
        window.requestAnimationFrame(this._step)
    }

    placeFood() {
        const foodX = Math.floor(Math.random() * this.field.width)
        const foodY = Math.floor(Math.random() * this.field.height)
        this.foods.push(new Food(foodX, foodY))
    }

    checkWallCollision() {
        if (this.snake.head.x < 0 || this.snake.head.x >= this.field.width) this.gameOver()
        if (this.snake.head.y < 0 || this.snake.head.y >= this.field.height) this.gameOver()
    }

    checkSnakeCollision() {
        const head = this.snake.head
        const bodyWithoutHead = this.snake.body.filter(bit => bit !== head)
        const isCollision = bodyWithoutHead.some(bit => bit.x == head.x && bit.y == head.y)
        if (isCollision) {
            this.gameOver()
        }
    }

    checkFoodCollision() {
        const eatenFoods = this.foods.filter(food => this.snake.head.x === food.x && this.snake.head.y === food.y)
        if (eatenFoods.length == 0) return false

        eatenFoods.forEach(food => this.foods.splice(this.foods.indexOf(food), 1))
        
        eatenFoods.forEach(food => {
            this.snake.grow()
            this.score.onFoodEaten()
        })
        
        this.placeFood()
        return true
    }

    gameOver() {
        const isNewHighScore = this.score.onGameOver()
        let finalText;
        if (isNewHighScore) {
            finalText = `Новый рекорд! О май год! Ты красавчик! ${this.score.points}`
        } else {
            finalText = `Упс, игра окончена! Ваш счёт: ${this.score.points}`
        }
        
        alert(finalText)
        this.updateHighScore()

        this.start()
    }

    updateHighScore() {
        this.highScoreElement.innerText = this.score.highScore
        localStorage.setItem("highScore", this.score.highScore)
    }
}

class GameRenderer {

    constructor() {

    }

    render(params) { }
}

class CanvasRenderer extends GameRenderer {

    constructor(canvas, scoreElement, snake, field, foods, score, scale) {
        super()
        this.canvas = canvas
        this.scoreElement = scoreElement
        /** @type CanvasRenderingContext2D */
        this.context = canvas.getContext("2d")
        this.snake = snake
        this.field = field
        this.foods = foods
        this.score = score
        
        this.context.setTransform(scale, 0, 0, scale, 0, 0);
        // this.context.scale(scale, scale)
    }

    render(params) {
        this.context.clearRect(0, 0, this.field.width, this.field.height)
        this.drawSnake()
        this.drawFoods()
        this.updateScore()
    }

    drawSnake() {
        this.snake.body.forEach(bit => {
            this.drawPixel(bit.x, bit.y)
        });
    }

    drawFoods() {
        this.foods.forEach(food => {
            this.drawPixel(food.x, food.y, "#00ff00")
        })
    }

    drawPixel(x, y, color) {
        color = color ? color : "#000000"
        this.context.fillStyle = color
        this.context.fillRect(x, y, 1, 1)
    }

    updateScore() {
        this.scoreElement.innerText = this.score.points
    }
}

class PlayingField {
    constructor(width, height) {
        this._width = width
        this._height = height
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }
}

class Snake {

    constructor(fieldCenterX, fieldCenterY) {
        this.direction = "right"
        this.body = [
            new SnakeBit(fieldCenterX, fieldCenterY),
            new SnakeBit(fieldCenterX - 1, fieldCenterY),
            new SnakeBit(fieldCenterX - 2, fieldCenterY),
            new SnakeBit(fieldCenterX - 3, fieldCenterY),
        ]
        this.growCount = 0
    }

    setDirection(direction) {
        this.direction = direction
    }

    get head() {
        return this.body[0]
    }

    tick() {
        let shiftX = 0
        let shiftY = 0
        switch (this.direction) {
            case "up":
                shiftY = -1
                break;
            case "down":
                shiftY = 1
                break;
            case "left":
                shiftX = -1
                break;
            case "right":
                shiftX = 1
                break;
        }
        if (this.growCount > 0) {
            this.growCount--
        } else {
            this.body.pop() // remove tail
        }
        

        const newHead = new SnakeBit(this.head.x + shiftX, this.head.y + shiftY)
        this.body.unshift(newHead) // add new head

    }

    grow() {
        this.growCount++
    }

    getBody() {
        return this.body
    }
}

class SnakeBit {
    constructor(x, y) {
        this._x = x
        this._y = y
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }
}

class Food {

    constructor(x, y) {
        this._x = x
        this._y = y
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }
}

class Score {
    constructor(highScore) {
        this._points = 0
        this._highScore = highScore
    }

    get points() {
        return this._points
    }

    get highScore() {
        return this._highScore
    }

    onFoodEaten() {
        this._points += 100
    }

    onTick() {
        this._points += 1
    }

    onGameOver() {
        if (this._highScore < this._points) {
            this._highScore = this.points
            return true
        }
        return false
    }
}

class PlayerControls {

    constructor(snake) {
        this.snake=snake
        this._onDocumentKeyDown = this.onDocumentKeyDown.bind(this)
        document.addEventListener("keydown", this._onDocumentKeyDown)
    }

    onDirectionChange(callback) {
        this.directionChangeCallback = callback
    }

    onDocumentKeyDown(event) {
        let direction;
        switch (event.key) {
            case "ArrowRight":
                direction = "right"
                break;
            case "ArrowLeft":
                direction = "left"
                break;
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down"
                break;
        }
        if (direction != null) {
            this.directionChangeCallback(direction)
        }
    }
}

const settings = {
    canvas: document.getElementById("game-canvas"),
    score: document.getElementById("game-score"),
    highScore: document.getElementById("game-high-score"),
    scale: 10,
    speed: 4
}


//-------- общий код
const game = new SnakeGame(settings)
game.start()
