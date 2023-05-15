"use strict";

module.exports = function (_defaultFuncs, _api, _ctx) {
	// Currently the only colors that can be passed to api.changeThreadColor(); may change if Facebook adds more
	return {
		//Old hex colors.
		////MessengerBlue: null,
		////Viking: "#44bec7",
		////GoldenPoppy: "#ffc300",
		////RadicalRed: "#fa3c4c",
		////Shocking: "#d696bb",
		////PictonBlue: "#6699cc",
		////FreeSpeechGreen: "#13cf13",
		////Pumpkin: "#ff7e29",
		////LightCoral: "#e68585",
		////MediumSlateBlue: "#7646ff",
		////DeepSkyBlue: "#20cef5",
		////Fern: "#67b868",
		////Cameo: "#d4a88c",
		////BrilliantRose: "#ff5ca1",
		////BilobaFlower: "#a695c7"

		//#region This part is for backward compatibly
		//trying to match the color one-by-one. kill me plz
		MessengerBlue: "196241301102133",  //DefaultBlue
		Viking: "1928399724138152", //TealBlue
		GoldenPoppy: "174636906462322",  //Yellow
		RadicalRed: "2129984390566328", //Red
		Shocking: "2058653964378557", //LavenderPurple
		FreeSpeechGreen: "2136751179887052", //Green
		Pumpkin: "175615189761153",  //Orange
		LightCoral: "980963458735625",  //CoralPink
		MediumSlateBlue: "234137870477637",  //BrightPurple
		DeepSkyBlue: "2442142322678320", //AquaBlue
		BrilliantRose: "169463077092846",  //HotPink
		//i've tried my best, everything else can't be mapped. (or is it?) -UIRI 2020
		//#endregion

		DefaultBlue: "196241301102133",
		HotPink: "169463077092846",
		AquaBlue: "2442142322678320",
		BrightPurple: "234137870477637",
		CoralPink: "980963458735625",
		Orange: "175615189761153",
		Green: "2136751179887052",
		LavenderPurple: "2058653964378557",
		Red: "2129984390566328",
		Yellow: "174636906462322",
		TealBlue: "1928399724138152",
		Aqua: "417639218648241",
		Mango: "930060997172551",
		Berry: "164535220883264",
		Citrus: "370940413392601",
		Candy: "205488546921017",

		/**
		 * July 06, 2022
		 * added by @NTKhang
		 */
		Earth: "1833559466821043",
		Support: "365557122117011",
		Music: "339021464972092",
		Pride: "1652456634878319",
		DoctorStrange: "538280997628317",
		LoFi: "1060619084701625",
		Sky: "3190514984517598",
		LunarNewYear: "357833546030778",
		Celebration: "627144732056021",
		Chill: "390127158985345",
		StrangerThings: "1059859811490132",
		Dune: "1455149831518874",
		Care: "275041734441112",
		Astrology: "3082966625307060",
		JBalvin: "184305226956268",
		Birthday: "621630955405500",
		Cottagecore: "539927563794799",
		Ocean: "736591620215564",
		Love: "741311439775765",
		TieDye: "230032715012014",
		Monochrome: "788274591712841",
		Default: "3259963564026002",
		Rocket: "582065306070020",
		Berry2: "724096885023603",
		Candy2: "624266884847972",
		Unicorn: "273728810607574",
		Tropical: "262191918210707",
		Maple: "2533652183614000",
		Sushi: "909695489504566",
		Citrus2: "557344741607350",
		Lollipop: "280333826736184",
		Shadow: "271607034185782",
		Rose: "1257453361255152",
		Lavender: "571193503540759",
		Tulip: "2873642949430623",
		Classic: "3273938616164733",
		Peach: "3022526817824329",
		Honey: "672058580051520",
		Kiwi: "3151463484918004",
		Grape: "193497045377796",

		/**
		 * July 15, 2022
		 * added by @NTKhang
		 */
		NonBinary: "737761000603635",

		/**
		 * November 25, 2022
		 * added by @NTKhang
		 */
		ThankfulForFriends: "1318983195536293",
		Transgender: "504518465021637",
		TaylorSwift: "769129927636836",
		NationalComingOutDay: "788102625833584",
		Autumn: "822549609168155",
		Cyberpunk2077: "780962576430091",

		/**
		 * May 13, 2023
		 */
		MothersDay: "1288506208402340",
		APAHM: "121771470870245",
		Parenthood: "810978360551741",
		StarWars: "1438011086532622",
		GuardianOfTheGalaxy: "101275642962533",
		Bloom: "158263147151440",
		BubbleTea: "195296273246380",
		Basketball: "6026716157422736",
		ElephantsAndFlowers: "693996545771691"
	};
};
