module.exports = {
    name: "powerbrain",
    aliases: ["pb", "brain"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "halo, apa kabar?")
            );

        try {
            const { data } = await ctx.request.get("https://api.synoxcloud.xyz/ai-chat/powerbrain-ai", {
                params: { message: input },
                timeout: 30000
            });

            if (!data?.status || !data?.result?.answer)
                throw new Error("Respons API tidak valid.");

            await ctx.reply({ richResponse: [{ text: data.result.answer }] });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};