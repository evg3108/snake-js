const settings = {
    setting1: "",
    setting2: null
}


//-------- общий код
const game = new SnakeGame(settings)
game.start()


// классы
class SnakeGame {

    constructor({setting2}) {
        this.snake = new Snake()
        this.field = new PlayingField()
        this.foods = []
        this.score = new Score()
        this.controls = new PlayerControls()
    }

    start() {

    }
}

class GameRenderer {

    constructor() {

    }

    render(params) {

    }
}

class CanvasRenderer extends GameRenderer {
    constructor(canvas, snake, field, foods, score) {
        this.canvas = canvas
        this.snake = snake
        this.field = field
        this.foods = foods
        this.score = score
    }

    render(params) {

    }
}

class PlayingField {

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
        const newHead = new SnakeBit(head.getX() + shiftX, head.getY() + shiftY)
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
        this.x = x
        this.y = y
    }

    get x() {
        return this.x
    }

    get y() {
        return this.y
    }
}

class Food {

}

class Score {

}

class PlayerControls {

}