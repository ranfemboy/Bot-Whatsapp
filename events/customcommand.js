// Event ini mendeteksi apabila media (sticker/gambar/video/dokumen/audio) yang dikirim
// cocok dengan salah satu custom command yang didaftarkan lewat .addcmd.
// Deteksi pakai fileSha256 bawaan WhatsApp (hash isi file), bukan download ulang manual.
module.exports = (bot) => {
    bot.ev.on("MessagesUpsert", async (ctx) => {
        try {
            if (!ctx.msg?.message || ctx.msg.key.fromMe) return;

            const messageType = Object.keys(ctx.msg.message)[0];
            const mediaTypes = ["stickerMessage", "imageMessage", "videoMessage", "documentMessage", "audioMessage"];
            if (!mediaTypes.includes(messageType)) return;

            const mediaNode = ctx.msg.message[messageType];
            if (!mediaNode?.fileSha256) return;

            const hash = Buffer.from(mediaNode.fileSha256).toString("base64");

            const botDb = ctx.db.bot;
            const match = (botDb?.customCommands || []).find(c => c.hash === hash);
            if (!match) return;

            // Lewat forceCommand supaya command aslinya yang jalan (bukan manggil
            // command.code() langsung), bukan ctx.id — Ctx gak punya properti itu,
            // jid tujuan diambil dari ctx.msg.key.remoteJid.
            await bot.forceCommand(ctx.msg.key.remoteJid, match.command, "", ctx.sender);
        } catch (error) {
            console.error("[customcommand]", error);
        }
    });
};
