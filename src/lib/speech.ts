"use client";

let voicesLoaded = false;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve([]);
  }

  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve(voices);
      return;
    }

    const handler = () => {
      voicesLoaded = true;
      window.speechSynthesis.removeEventListener("voiceschanged", handler);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
  });
}

export async function speakWord(
  text: string,
  onStateChange?: (speaking: boolean) => void
) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-GB";
  utterance.rate = 0.9;

  if (!voicesLoaded) {
    await loadVoices();
  }

  const voices = window.speechSynthesis.getVoices();
  // Prefer British English voice
  const gbVoice = voices.find(
    (v) => v.lang === "en-GB" && v.localService
  );
  // Fallback: any en-GB, then any English local
  const fallbackVoice =
    gbVoice ||
    voices.find((v) => v.lang.startsWith("en-GB")) ||
    voices.find((v) => v.lang.startsWith("en-") && v.localService);
  if (fallbackVoice) {
    utterance.voice = fallbackVoice;
  }

  utterance.onstart = () => onStateChange?.(true);
  utterance.onend = () => onStateChange?.(false);
  utterance.onerror = () => onStateChange?.(false);

  window.speechSynthesis.speak(utterance);
}
