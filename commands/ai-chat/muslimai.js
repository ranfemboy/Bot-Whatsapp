module.exports = {
    name: "muslimai",
    aliases: ["muslim", "islamai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "apa hukum sholat jumat?")
            );

        try {
            const { data } = await ctx.request.get("https://api.synoxcloud.xyz/ai-chat/muslimai", {
                params: { pesan: input },
                timeout: 30000
            });

            if (!data?.status || !data?.data)
                throw new Error("Respons API tidak valid.");

            await ctx.reply({ richResponse: [{ text: data.data }] });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};