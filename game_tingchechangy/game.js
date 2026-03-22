class ParkingGame {
  constructor() {
    this.app = new PIXI.Application({
      width: 650,
      height: 650,
      backgroundColor: 0xeeeeee
    });
    document.getElementById('game-container').appendChild(this.app.view);

    this.gridSize = 8;
    this.cellSize = 80;
    this.parkingLot = Array(8).fill().map(() => Array(8).fill(0));
    
    this.createGrid();
    this.generateCars(5);
  }

  createGrid() {
    const grid = new PIXI.Graphics();
    for (let i = 0; i <= this.gridSize; i++) {
      grid.lineStyle(2, 0x444444)
        .moveTo(i * (this.cellSize + 5), 0)
        .lineTo(i * (this.cellSize + 5), this.app.screen.height);
      
      grid.lineStyle(2, 0x444444)
        .moveTo(0, i * (this.cellSize + 5))
        .lineTo(this.app.screen.width, i * (this.cellSize + 5));
    }
    this.app.stage.addChild(grid);
  }

  generateCars(count) {
    for (let i = 0; i < count; i++) {
      let x, y;
      do {
        x = Math.floor(Math.random() * 8);
        y = Math.floor(Math.random() * 8);
      } while (this.parkingLot[y][x] === 1);

      const car = new PIXI.Graphics()
        .beginFill(0xff0000)
        .drawRect(0, 0, this.cellSize, this.cellSize);
      
      car.x = x * (this.cellSize + 5) + 5;
      car.y = y * (this.cellSize + 5) + 5;
      car.interactive = true;
      car.buttonMode = true;
      car.on('click', () => this.handleCarClick(x, y));
      
      this.app.stage.addChild(car);
      this.parkingLot[y][x] = 1;
    }
  }

  handleCarClick(x, y) {
    // 检查是否可移动（前方无车）
    if (this.checkMovable(x, y)) {
      this.moveCar(x, y);
      alert(`车辆(${x},${y}) 已驶出！`);
    }
  }

  checkMovable(x, y) {
    // 检查到出口的路径是否畅通（左侧所有列无车）
    for (let i = x - 1; i >= 0; i--) {
      if (this.parkingLot[y][i] === 1) return false;
    }
    return true;
  }

  moveCar(x, y) {
    const cars = this.app.stage.children.filter(child => child instanceof PIXI.Graphics);
    const target = cars.find(c => 
      Math.floor(c.x / 85) === x && 
      Math.floor(c.y / 85) === y
    );

    if (target) {
      // 添加移动动画
      const speed = 5;
      const animate = () => {
        target.x -= speed;
        if (target.x + target.width < 0) {
          this.app.ticker.remove(animate);
          this.app.stage.removeChild(target);
          this.parkingLot[y][x] = 0; // 确保状态同步
        }
      };
      this.app.ticker.add(animate);
    }
  }
}

// 启动游戏
const game = new ParkingGame();

// 响应窗口调整
window.addEventListener('resize', () => {
  game.app.renderer.resize(
    Math.min(650, window.innerWidth - 20),
    Math.min(650, window.innerHeight - 100)
  );
});