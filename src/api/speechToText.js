let instance = null;

class SpeechToText {
  constructor() {
    if (!instance) {
      this.voicesReady = false;
      this.readQueue = [];
      this.voiceMap = {};
      // wait for voices
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = speechSynthesis.getVoices();

        // push voices to voice map
        this.voices.forEach((voice) => {
          const lang = voice.lang.split('-')[0];
          if (!(lang in this.voiceMap)) {
            this.voiceMap[lang] = voice;
          }
        });

        this.voicesReady = true;
        // read data
        let shouldRead = this.tryRead();
        while (shouldRead) {
          shouldRead = this.tryRead();
        }
      };
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new SpeechToText();
    }
    return instance;
  }

  read(language, text) {
    this.readQueue.push({ language, text });
    this.tryRead();
  }

  tryRead() {
    if (this.voicesReady && this.readQueue.length > 0) {
      const textData = this.readQueue.pop();
      if (!(textData.language in this.voiceMap)) {
        alert(`Voice for language ${textData.language} not found`);
        return true;
      }
      const utterance = new SpeechSynthesisUtterance(textData.text);
      utterance.voice = this.voiceMap[textData.language];
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  }
}

export default SpeechToText;
