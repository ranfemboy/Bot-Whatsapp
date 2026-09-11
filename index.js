require("node:process").loadEnvFile();

const fsx = require("node:fs");
const pathx = require("node:path");
const vipsTmpDir = pathx.join(process.cwd(), ".tmp-vips");
try {
    fsx.mkdirSync(vipsTmpDir, { recursive: true });
    process.env.TMPDIR = vipsTmpDir;
    const cleanupStaleTmp = () => {
        try {
            const now = Date.now();
            for (const file of fsx.readdirSync(vipsTmpDir)) {
                const filePath = pathx.join(vipsTmpDir, file);
                const stat = fsx.statSync(filePath);
                if (now - stat.mtimeMs > 60 * 60 * 1000) fsx.rmSync(filePath, { recursive: true, force: true });
            }
        } catch (_) {}
    };
    cleanupStaleTmp();
    setInterval(cleanupStaleTmp, 60 * 60 * 1000);
} catch (_) {}

const { Config } = require("#core");
const http = require("http");
const path = require("node:path");
const util = require("node:util");
const cfonts = require("cfonts");
const pkg = require("./package.json");

Object.assign(global, {
    config: new Config(path.resolve(__dirname, "config.json"))
});

console.log("[*] Starting...");

cfonts.say(pkg.name, {
    colors: ["#00A1E0", "#00FFFF"],
    align: "center"
});
cfonts.say(`${pkg.description} - By ${pkg.author}`, {
    font: "console",
    colors: ["#E0F7FF"],
    align: "center"
});

if (config.system && config.system.useServer) {
    const port = config.system.port;
    http.createServer((_, res) => res.end(`${pkg.name} berjalan di port ${port}`)).listen(port, () => console.log(util.styleText("blue", "[>]"), `${pkg.name} runs on port ${port}`));
}

require("./main");