import { MediaRecorder, register } from 'extendable-media-recorder';
import { connect } from 'extendable-media-recorder-wav-encoder';
import axios from "axios";
import { DataChunk } from "./utils";

const CONNECTION_TIME = 10000; // in ms

class Connector {
  private static instance: Connector;
  date: string | undefined;
  uploadData: (data: DataChunk) => void;
  location: string | undefined;
  data: { name: string, score: number, magnitude: number }[] | undefined;
  allow: boolean = true;
  modal: { [key: string]: HTMLDivElement };

  constructor(uploadData: (data: DataChunk) => void) {
    this.uploadData = uploadData;
    this.modal = {}
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    this.modal["overlay"] = overlay;

    const modalContainer = document.createElement("div");
    modalContainer.className = "modalContainer"
    this.modal["modal"] = modalContainer;

    const modalBackground = document.createElement("img");
    modalBackground.src = "/modal.png"
    const modalTitle = document.createElement("div");
    modalTitle.className = "modalTitle"
    this.modal["modalTitle"] = modalTitle;

    modalContainer.append(modalBackground, modalTitle);
    overlay.append(modalContainer);

    document.body.append(overlay);
  }
  static getInstance(uploadData: (data: DataChunk) => void): Connector {
    if (!Connector.instance) {
      Connector.instance = new Connector(uploadData);
    }
    Connector.instance.init();
    return Connector.instance;
  }

  async init() {
    await register(await connect());

    this.date = undefined;
    this.location = undefined;
  }

  createModalButton(title: string) {
    const buttonContainer = document.createElement("div");
    buttonContainer.className = "modalButtonContainer"

    const buttonBackground = document.createElement("img");
    buttonBackground.src = "/button.png"

    const buttonTitle = document.createElement("div");
    buttonTitle.className = "modalButtonTitle"
    buttonTitle.innerText = title

    buttonContainer.append(buttonBackground, buttonTitle);
    return buttonContainer;
  }
  updateModalTitle(title: string) {
    this.modal.modalTitle.innerText = title;
  }
  showModal() {
    this.modal.overlay.style.display = "flex";
  }
  hideModal() {
    this.modal.overlay.style.display = "none";
  }
  updateWarningModal() {
    this.init();
    this.showModal();
    this.updateModalTitle("Warning")

    const modalDescription = document.createElement("div");
    modalDescription.className = "modalDescription";
    modalDescription.innerText = "During the connection, your speech will be transcribed into text and used in building this project.";
    const modalButtonWrapper = document.createElement("div");
    modalButtonWrapper.className = "modalButtonWrapper";

    const okButton = this.createModalButton("OK");
    const cancelButton = this.createModalButton("Cancel");
    modalButtonWrapper.append(okButton, cancelButton);

    const remove = () => {
      modalDescription.remove();
      modalButtonWrapper.remove();
    };
    okButton.addEventListener("click", () => {
      remove();
      this.updateConnectionModal();
    });
    cancelButton.addEventListener("click", () => {
      remove();
      this.hideModal();
    });

    this.modal.modal.append(modalButtonWrapper, modalDescription);
  }
  updateConnectionModal() {
    this.updateModalTitle("Connection");

    // set contents
    const descriptionWrapper = document.createElement("div");
    descriptionWrapper.className = "descriptionWrapper";

    const descriptionCol = document.createElement("div");
    descriptionCol.className = "descriptionCol";

    const descriptionText = document.createElement("div");
    descriptionText.innerText = "Please approve location and microphone permissions for the connection.";
    descriptionText.className = "descriptionText";
    const updateText = (text: string) => {
      descriptionText.innerText = text;
    };

    const loadingContainer = document.createElement("div");
    loadingContainer.className = "loadingContainer";
    const loadingGauge = document.createElement("div");
    loadingGauge.className = "loadingGauge";
    loadingGauge.id = "loading";
    const loadingImg = document.createElement("img");
    loadingImg.src = "/loading.png";
    loadingContainer.append(loadingImg, loadingGauge);
    loadingContainer.style.display = "none";

    const connectionImg = document.createElement("img");
    connectionImg.src = "/connectionImg.png";
    connectionImg.className = "connectionImg";

    descriptionCol.append(descriptionText, loadingContainer);
    descriptionWrapper.append(connectionImg, descriptionCol);

    // set button for end phase
    const modalButtonWrapper = document.createElement("div");
    modalButtonWrapper.className = "modalButtonWrapper";
    modalButtonWrapper.style.display = "none"
    const okButton = this.createModalButton("OK");
    okButton.addEventListener("click", () => {
      removeModal();
    });
    modalButtonWrapper.append(okButton);

    const updateEndPhase = (success: boolean) => {
      loadingContainer.style.display = "none";

      if (success) updateText("The connection has ended successfully.");
      else updateText("The connection has ended with error. Please try again.");
      modalButtonWrapper.style.display = "flex";
    }

    const updateLoadingPhase = () => {
      updateText("The connection lasts for about 1 minute.");
      loadingContainer.style.display = "flex";

      const loading = document.getElementById("loading") as HTMLDivElement;
      const counter = setInterval(() => {
        const loadingItem = document.createElement("div");
        loadingItem.className = "loadingItem"
        loading.append(loadingItem);
      }, CONNECTION_TIME / 10);
      setTimeout(() => {
        clearInterval(counter);
      }, CONNECTION_TIME);

    }
    const removeModal = () => {
      descriptionWrapper.remove();
      modalButtonWrapper.remove();
      this.hideModal();
    }

    this.modal.modal.append(descriptionWrapper, modalButtonWrapper);
    this.startConnect(updateLoadingPhase, updateEndPhase, removeModal);

  }

  async startConnect(updateLoadingPhase: () => void, updateEndPhase: (success: boolean) => void, removeModal: () => void) {
    // get loacation
    await new Promise<void>((res) => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.location = `${position.coords.latitude.toFixed(2)}°N, ${position.coords.longitude.toFixed(2)}°E`;
        this.date = new Date(position.timestamp).toLocaleString('en-US');
        res();
      }, () => {
        removeModal();
        res();
      });
    })
    // ready for recording
    await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        const recorder = new MediaRecorder(stream, { mimeType: 'audio/wav' });
        let chunks: BlobPart[] = [];

        // start after a sec
        setTimeout(() => {
          recorder.start();
        }, 1000);

        recorder.onstart = () => {
          updateLoadingPhase();
        }
        setTimeout(() => {
          recorder.stop();
        }, CONNECTION_TIME);

        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };
        recorder.onstop = async () => {
          // get transcription 
          const blob = new Blob(chunks, { type: "audio/wav" });
          const formData = new FormData();
          formData.append('file', blob, 'audio.wav');
          formData.append('model', 'whisper-1');
          formData.append('language', 'en');

          const res = await axios.post(`https://api.openai.com/v1/audio/transcriptions`, formData, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
            }
          });
          const result = await axios.post(import.meta.env.VITE_SERVER + "/entities", { text: res.data.text });

          this.data = result.data.map((el: any) => ({
            name: el.name,
            score: el.sentiment.score,
            magnitude: el.sentiment.magnitude,
          }
          ));

          if (this.date && this.location && this.data && this.data.length > 3) {
            this.uploadData({ location: this.location, date: this.date, data: this.data });
            updateEndPhase(true);
          } else {
            updateEndPhase(false);
          }

          chunks = [];
        }
      })
      .catch(() => {
        removeModal();
      })
  }

}
export default Connector;