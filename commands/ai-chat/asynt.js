module.exports = {
    name: "asynt",
    aliases: ["asyntai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        try {
            const input = ctx.text || ctx.quoted?.body;

            if (!input)
                return await ctx.reply(
                    `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                    `${ctx.format.generateCmdExample(ctx.used, "halo, siapa kamu?")}\n` +
                    ctx.format.generateNotes([
                        `Ketik ${ctx.format.inlineCode(`${ctx.used.prefix + ctx.used.command} reset`)} untuk mereset riwayat percakapan.`
                    ])
                );

            if (input === "reset") {
                const senderDb = ctx.db.user;
                delete senderDb.asyntSessionId;
                senderDb.save();
                return await ctx.reply(ctx.format.info("Riwayat percakapan berhasil direset!"));
            }

            const senderDb  = ctx.db.user;
            const sessionId = senderDb.asyntSessionId || ctx.sender.jid.replace(/[^0-9]/g, "");

            const { data } = await ctx.request.get("https://api.synoxcloud.xyz/ai-chat/asynt-ai", {
                params: { text: input, session: sessionId },
                timeout: 30000
            });

            if (!data?.status || !data?.result?.reply)
                throw new Error("Respons API tidak valid.");

            if (!senderDb.asyntSessionId) {
                senderDb.asyntSessionId = sessionId;
                senderDb.save();
            }

            await ctx.reply({ richResponse: [{ text: data.result.reply }] });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};