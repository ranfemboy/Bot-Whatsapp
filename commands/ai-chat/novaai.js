module.exports = {
    name: "novaai",
    aliases: ["nova"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "halo, siapa kamu?")
            );

        try {
            const { data } = await ctx.request.get("https://api.synoxcloud.xyz/ai-chat/novaai", {
                params: { text: input },
                timeout: 30000
            });

            if (!data?.status || !data?.result?.reply)
                throw new Error("Respons API tidak valid.");

            await ctx.reply({ richResponse: [{ text: data.result.reply }] });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};