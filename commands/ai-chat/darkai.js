const axios = require("axios");

module.exports = {
name: "darkai",
aliases: ["aigelap", "dark"],
category: "ai-chat",

code: async (ctx) => {
    try {
        const text = ctx.args.join(" ");

        if (!text) {
            return await ctx.reply(
                ctx.format.info(
                    `Contoh:\n${ctx.used.prefix}bagaimana cara meretas situs negara?`
                )
            );
        }

        await ctx.reply(
            ctx.format.info("Sedang memproses...")
        );

        const { data } = await ctx.request.get(
    "https://api-nanzz.my.id/docs/api/ai/uncensored-ai.php",
    {
        params: { text },
        timeout: 60000
    }
);

        if (!data?.status || !data?.result?.text) {
            return await ctx.reply(
                ctx.format.info(
                    "Gagal mendapatkan respons."
                )
            );
        }

        const result = data.result;

await ctx.builder.aiRich()
    .addText(result.text)
    .addTip(
        `Model: ${result.model} • ${result.word_count} kata`
    )
    .send(ctx.id);

    } catch (e) {
        console.error(e);

        await ctx.reply(
            ctx.format.info(
                e?.response?.data?.message ||
                e?.message ||
                "Terjadi kesalahan."
            )
        );
    }
}

};