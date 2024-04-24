
class Connector {
  private static instance: Connector;
  date: string | undefined;
  location: string | undefined;


  constructor() {
  }
  static getInstance(): Connector {
    if (!Connector.instance) {
      Connector.instance = new Connector();
    }
    Connector.instance.init();
    return Connector.instance;
  }

  init() {
    this.date = undefined;
    this.location = undefined;
  }

  async startRecord() {
    this.init();

    await new Promise<void>((res) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`;
        this.date = new Date(position.timestamp).toLocaleString('en-US');
        res();
      });
    })
    return { location: this.location, date: this.date }
  }
}
export default Connector;