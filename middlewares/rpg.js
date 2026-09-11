// Developer Mode untuk sistem RPG (owner-only), diterapkan secara terpusat di sini
// supaya plugin RPG tidak perlu berisi pengecekan "if (owner)" satu-satu.
//
// - Percobaan pertama owner memakai fitur RPG -> stat/equipment langsung di-max-kan.
// - Percobaan berikutnya -> resource yang berkurang (hp/stamina/coin) di-refill otomatis.
// - Bypass cooldown & "tidak pernah kalah" ditangani oleh helper (checkCooldown,
//   spendCoin, simulateBattle) yang membaca isDevMode(ctx), bukan oleh middleware ini.
const {
    ensureRpgUser,
    isDevMode,
    initDevModeDefaults,
    applyDevModeRefill
} = require("../commands/rpg/_lib/helper");

module.exports = (bot) => {
    bot.use(async (ctx, next) => {
        const command = [...ctx.bot.cmd.values()].find(cmd => [cmd.name, ...(cmd?.aliases || [])].includes(ctx.used.command));

        if (command?.category === "rpg") {
            const senderDb = ctx.db.user;
            if (senderDb) {
                const rpg = ensureRpgUser(senderDb);
                if (isDevMode(ctx)) {
                    if (!rpg.devModeInitialized) initDevModeDefaults(senderDb);
                    else applyDevModeRefill(senderDb);
                }
            }
        }

        await next();
    });
};
