module.exports = {
    name: "turboseek",
    aliases: ["seek", "search-ai"],
    category: "ai-chat",
    permissions: {
        coin: 10
    },

    code: async (ctx) => {
        const input = ctx.text || ctx.quoted?.body;

        if (!input)
            return await ctx.reply(
                `${ctx.format.generateInstruction(["send"], ["text"])}\n` +
                ctx.format.generateCmdExample(ctx.used, "lebih dulu tercipta bumi atau bulan?")
            );

        try {
            const { data } = await ctx.request.post(
                "https://api.synoxcloud.xyz/ai-chat/turboseek-ai",
                null,
                { params: { q: input }, timeout: 30000 }
            );

            if (!data?.success || !data?.result?.answer)
                throw new Error("Respons API tidak valid.");

            // Bersihkan tag HTML dari jawaban
            const answer = data.result.answer
                .replace(/<[^>]+>/g, "")
                .replace(/```html|```/g, "")
                .trim();

            // Ambil max 3 referensi
            const refs = (data.result.references || []).slice(0, 3);
            const refText = refs.length
                ? "\n\n*Referensi:*\n" + refs.map((r, i) => `${i + 1}. ${r.title}\n${r.url}`).join("\n\n")
                : "";

            await ctx.reply({
                richResponse: [{ text: answer + refText }]
            });

        } catch (error) {
            await ctx.helper.handleError(ctx, error, true);
        }
    }
};