const util = require("node:util");
const path = require("node:path");
const chokidar = require("chokidar");

class HotReload {
    constructor(commandHandler, watchPath) {
        this._handler = commandHandler;
        this._path = watchPath;
        this._watcher = null;
        this._pending = new Set();
    }

    start() {
        if (this._watcher) return this;

        this._watcher = chokidar.watch(this._path, {
            ignoreInitial: true,
            persistent: true,
            awaitWriteFinish: {
                stabilityThreshold: 300,
                pollInterval: 100
            }
        });

        this._watcher
            .on("add", file => this._safeRun(() => this._onUpsert(file, "ditambahkan")))
            .on("change", file => this._safeRun(() => this._onUpsert(file, "diperbarui")))
            .on("unlink", file => this._safeRun(() => this._onRemove(file)))
            .on("error", error => console.warn(util.styleText("yellow", "[!]"), `Hot Reload error: ${error}`));

        console.log(util.styleText("cyan", "[i]"), `Hot Reload aktif, memantau ${this._path}`);
        return this;
    }

    async stop() {
        await this._watcher?.close();
        this._watcher = null;
    }

    // Menghindari race condition ketika ada banyak event beruntun untuk file yang sama
    // (misal saat file dipindahkan, chokidar bisa emit unlink+add hampir bersamaan).
    _safeRun(fn) {
        Promise.resolve().then(fn).catch(error => console.warn(util.styleText("yellow", "[!]"), `Hot Reload error: ${error}`));
    }

    _onUpsert(file, action) {
        if (!file.endsWith(".js")) return;

        const resolved = path.resolve(file);
        const commands = this._handler.reloadFile(resolved);

        if (commands.length) {
            const names = commands.map(cmd => cmd.name).join(", ");
            console.log(util.styleText("green", "[+]"), `Command ${names} ${action} (${path.basename(resolved)})`);
        }
    }

    _onRemove(file) {
        if (!file.endsWith(".js")) return;

        const resolved = path.resolve(file);
        const removed = this._handler.unloadFile(resolved);

        if (removed.length) {
            console.log(util.styleText("red", "[-]"), `Command ${removed.join(", ")} dihapus (${path.basename(resolved)})`);
        }
    }
}

module.exports = HotReload;
