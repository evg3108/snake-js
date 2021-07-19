

// классы
class SnakeGame {

    constructor({canvas, scale}) {
        const fieldWidth = Math.floor(canvas.width / scale)
        const fieldHeight = Math.floor(canvas.height / scale)
        this.field = new PlayingField(fieldWidth, fieldHeight)
        this.snake = new Snake(Math.floor(this.field.width / 2), Math.floor(this.field.height / 2))
        this.foods = []
        this.score = new Score()
        this.controls = new PlayerControls()
        this.renderer = new CanvasRenderer(canvas, this.snake, this.field, this.foods, this.score, scale)
    }

    start() {
        this._step = this.step.bind(this)
        window.requestAnimationFrame(this._step)
        this.renderer.render()
    }

    step() {
        this.snake.tick()
        this.renderer.render()
        
        window.requestAnimationFrame(this._step)
    }
}

class GameRenderer {

    constructor() {
    
    }

    render(params) {}
}

class CanvasRenderer extends GameRenderer {

    constructor(canvas, snake, field, foods, score, scale) {  
        super()
        this.canvas = canvas
        /** @type CanvasRenderingContext2D */
        this.context = canvas.getContext("2d")
        this.snake = snake
        this.field = field
        this.foods = foods
        this.score = score

        this.context.scale(scale, scale)
    }

    render(params) {
        this.context.clearRect(0, 0, this.field.width, this.field.height)
        this.drawSnake()
    }

    drawSnake() {
        this.snake.body.forEach(bit => {
            this.drawPixel(bit.x, bit.y)
        });
    }

    drawPixel(x, y, color) {
        this.context.fillStyle = color
        this.context.fillRect(x, y, 1, 1)
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
    }

    setDirection() {

    }

    tick() {
        const head = this.body[0]
        let shiftX = 0
        let shiftY = 0
        switch (this.direction) {
            case "up":
                shiftY = 1
                break;
            case "down":
                shiftY = -1
                break;
            case "left":
                shiftX = -1
                break;
            case "right":
                shiftX = 1
                break;
        }
        const newHead = new SnakeBit(head.x + shiftX, head.y + shiftY)
        this.body.pop() // remove tail
        this.body.length
        this.body.unshift(newHead)

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

}

class Score {

}

class PlayerControls {

}

const settings = {
    canvas: document.getElementById("game-canvas"),
    scale: 10
}


//-------- общий код
const game = new SnakeGame(settings)
game.start()
