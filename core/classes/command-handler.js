const util = require("node:util");
const { globSync } = require("glob");

class CommandHandler {
    constructor(bot, path) {
        this._bot = bot;
        this._path = path;
        this._fileCommands = new Map();
    }

    load(isShowLog = true) {
        if (isShowLog) console.group(util.styleText("cyan", "[i]"), "Command Handler");

        const files = this._getFiles();

        for (const file of files) this.loadFile(file, isShowLog);

        if (isShowLog) console.groupEnd();
    }

    loadFile(file, isShowLog = false) {
        try {
            this._clearCache(file);

            const module = require(file);
            const commands = this._normalizeCommands(module, file);
            const registered = [];

            for (const cmd of commands) {
                this._registerCommand(cmd);
                registered.push({
                    name: cmd.name,
                    type: cmd.type === "hears" ? "hears" : "command"
                });
                if (isShowLog) {
                    const type = cmd.type === "hears" ? "Hears" : "Command";
                    console.log(util.styleText("green", "[+]"), `Loaded ${type} - ${cmd.name}`);
                }
            }

            if (registered.length) this._fileCommands.set(file, registered);
            else this._fileCommands.delete(file);

            return commands;
        } catch (error) {
            console.warn(util.styleText("yellow", "[!]"), `Failed to load ${file}: ${error}`);
            return [];
        }
    }

    unloadFile(file) {
        const registered = this._fileCommands.get(file) || [];

        for (const cmd of registered) {
            const map = cmd.type === "hears" ? this._bot.hearsMap : this._bot.cmd;
            if (map.get(cmd.name)) map.delete(cmd.name);
        }

        this._fileCommands.delete(file);
        this._clearCache(file);

        return registered.map(cmd => cmd.name);
    }

    reloadFile(file) {
        this.unloadFile(file);
        return this.loadFile(file, true);
    }

    _clearCache(file) {
        try {
            const resolved = require.resolve(file);
            delete require.cache[resolved];
        } catch {
            // File belum pernah di-require atau sudah dihapus, aman untuk diabaikan.
        }
    }

    _getFiles() {
        return globSync("**/*.js", {
            cwd: this._path,
            nodir: true,
            absolute: true
        });
    }

    _normalizeCommands(module, file) {
        if (module.name && (!module.type || module.type === "command" || module.type === "hears")) return [module];
        if (Array.isArray(module)) return module.filter(cmd => cmd.name && (!cmd.type || cmd.type === "command" || cmd.type === "hears"));
        return [];
    }

    _registerCommand(cmd) {
        if (cmd.type === "hears") {
            this._bot.hearsMap.set(cmd.name, cmd);
        } else {
            this._bot.cmd.set(cmd.name, cmd);
        }
    }
}

module.exports = CommandHandler;
