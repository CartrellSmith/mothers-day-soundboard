// Stores all currently playing audio elements (not heavily used in this version)
let activeAudios = [];

// Used for timing global audio stops (not used in this version but kept for structure)
let globalStopTimer = null;

/* -----------------------------------------------------------
   FUNCTION: createHeart(x, y)
   PURPOSE: Creates a floating heart emoji at a specific
            screen position (used for both click + keypress)
----------------------------------------------------------- */
function createHeart(x, y) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.textContent = "💖";

    // Position the heart at the given coordinates
    heart.style.left = x + "px";
    heart.style.top = y + "px";

    document.body.appendChild(heart);
}

/* -----------------------------------------------------------
   GLOBAL KEYBOARD LISTENER
   PURPOSE: When the user presses a key (A–J), play the sound,
            highlight the matching button, and spawn a heart.
----------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
    const key = e.key;          // Which key was pressed?
    playSound(key);             // Play the matching sound

    // Find the matching on‑screen button
    const btn = document.querySelector(`button[data-key="${key}"]`);

    if (btn) {
        // Add glow animation
        btn.classList.add("playing");

        // Find the button's center for heart placement
        const rect = btn.getBoundingClientRect();
        createHeart(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
});

/* -----------------------------------------------------------
   CLICK SUPPORT
   PURPOSE: Allows mouse/touch users to click the buttons
            instead of using the keyboard.
----------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".soundboard-grid button").forEach(button => {

        // When a button is clicked...
        button.addEventListener("click", (event) => {
            const key = button.getAttribute("data-key");

            playSound(key);             // Play the sound
            button.classList.add("playing");  // Glow animation

            // Spawn a heart at the click position
            createHeart(event.clientX, event.clientY);
        });

        // Remove the glow when the CSS animation ends
        button.addEventListener("transitionend", removeTransition);
    });
});

/* -----------------------------------------------------------
   FUNCTION: playSound(key)
   PURPOSE: Plays the audio mapped to the key and ensures
            rapid‑fire playback (sound restarts instantly).
----------------------------------------------------------- */
function playSound(key) {
    const audio = document.querySelector(`audio[data-key="${key}"]`);

    // If no sound is mapped to this key, stop here
    if (!audio) return;

    // RAPID FIRE: restart sound immediately
    audio.currentTime = 0;
    audio.play();

    // Stop all other sounds so only one plays at a time
    stopOtherAudio(key);
}

/* -----------------------------------------------------------
   FUNCTION: hardStopAllAudio()
   PURPOSE: Stops ALL audio on the page instantly.
            (Not used in this version but kept for structure)
----------------------------------------------------------- */
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

/* -----------------------------------------------------------
   FUNCTION: removeTransition(event)
   PURPOSE: Removes the .playing class AFTER the CSS animation
            finishes. Prevents the glow from staying stuck.
----------------------------------------------------------- */
function removeTransition(event) {
    // Only remove when the transform animation ends
    if (event.propertyName !== "transform") return;

    this.classList.remove("playing");
}

/* -----------------------------------------------------------
   FUNCTION: stopOtherAudio(activeKey)
   PURPOSE: Ensures ONLY the selected sound plays.
            All other sounds are stopped immediately.
----------------------------------------------------------- */
function stopOtherAudio(activeKey) {
    document.querySelectorAll("audio").forEach(audio => {

        // Skip the currently active sound
        if (audio.dataset.key !== activeKey) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
}
