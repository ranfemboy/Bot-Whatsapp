const APIs = {
    alwayscodex: {
        baseURL: "https://api.alwayscodex.my.id"
    },
    delirius: {
        baseURL: "https://api.delirius.store"
    },
    faaa: {
        baseURL: "https://api-faa.my.id"
    },
    ikyyxd: {
        baseURL: "https://api.ikyyxd.my.id"
    },
    // Pengganti delirius untuk twitterdl. Butuh apikey di query string.
    naze: {
        baseURL: "https://api.naze.biz.id",
        APIKey: "nz-5d0536035e"
    },
    // TODO(migrasi): base URL asli belum diketahui — tidak ditemukan di dokumentasi publik manapun.
    // Dipakai oleh: ai-generate/deepgen.js, ai-generate/gemmy.js. Isi baseURL yang benar sebelum dipakai.
    neo: {
        baseURL: "https://REPLACE_ME.example.com"
    },
    // TODO(migrasi): base URL asli belum diketahui. Dipakai oleh: ai-generate/labsgen.js.
    neosoft: {
        baseURL: "https://REPLACE_ME.example.com"
    },
    // TODO(migrasi): base URL asli belum diketahui. Dipakai oleh: ai-generate/wainsfwillustrious.js.
    kuroneko: {
        baseURL: "https://REPLACE_ME.example.com"
    },
    lexcode: {
        baseURL: "https://api.lexcode.biz.id"
    },
    nexray: {
        baseURL: "https://api.nexray.eu.cc"
    },
    sanka: {
        baseURL: "https://sankavollerei.com",
        APIKey: "planaai"
    },
    siputzx: {
        baseURL: "https://api.siputzx.my.id"
    }
};

function createUrl(apiNameOrURL, endpoint, params = {}, apiKeyParamName) {
    const api = APIs[apiNameOrURL];
    if (!api) {
        const url = new URL(apiNameOrURL);
        apiNameOrURL = url;
    }

    // Base URL masih placeholder (belum dikonfigurasi) — lempar error jelas sekarang
    // daripada request diam-diam gagal ke domain palsu dan bikin pesan error membingungkan.
    if (api?.baseURL?.includes("REPLACE_ME")) {
        throw new Error(`API "${apiNameOrURL}" belum dikonfigurasi (baseURL masih placeholder). Isi baseURL yang benar di core/utils/api.js sebelum command ini dipakai.`);
    }

    const queryParams = new URLSearchParams(params);
    if (apiKeyParamName && api && "APIKey" in api) queryParams.set(apiKeyParamName, api.APIKey);

    const baseURL = api ? api.baseURL : apiNameOrURL.origin;
    const apiUrl = new URL(endpoint, baseURL);
    apiUrl.search = queryParams.toString();

    return apiUrl.toString();
}

function listUrl() {
    return APIs;
}

module.exports = {
    createUrl,
    listUrl
};
