const INCREMENT = 1;

class Duck {
  item: HTMLDivElement;
  img: HTMLDivElement;
  maxX: number = 0;
  maxY: number = 0;
  x: number = 0;
  y: number = 0;
  moveX: number = 0; // true goes positive
  moveY: number = 0; // false goes negative
  interval: NodeJS.Timeout | undefined;

  constructor() {
    const DuckWrapper = document.createElement("div");
    DuckWrapper.className = "duckWrapper"
    const DuckImg = document.createElement("img");
    DuckImg.src = `/duck${Math.floor(Math.random() * 10) + 1}.png`

    DuckWrapper.append(DuckImg);
    this.img = DuckImg;
    this.item = DuckWrapper;
    this.init();
  }

  init() {
    // x range = 100 ~ clientWidth - 100
    // y range = 100 ~ clientHeight - 100
    this.x = Math.floor(Math.random() * (document.body.clientWidth - 200)) + 100;
    this.y = Math.floor(Math.random() * (document.body.clientHeight - 200)) + 100;
    this.moveX = Math.floor(Math.random() * 3) - 1;
    this.moveY = Math.floor(Math.random() * 3) - 1;
    if (this.moveX === 0 && this.moveY === 0) this.moveX = 1;
    this.updatePos();
    this.setMove();

    this.item.addEventListener("mouseenter", () => {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    })
    this.item.addEventListener("mouseleave", () => {
      if (!this.interval) this.setMove();
    })
  }

  setMove() {
    this.interval = setInterval(() => {
      if (this.maxX == 0 || this.maxY == 0) this.calcMax();

      this.x += this.moveX * INCREMENT;
      this.y += this.moveY * INCREMENT;
      this.validPos();
      this.updatePos();
    }, 500);
  }

  validPos() {
    if (this.x < 0 || this.x > this.maxX) {
      this.moveX = this.moveX * (-1);
      this.moveY = Math.floor(Math.random() * 3) - 1;
      this.x += this.moveX * INCREMENT;
    }
    if (this.y < 0 || this.y > this.maxY) {
      this.moveX = Math.floor(Math.random() * 3) - 1;
      this.moveY = this.moveY * (-1);
      this.y += this.moveY * INCREMENT;
    }
  }

  updatePos() {
    if (this.moveX > 0) this.img.style.transform = "scaleX(-1)";
    else this.img.style.transform = "";

    this.item.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  calcMax() {
    this.maxX = document.body.clientWidth - this.item.getBoundingClientRect().width;
    this.maxY = document.body.clientHeight - this.item.getBoundingClientRect().height;
  }

};
export default Duck;