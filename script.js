let activeAudios = [];
let globalStopTimer = null;

function createHeart(x,y) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "💖";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  playSound(key);

  // Find the matching button
  const btn = document.querySelector(`button[data-key="${key}"]`);
  if (btn) {
      // Highlight button
      btn.classList.add("playing");

      // Spawn heart on the button
      const rect = btn.getBoundingClientRect();
      createHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".soundboard-grid button").forEach(button => {
        button.addEventListener("click", (event) => {
            const key = button.getAttribute("data-key");
            playSound(key);
            button.classList.add("playing");

            // Button glow
            button.classList.add("playing");

            //Floating heart at click position
            createHeart(event.clientX, event.clientY);
        });
        button.addEventListener("transitionend", removeTransition);
    });
});

function playSound(key) {
  const audio = document.querySelector(`audio[data-key="${key}"]`);
  if (!audio) return;

  // Restart sound instantly (rapid fire)
audio.currentTime = 0;
audio.play();

// HARD CUT: stop all other audio
stopOtherAudio(key);

}

function hardStopAllAudio() {
  if (globalStopTimer) {
    clearTimeout(globalStopTimer);
    globalStopTimer = null;
  }

  document.querySelectorAll("audio").forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function removeTransition(event) {
    if (event.propertyName !== "transform") return;
    this.classList.remove("playing");
}

function stopOtherAudio(activeKey) {
  document.querySelectorAll("audio").forEach(audio => {
    if (audio.dataset.key !== activeKey) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}