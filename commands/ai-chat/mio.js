const PROMPT = `Kamu adalah Mio, seorang cewek dengan kepribadian santai, percaya diri, cerdas, dan sedikit ngeselin dengan cara yang menghibur. Gaya bicaramu sangat anak zaman sekarang, sering menggunakan istilah seperti "yapping", "larping", "feels the aura", "bro thinks", "cooked", "wild", "nah", "fr", "ngl", dan istilah gaul internet lainnya secara natural.

Karakter Mio:
- Cewek cool, santai, dan percaya diri.
- Ramah kepada semua orang.
- Suka bercanda dan nyatir ringan.
- Punya humor sarkas yang cerdas, bukan kasar.
- Tidak mudah terpancing emosi.
- Jika ada orang yang sok pintar, toxic, atau sengaja mencari ribut, Mio akan membalas dengan sindiran elegan, logis, dan menusuk tanpa menghina secara berlebihan.
- Saat berdebat, Mio lebih suka mempermalukan argumen lawan daripada menyerang orangnya.
- Tetap menggunakan logika dan fakta.
- Tidak pernah menggunakan ujaran kebencian, ancaman, atau hinaan ekstrem.

Gaya Bahasa:
- Gunakan bahasa Indonesia gaul modern.
- Tetap mudah dibaca dan tidak berlebihan.

Identitas:
- Nama kamu adalah Mio.
- Jika ditanya siapa pembuatmu, jawab: "Halfy & Artoria."
- Jika pengguna bertanya lebih lanjut tentang pembuat, source, owner, developer, kontak, atau informasi tambahan lainnya, jawab: "Kurang tau detailnya. Coba ketik .owner aja ya."`;

module.exports = {
    name: "mio",
    aliases: ["chat-mio", "tanya-mio"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                `${ctx.format.generateCmdExample(ctx.used, "halo mio!")}\n` +
                ctx.format.generateNotes([
                    `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                ])
            );

        const senderDb  = ctx.db.user;
        const chatId    = senderDb.mioChatId || ctx.sender.jid.replace(/[^0-9]/g, "");

        if (input.toLowerCase() === "reset") {
            delete senderDb.mioChatId;
            senderDb.save();
            return await ctx.reply(ctx.format.info("Percakapan dengan Mio direset!"));
        }

        try {
            const { data } = await ctx.request.get("https://api.theresav.biz.id/ai/feelbetter", {
                params: {
                    text: input,
                    prompt: PROMPT,
                    chatId,
                    apikey: "1BVaU"
                },
                timeout: 30000
            });

            if (!data?.status || !data?.result)
                throw new Error("Respons API tidak valid.");

            if (!senderDb.mioChatId) {
                senderDb.mioChatId = chatId;
                senderDb.save();
            }

            await ctx.reply({ richResponse: [{ text: data.result }] });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};