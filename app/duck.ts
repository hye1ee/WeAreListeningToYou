import { DataChunk } from "./utils";

const INCREMENT = 1;

export interface DuckProps extends DataChunk {
  index: number;
}

class Duck {
  item: HTMLDivElement;
  img: HTMLDivElement;
  words: HTMLDivElement | undefined;
  info: HTMLDivElement | undefined;
  maxX: number = 0;
  maxY: number = 0;
  x: number = 0;
  y: number = 0;
  moveX: number = 0; // true goes positive
  moveY: number = 0; // false goes negative
  interval: NodeJS.Timeout | undefined;
  props: DuckProps;

  constructor(props: DuckProps) {
    const DuckWrapper = document.createElement("div");
    DuckWrapper.className = "duckWrapper"
    const duckImg = document.createElement("img");
    duckImg.className = "duckImg"
    duckImg.src = `/duck${Math.floor(Math.random() * 10) + 1}.png`

    // const DuckPath = document.createElement("div");
    // DuckPath.className = "duckPath"

    DuckWrapper.append(duckImg);

    this.props = props;
    this.img = duckImg;
    this.item = DuckWrapper;

    this.createInfo();
    this.createWord();
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
      if (this.interval && this.info) {
        clearInterval(this.interval);
        this.interval = undefined;
        this.info.style.display = "flex";
      }
    })
    this.item.addEventListener("mouseleave", () => {
      if (!this.interval && this.info) {
        this.setMove();
        this.info.style.display = "none";
      }
    })
    this.item.addEventListener("click", () => {
      if (!this.words) return;

      if (this.words.style.display === "flex") this.words.style.display = "none";
      else this.words.style.display = "flex"
    })

  }

  getOrder() {
    if (this.props.index === 1) return "1st"
    else if (this.props.index === 2) return "2nd"
    else return `${this.props.index}th`
  }

  createInfo() {
    const infoWrapper = document.createElement("div");
    infoWrapper.className = "infoWrapper";
    const infoText = document.createElement("div");
    infoText.className = "infoText";
    infoText.innerText = `${this.getOrder()} Connection\nLocation: ${this.props.location}\nDate: ${this.props.date}`;

    const infoBackground = document.createElement("img");
    infoBackground.src = "/hoverBackground.png";
    infoBackground.className = "infoBackground";

    infoWrapper.append(infoText, infoBackground);
    this.info = infoWrapper;
    this.item.append(infoWrapper);
  }

  createWordItem(name: string, score: number, magnitude: number) {
    const wordItemWrapper = document.createElement("div");
    wordItemWrapper.className = "wordItemWrapper";

    const wordImg = document.createElement("img");
    wordImg.src = "/folderImg.png";
    wordImg.className = "wordImg";

    const wordTitle = document.createElement("div");
    wordTitle.innerText = name;
    wordTitle.className = "wordTitle";
    wordItemWrapper.append(wordImg, wordTitle)

    const wordInfoWrapper = document.createElement("div");
    wordInfoWrapper.className = "wordInfoWrapper";
    const wordInfoBackground = document.createElement("img");
    wordInfoBackground.src = "/hoverSmallBackground.png";
    const wordInfoText = document.createElement("div");
    wordInfoText.className = "infoText wordInfoText";
    wordInfoText.innerText = `Score: ${score.toFixed(1)}\nMagnitude: ${magnitude.toFixed(1)}`;
    wordInfoWrapper.append(wordInfoBackground, wordInfoText);
    wordItemWrapper.append(wordInfoWrapper);

    wordItemWrapper.addEventListener("mouseenter", () => {
      wordInfoWrapper.style.display = "flex";
    });
    wordItemWrapper.addEventListener("mouseleave", () => {
      wordInfoWrapper.style.display = "none";
    })

    return wordItemWrapper;
  }

  createWord() {
    const wordWrapper = document.createElement("div");
    wordWrapper.className = "wordWrapper";

    this.props.data.forEach((el) => {
      wordWrapper.append(this.createWordItem(el.name, el.score, el.magnitude));
    })
    this.words = wordWrapper;
    this.item.append(wordWrapper);
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