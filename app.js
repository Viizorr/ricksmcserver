document.addEventListener("DOMContentLoaded", () => {
  const STATUS_URL = "https://api.mcsrvstat.us/2/mc.ricksmcserver.net";

  const ipBox = document.getElementById("copy-ip");
  const statusEl = document.getElementById("server-status");
  const playerEl = document.getElementById("player-count");
  const motdEl = document.getElementById("motd");
  const versionEl = document.getElementById("version");

  // Safety check (prevents silent failure)
  if (!statusEl || !playerEl || !motdEl || !versionEl) {
    console.error("Status elements missing from DOM");
    return;
  }

  // Copy IP interaction
  if (ipBox) {
    ipBox.addEventListener("click", () => {
      navigator.clipboard.writeText("mc.ricksmcserver.net");
      const small = ipBox.querySelector("small");
      if (small) {
        small.textContent = "Copied!";
        setTimeout(() => {
          small.textContent = "Tap to copy";
        }, 1500);
      }
    });
  }

  async function updateServerStatus() {
    try {
      const res = await fetch(STATUS_URL);
      const data = await res.json();

      if (data.online) {
        statusEl.textContent = "Online";
        statusEl.className = "status online";

        const online = data.players?.online ?? 0;
        const max = data.players?.max ?? "?";
        playerEl.textContent = `${online} / ${max} players`;

        // MOTD
        if (data.motd?.clean?.length) {
          motdEl.textContent = data.motd.clean
            .join(" ")
            .replace(/§./g, "")
            .replace(/&#039;/g, "'");
        } else {
          motdEl.textContent = "—";
        }

        // Version
        versionEl.textContent = data.version ?? "—";

      } else {
        statusEl.textContent = "Offline";
        statusEl.className = "status offline";
        playerEl.textContent = "– / – players";
        motdEl.textContent = "—";
        versionEl.textContent = "—";
      }
    } catch (err) {
      console.error("Status fetch failed:", err);
      statusEl.textContent = "Status unavailable";
      statusEl.className = "status offline";
      playerEl.textContent = "– / – players";
      motdEl.textContent = "—";
      versionEl.textContent = "—";
    }
  }

  // Initial load
  updateServerStatus();

  // Refresh every 30 seconds
  setInterval(updateServerStatus, 30000);
});