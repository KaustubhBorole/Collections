# Devcontainer for Collections

This devcontainer makes the repository Spark/Codespaces-ready.

What it does:
- Uses the official TypeScript/Node devcontainer image.
- Runs `npm ci` after creating the container to install dependencies.
- Starts the Vite dev server on container start using `npm run dev -- --host` so the forwarded port is accessible.
- Forwards port 5173 (Vite default) to make the app preview available in Codespaces/Spark.
- Installs recommended VS Code extensions (Copilot Chat, Prettier, ESLint).

How to use:
1. Create a Codespace from this repository (Code → Codespaces → New codespace) or open it in your GitHub Spark environment.
2. The container build will run `npm ci` automatically.
3. After the container starts, the dev server will automatically start and the forwarded port will show up in the Ports view; click "Open in Browser" to view the app.

If you prefer to start the server manually:
- Remove or comment out `postStartCommand` in `.devcontainer/devcontainer.json` and run `npm run dev -- --host` in the terminal.

## Notes
- The `postStartCommand` uses `--host` so Vite binds to 0.0.0.0 which is required for Codespaces port forwarding.
- If you want a different port (e.g., 5000) update `forwardPorts` and `postStartCommand` accordingly.
