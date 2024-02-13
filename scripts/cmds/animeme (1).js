module.exports = {
  config: {
    name: "animememe",
    aliases: ["animeme"],
    version: "1.0",
    author: "kshitiz",
    countDown: 20,
    role: 0,
    shortDescription: "get anime memes video",
    longDescription: "it will send you anime meme video",
    category: "anime",
    guide: "{p}animeme",
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const senderID = event.senderID;

    const loadingMessage = await message.reply({
      body: "Loading random anime meme... Please wait! 🤡",
    });

    const link = [
      "https://drive.google.com/uc?export=download&id=1z1wVFu8utodxXac0MRI2uS9SZBRUTRmR",
      "https://drive.google.com/uc?export=download&id=1yrwwt5j50SkN8DPyQ8g56LFF6oMXVB2q",
      "https://drive.google.com/uc?export=download&id=1yNuWBm6g-bJ4h2ExJwmEeteUsDBDz3HR",
      "https://drive.google.com/uc?export=download&id=1xdk2fDIsV-dVvgUk7asw08X0WTIUwgTf",
      "https://drive.google.com/uc?export=download&id=1xRUu3Ae1eaZICYN5e690b8FWKJkIiq-w",
      "https://drive.google.com/uc?export=download&id=1xIlb7vTz3ZR5he8rW1lzS9xRPxZflFNz",
      "https://drive.google.com/uc?export=download&id=1xCFWG71h931gu-xb2-2vgiSscw_vVW3N",
      "https://drive.google.com/uc?export=download&id=1vtTafVbs4E0kkIW_8oVgcWLO9No4HrB-",
      "https://drive.google.com/uc?export=download&id=1va1zoPIvNsGvIPSrKYT3r11icjZk800J",
      "https://drive.google.com/uc?export=download&id=1t2BcA0dFL_KGm0_1SwRrts7XL9n0uFNn",
      "https://drive.google.com/uc?export=download&id=1-LsfOaiZXC7EZRcShJ2fKNCBIxfG0ozL",
      "https://drive.google.com/uc?export=download&id=1rZkRtK6HSHshSgnU9W-QcoIhhjtbO0ob",
      "https://drive.google.com/uc?export=download&id=1qvRc0PzDFfB4yIdVHMM0-rtNrfREoiTo",
      "https://drive.google.com/uc?export=download&id=1qqO6xOtOkEE3Q_S2E4DMdtQQ5xNdqq9E",
      "https://drive.google.com/uc?export=download&id=1q461o29fHBtMqk1mFc4EJqv6tMotjFIn",
      "https://drive.google.com/uc?export=download&id=1pEglKR6Fr91pyKTIP7NvY_aUU16Ql6-s",
      "https://drive.google.com/uc?export=download&id=1oxcxc4eeU3sRTmKgFs6WwVNayX0Pl-DI",
      "https://drive.google.com/uc?export=download&id=1okFs-a6HX7bvctGN3gVFECXhEmYSgESk",
      "https://drive.google.com/uc?export=download&id=1oX0K1wwcw06TfuRJZWT8Aq1WFqbn95vQ",
      "https://drive.google.com/uc?export=download&id=1nsVUvAsBWrKSltdqGhad3GJPLN8cZAFy",
      "https://drive.google.com/uc?export=download&id=1nYtn1skPk4vbYdVvjUoPJs4KriQYVkk_",
      "https://drive.google.com/uc?export=download&id=1mbbE3s69tefSRD8jqRlYhcJw3nzGlYcI",
      "https://drive.google.com/uc?export=download&id=1ko-heOBlSjmXnV3b8v-P_XoY5kwvuvqV",
      "https://drive.google.com/uc?export=download&id=1kLi0f_T2JJo21130jxNTiHxRqW70I5Z7",
      "https://drive.google.com/uc?export=download&id=1jQcG0PxK1-ArRwH9JwIqkBrRoSONy4As",
      "https://drive.google.com/uc?export=download&id=1ij6bW4uVvX81uZjBA19ecIy66oNRDwrr",
      "https://drive.google.com/uc?export=download&id=1i_Nnqr4O0AqjSnzK2DGMPesrGPwTic5D",
      "https://drive.google.com/uc?export=download&id=1gkMe6F6nyXb5jXg2lAltfzFotZEwIQZy",
      "https://drive.google.com/uc?export=download&id=1f_is5JJeKBWDekhCc0m_Epod98fd5FqC",
      "https://drive.google.com/uc?export=download&id=1fWY6Smt84f8kirVAcCeP9-XmQFCljR74",
      "https://drive.google.com/uc?export=download&id=1emhScnLfKiKk4Yr4-3EAbEqDbM32Kext",
      "https://drive.google.com/uc?export=download&id=1eMH01y65rSO-_PahGP0EYqN6qXj-4r_X",
      "https://drive.google.com/uc?export=download&id=1dcRj6_ahNQufVHsVJ4kkjVDs4ixcqV5k",
      "https://drive.google.com/uc?export=download&id=1dbwk8nfbjQ_bNJE-lrVAZEC4Lz_JuIZe",
      "https://drive.google.com/uc?export=download&id=1d_3xbuNV8in8ySE7L0bgWJGLfoZdpUrm",
      "https://drive.google.com/uc?export=download&id=1d3KS5IhWlujEL-BtHqdoUOA45VI3JSbK",
      "https://drive.google.com/uc?export=download&id=1cuLIp4L5xDNT8zFBkVmiIQkRvX6iw1eb",
      "https://drive.google.com/uc?export=download&id=1cbVtXoXaKjmBs4O-IuO6Zis9mu7noZV2",
      "https://drive.google.com/uc?export=download&id=1cY7oogNXOHlWVXLX9WE1lOV7oaQxf6rn",
      "https://drive.google.com/uc?export=download&id=1bns9KVdvPVW3A_18u93hVWTZ_zlS0Gst",
      "https://drive.google.com/uc?export=download&id=1_qad2iPPS2EjAxu8JlbEEfLo2Hgi7k_J",
      "https://drive.google.com/uc?export=download&id=1_lc9iir3OdBOp8jDr6uz-jS0XItoxRLz",
      "https://drive.google.com/uc?export=download&id=1_l1hcnwGsMSZMBSb-Lo6qzFB6ol99INx",
      "https://drive.google.com/uc?export=download&id=1Zy8_7KVvUc8gpUgjpqbFX2rnay9KG8On",
      "https://drive.google.com/uc?export=download&id=1YFZIfnH5jNHOpRAstD6V0MqgUB3pgtoJ",
      "https://drive.google.com/uc?export=download&id=1XJcbTS269GvMhq1cpq6M2W4iRTH_Sln-",
      "https://drive.google.com/uc?export=download&id=1Wz4e3ujd5pXb5Bg3KaIGRql0Nwpz5WaD",
      "https://drive.google.com/uc?export=download&id=1Wnh3OKcu9rkvuT8yla3gkpMymzOjEXEn",
      "https://drive.google.com/uc?export=download&id=1WjU-LCwBYuU7uWOsofE7vZK3IYxJHrav",
      "https://drive.google.com/uc?export=download&id=1WdCxrTl5QAH316LtNibevuqJ22Prfz28",
      "https://drive.google.com/uc?export=download&id=1VdR2I_1i7P3HSNHmJ0igOT_qnz9At0VJ",
      "https://drive.google.com/uc?export=download&id=1VIzuOVepWXcLrl2ea22t-K7e-MPKjxSs",
      "https://drive.google.com/uc?export=download&id=1Uxo0I8Zq5FKVei45Kl7dkk6oNXqZRtnW",
      "https://drive.google.com/uc?export=download&id=1USnzcZ7XGPWU2iJDmIAkla2dKO8KwmzO",
      "https://drive.google.com/uc?export=download&id=1TgKwa7mQhFcZqhnruEeR8R31_CJ1aJU-",
      "https://drive.google.com/uc?export=download&id=1TgIe8aOgru0FJ9FyeaX7nbUXVfOqzW6x",
      "https://drive.google.com/uc?export=download&id=1SpaWAsw_JSBUTIaQEzLMMMq_iYXq6KsK",
      "https://drive.google.com/uc?export=download&id=1R6X92FvT87-iIAgmykGFG0Mw7mEIzEFM",
      "https://drive.google.com/uc?export=download&id=1R512VZtpMppaMFEq3V2GOhRM2M0u6zTL",
      "https://drive.google.com/uc?export=download&id=1QeS33ye0ku_U7TWue9Hon-qA7iPLMQj4",
      "https://drive.google.com/uc?export=download&id=1QFmtUPauxmctAssHQO5SvEuUGkj5xQBq",
      "https://drive.google.com/uc?export=download&id=1Q9Nb_MQB2EqWn3F1IqUs16SHSkHlAb2e",
      "https://drive.google.com/uc?export=download&id=1Py2_xtJH6ACV2dTBdOfb28_iWpaxS38R",
      "https://drive.google.com/uc?export=download&id=1PXzdQVTBw2zw6zCpE32-fg6uiLSCEk6M",
      "https://drive.google.com/uc?export=download&id=1OlL0rgj147Zb_cAHAdoydW4TQZhKaTwT",
      "https://drive.google.com/uc?export=download&id=1O3pgs0F6213ubzyZhyyWezcyOZUJJ2om",
      "https://drive.google.com/uc?export=download&id=1NrJEPl8EYskSxEfh4cuZwV8RRbbK1hHN",
      "https://drive.google.com/uc?export=download&id=1NR4D9vIMUvmtSvaMznpvSGicEDx10Xfz",
      "https://drive.google.com/uc?export=download&id=1NL7OFV-KziquhWiKaxG7OtDgCdkCl77i",
      "https://drive.google.com/uc?export=download&id=1N2VwyBT29HVH5UBcNSrW3Hp6hs2e_kU_",
      "https://drive.google.com/uc?export=download&id=1MmY4Dl3j8HlujZA1fffLEWy9Re4elHPC",
      "https://drive.google.com/uc?export=download&id=1Lu6Z-OhmItTowXG1V_iwV4Y5t0s_bETb",
      "https://drive.google.com/uc?export=download&id=1LohJO-EbAiNZ_Kgwrcb_8t5FURdElcat",
      "https://drive.google.com/uc?export=download&id=1JuKgQoTT0Bwfz4b-lkSOELISxlIG_FT4",
      "https://drive.google.com/uc?export=download&id=1JUMt6AXITh2YpGCPU7mK5ywSi8SIMBuU",
      "https://drive.google.com/uc?export=download&id=1JLF07GdSmPXH9txLO15UPM2NEudOiT0x",
      "https://drive.google.com/uc?export=download&id=1IaTJGQxOv2u-dyg2lZ7UO227LDKyqNIM",
      "https://drive.google.com/uc?export=download&id=1Ia8sspAeF2FWh7-PDay7qImhEhP4UqPy",
      "https://drive.google.com/uc?export=download&id=1I5yEX1R3IXuqwcwf7InyKKvY61kRvrqX",
      "https://drive.google.com/uc?export=download&id=1H_xgxDd5bHxxcv8RsGDeUpGN_fVBX_Zr",
      "https://drive.google.com/uc?export=download&id=1G62mv9TAd34hiNEckHYb1q8IVGGNEXiD",
      "https://drive.google.com/uc?export=download&id=1G4zdTo8pSe8LsALOtxS2CDfOy_imwKOa",
      "https://drive.google.com/uc?export=download&id=1FAta7Hz2S9qXRdVUrfEtgrYofMeXXHJV",
      "https://drive.google.com/uc?export=download&id=1EZmGV44pKiOZXNHeolxeBZrPfjLrFUHZ",
      "https://drive.google.com/uc?export=download&id=1E6QAjYVZi_4pJjaPd_6i129SgOy_XFmH",
      "https://drive.google.com/uc?export=download&id=1DwOnEM2FHHEaDdBy6Z5KWW5OldN5I2FA",
      "https://drive.google.com/uc?export=download&id=1DvkUR-unD5e-6OSQ5mTrKiFZagIVr84q",
      "https://drive.google.com/uc?export=download&id=1DLRWbq6oSO2iYcBOm3-NHuvRLg9E3vth",
      "https://drive.google.com/uc?export=download&id=1AaZQ6g5glL-anjZO5HNM0fthI84zHdoF",
      "https://drive.google.com/uc?export=download&id=1A9ESTLUYCIqC4wv1vtCcYtydkFnUVl_h",
      "https://drive.google.com/uc?export=download&id=19dlkMVe5ogMZmzlezn-J-9437liqt1WU",
      "https://drive.google.com/uc?export=download&id=17UmKICXkV0o37t7-JuJSKR6FTBHEwUpl",
      "https://drive.google.com/uc?export=download&id=16pGyRuYchipHPbOJmu5xThM4w4oyvoMQ",
      "https://drive.google.com/uc?export=download&id=166qUVmh371KDsrw7qhMMkJwf_2Il_2ea",
      "https://drive.google.com/uc?export=download&id=1-fBxPubU1rWrDUpsiE7ThSYjiwgIX4pc",
      "https://drive.google.com/uc?export=download&id=112MVWfvirhvWRf66QZiEO_Ft7JgjQvrj",
      "https://drive.google.com/uc?export=download&id=12-SBMgpbCdUGeNlg33mpLcR2jhC2Pa4z",
      "https://drive.google.com/uc?export=download&id=1299bWEA8u5qGugO4MGvIaD9FXNpF-61a",
      "https://drive.google.com/uc?export=download&id=12DNDQWIMEt-W7--VehpXeeERp5znjR5G",
      "https://drive.google.com/uc?export=download&id=12UDSftof2lR06aK9BszC_tWL_ParLmXG",
      "https://drive.google.com/uc?export=download&id=12z-q50-NW837bLApBFGMnEJUNCFnB4_J",
      "https://drive.google.com/uc?export=download&id=144AnJzIGQnXAEBFDKOus0bukXnqVqV15",
      "https://drive.google.com/uc?export=download&id=14r6IORobonhaUYz7iTvlnoUEqct0TGmc",
      "https://drive.google.com/uc?export=download&id=15NxRtsorjO2xKu2Puqm4foYobDiwgknH",
      "https://drive.google.com/uc?export=download&id=166qUVmh371KDsrw7qhMMkJwf_2Il_2ea",
      "https://drive.google.com/uc?export=download&id=1A9ESTLUYCIqC4wv1vtCcYtydkFnUVl_h",

    ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];

    this.sentVideos.push(randomVideo);

    if (senderID !== null) {
      message.reply({
        body: 'Random animeme💁‍♀️',
        attachment: await global.utils.getStreamFromURL(randomVideo),
      });

      setTimeout(() => {
        api.unsendMessage(loadingMessage.messageID);
      }, 5000);
    }
  },
};