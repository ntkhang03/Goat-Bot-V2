const fs = require('fs');// this cmd is not finished yet wait for its official release
const path = require('path');
const request = require('request');

module.exports = {
    config: {
        name: "anime",
        version: "1.0",
        author: "KSHITIZ",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Anime recommendation"
        },
        longDescription: {
            en: "Recommend an anime based on a genre."
        },
        category: "Entertainment",
        guide: "{prefix} anime [genre] genre = shonen, seinen, isekai, scifi"
    },


    lastRecommendation: {},

    onStart: async function ({ api, args, message, event }) {
        const animeRecommendations = {
            shonen: [
                {
                    animeName: "Naruto",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1OP2zmycLmFihRISVLzFwrw__LRBsF9GN"
                },
                {
                    animeName: "One Piece",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1QaK3EfNmbwAgpJm4czY8n8QRau9MXoaR"
                },
                {
                    animeName: "Dragon Ball Z",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1q-8lFZD5uPmhRySvT75Bgsr2lp9UQ4Mi"
                },
                {
                    animeName: "Bleach",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1bds-i6swtqi2k4YCoglPKTV7kL7f-SF7"
                },
                {
                    animeName: "My Hero Academia",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1uOcTZ8r1zDGmqF9Nyg1vupuWHKEg1eVf"
                },
                {
                    animeName: "Attack on Titan",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1DrBwp7irJrW_DVmIXHbNvFjofHCTmZ0a"
                },
                {
                    animeName: "Hunter x Hunter",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1W4RHPv1zWtFUGFVUJ0uiCxvP5ovpURHG"
                },
                {
                    animeName: "Fullmetal Alchemist: Brotherhood",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1C-pRqtjpCFFPSZf8xAsNLgn9VgZBUgu6"
                },
                {
                    animeName: "Demon Slayer: Kimetsu no Yaiba",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1vU5XMLgKwBPfsiheUF4SK79LfKbzU6NX"
                },
                {
                    animeName: "Death Note",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1tUJEum_tf79gj9420mHx-_q7f0QP27DC"
                },
                {
                    animeName: "Yu Yu Hakusho",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1JL07gw2S4f6T_d9ufWDnNkDme3zqOuLU"
                },
                {
                    animeName: "Fairy Tail",
                    imageUrl: "https://drive.google.com/uc?export=download&id=13WKaqx8rdmwZE7VDWRK0fFkk8zkA7AOi"
                },
                {
                    animeName: "One Punch Man",
                    imageUrl: "https://drive.google.com/uc?export=download&id=10KOnQyrli8HPaeThalyN3KA2yX0T28Uj"
                },
                {
                    animeName: "Sword Art Online",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1JxczwxBgreEc4tZdLTdFHh6klsvlCYkM"
                },
                {
                    animeName: "JoJo's Bizarre Adventure",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1aKzkrSAYAPXNIPhazTT6pkQxJpdQOD2p"
                },
                {
                    animeName: "Dragon Ball",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1oonrlOFBjdYLV2zv9V-oB0AenGH4HNr2"
                },
                {
                    animeName: "Haikyuu!!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1tFHwCTNgoLHi34YL6fdXq2taZINZERHR"
                },
                {
                    animeName: "Black Clover",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1ecenM1HVzgPtwaN8eISfxwBB-uKqdZoj"
                },
                {
                    animeName: "The Seven Deadly Sins",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1FzV9FwXri9xxwAy-xrlA8zA6dyO70tkf"
                },
                {
                    animeName: "Mob Psycho 100",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1qBXCvbhENmyC05vLHQLFJR-xlf5HhZzF"
                },
                {
                    animeName: "Assassination Classroom",
                    imageUrl: "https://drive.google.com/uc?export=download&id=13IP6cwdimzHv3nUJi-kODbGKIAHpJEAy"
                },
                {
                    animeName: "Toriko",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1Gu6us6Ue5530ynkpFu-vsGOCynq_o6EI"
                },
                {
                    animeName: "Blue Exorcist",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1f8CGrENwaHOgy11yeNdPwDI_nzpcESky"
                },
                {
                    animeName: "Noragami",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1PxUiu6ZhJT5btIAWNubNPD3cQPNWnvYp"
                },
                {
                    animeName: "Gurren Lagann",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1o57c1C7yXr_RDHz0lAH9lWJUgpMzQn1x"
                },
                {
                    animeName: "Magi: The Labyrinth of Magic",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1hQEdeO3F8v1sZQvZ6uh5n_YTwuizYt0v"
                },
                {
                    animeName: "Beelzebub",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1Lz3PNL1X4ygv1U7xcFgILYODtGiwaGn9"
                },
                {
                    animeName: "Fire Force",
                    imageUrl: "https://drive.google.com/uc?export=download&id=11vryRMTkLuFvhlWjVZkuAaS0QoesIlwo"
                },
                {
                    animeName: "The Rising of the Shield Hero",
                    imageUrl: "https://drive.google.com/file/d/1oRD7AAH_VD73o8kUlUaJQC1dFTrV1nDz/view?usp=sharing"
                },
                {
                    animeName: "Dr. Stone",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1jpb7fFDZpdHjACghQWUQopI0nzzvzrxY"
                },
                {
                    animeName: "The Promised Neverland",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1AREnLG7w6VSdKuTi-gtnb39aoV8XdUXV"
                },
                {
                    animeName: "World Trigger",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1yo-18brlycFf_ieBoWrUXXpAoUP3aUUX"
                },
                {
                    animeName: "Kuroko's Basketball",
                    imageUrl: "https://drive.google.com/uc?export=download&id=10DLx4o4V_aC9IoQyJmhd5as6bbyYzUFD"
                },
                {
                    animeName: "K-On!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1lR87igFhcRilVCky_0dzRT7TwQwd0ROt"
                },
                {
                    animeName: "Durarara!!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1OPE1Iva4JcoZkBUM8A2RokUuNwmAFXVu"
                },
                {
                    animeName: "D.Gray-man",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1A6GOPhwuUZONyQvNjXtd8v5uhVuJ4a9N"
                },
                {
                    animeName: "Seraph of the End",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1w77GthKwlhZlyPWHzg3adtiqRJ9znLeR"
                },
                {
                    animeName: "Gintama",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1UCaRajoK2ZprPAWNWK7aRQhHDirY3-Hs"
                },
                {
                    animeName: "Air Gear",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1dfTNijY40l_CZHhP__yd-v_RozKtwHw_"
                },
                {
                    animeName: "Hajime no Ippo",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1cASzbVsNR-YXv02ZLdVvL-6Fsoc2B1FJ"
                },
                {
                    animeName: "Rurouni Kenshin",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1MA1_270eyhBkMRF001wE2QWoq0_6EjpK"
                },
                {
                    animeName: "Yu-Gi-Oh!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=19g-LMWLAhWPNbbjXrzk22ai3qFen9QXt"
                },
                {
                    animeName: "Katekyo Hitman Reborn!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1Qq-AGdBalodBDmQcY6iPC4kUUS0z7A73"
                },
                {
                    animeName: "Shaman King",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1mW49sTK7YwyLE1MY-6z64mYbPE7iDlsl"
                },
                {
                    animeName: "Neon Genesis Evangelion",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1dp3Pe3Ckbu6MsnlAEj5QsbQrp6chTe-p"
                },
                {
                    animeName: "Blue Dragon",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1dKXAveL6LyBgClgscDrAa-doaavwXtdq"
                },
                {
                    animeName: "Zatch Bell!",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1RTRPU9yF3tIfzG-rNWljdfzzLgxgxEVk"
                },
                {
                    animeName: "Eyeshield 21",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1e0XOffNUQtfQDwOLZ0e7IwlBOneZdOZo"
                },
                {
                    animeName: "Kenichi: The Mightiest Disciple",
                    imageUrl: "https://drive.google.com/uc?export=download&id=1DysZxKEN_QSfMjB3DDOR-iWHFshmae_Y"
                },
                {
                    animeName: "Beyblade",
                    imageUrl: "https://drive.google.com/uc?export=download&id=14UrkjjLC2595N5yUClXRxsjq3x81unHU"
                },
                // Add more shonen anime recommendations here
            ],
          seinen: [
              {
                  animeName: "Berserk",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Cowboy Bebop",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Hellsing",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Black Lagoon",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Ghost in the Shell: Stand Alone Complex",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Psycho-Pass",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Monster",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Death Parade",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Vinland Saga",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Paranoia Agent",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Gantz",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Ergo Proxy",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Black Lagoon",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Rainbow: Nisha Rokubou no Shichinin",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Welcome to the NHK!",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Mushishi",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Steins;Gate",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Claymore",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Neon Genesis Evangelion",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Perfect Blue",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Elfen Lied",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "The Tatami Galaxy",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Serial Experiments Lain",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Grave of the Fireflies",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Samurai Champloo",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Black Butler",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Ajin: Demi-Human",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Princess Mononoke",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Gangsta",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Ghost Hunt",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Tokyo Ghoul",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Witch Hunter Robin",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Baccano!",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Rainbow",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Parasyte: The Maxim",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Shigurui: Death Frenzy",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Paprika",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Terra Formars",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Ghost in the Shell: SAC 2nd GIG",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Kaiji: Ultimate Survivor",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Requiem for the Phantom",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Terror in Resonance",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Texhnolyze",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Akira",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Gankutsuou: The Count of Monte Cristo",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Devilman: Crybaby",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              {
                  animeName: "Aoi Bungaku",
                  imageUrl: "REPLACE_WITH_IMAGE_URL"
              },
              // Add more seinen anime recommendations here
          ],
            isekai: [
               {
                       animeName: "Re:Zero - Starting Life in Another World",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Sword Art Online",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "No Game No Life",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Overlord",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Log Horizon",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Rising of the Shield Hero",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "That Time I Got Reincarnated as a Slime",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "KonoSuba: God's Blessing on This Wonderful World!",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Devil Is a Part-Timer!",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Grimgar, Ashes and Illusions",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Drifters",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "In Another World with My Smartphone",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Familiar of Zero",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Digimon Adventure",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Vision of Escaflowne",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Gate: Jieitai Kanochi nite, Kaku Tatakaeri",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "InuYasha",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Twelve Kingdoms",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Re:Creators",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Isekai Cheat Magician",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Cautious Hero: The Hero Is Overpowered but Overly Cautious",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Arifureta: From Commonplace to World's Strongest",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Time I Got Reincarnated as a Slime",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Ascendance of a Bookworm",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Hai to Gensou no Grimgar",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Knights & Magic",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "In Another World with My Smartphone",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Master of Ragnarok & Blesser of Einherjar",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Devil Is a Part-Timer!",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "Outbreak Company",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Saint's Magic Power Is Omnipotent",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "In Another World with My Absurd Skill",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },
                   {
                       animeName: "The Devil Is a Part-Timer!",
                       imageUrl: "REPLACE_WITH_IMAGE_URL"
                   },

               ],
            scifi: [
                {
                    animeName: "Cowboy Bebop",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Ghost in the Shell: Stand Alone Complex",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Neon Genesis Evangelion",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Steins;Gate",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Psycho-Pass",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Serial Experiments Lain",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Ergo Proxy",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Space Dandy",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Planetes",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Aldnoah.Zero",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Trigun",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Code Geass: Lelouch of the Rebellion",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Outlaw Star",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Noein: To Your Other Self",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Time of Eve (Eve no Jikan)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Legend of the Galactic Heroes",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Last Exile",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Gankutsuou: The Count of Monte Cristo",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Knights of Sidonia",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Space Battleship Yamato 2199",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Terra Formars",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Akira",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Casshern Sins",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Dimension W",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Armitage III",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Appleseed",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Pale Cocoon",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Eureka Seven",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "The Big O",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "No. 6",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "ID: INVADED",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Blue Gender",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Freedom",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Battle Angel Alita (Gunnm)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Robotics;Notes",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Higashi no Eden (Eden of the East)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Solty Rei",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Voices of a Distant Star (Hoshi no Koe)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Black Bullet",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Astra Lost in Space (Kanata no Astra)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Captain Earth",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "The Irregular at Magic High School (Mahouka Koukou no Rettousei)",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Bubblegum Crisis",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Nausicaä of the Valley of the Wind",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Freedom",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Gantz",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Plastic Memories",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Blue Submarine No. 6",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Ajin: Demi-Human",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                {
                    animeName: "Log Horizon",
                    imageUrl: "REPLACE_WITH_IMAGE_URL"
                },
                // Add more scifi anime recommendations here
            ],
        };

        const { lastRecommendation } = this;

        if (args.length === 0) {
            const genreList = Object.keys(animeRecommendations).join(', ');
            message.reply(`Please type {prefix} anime genre\nAvailable genres: ${genreList}`);
            return;
        }

        const genre = args[0].toLowerCase();

        if (genre in animeRecommendations) {
            const loadingMessage = await api.sendMessage("Random anime recommendation is loading. Please wait...", event.threadID);
            const recommendations = animeRecommendations[genre];


            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * recommendations.length);
            } while (lastRecommendation[genre] === randomIndex);

            const recommendation = recommendations[randomIndex];
            lastRecommendation[genre] = randomIndex; 

            const imageStream = await global.utils.getStreamFromURL(recommendation.imageUrl);

            const messageObject = {
                body: `Based on the genre '${genre}', I recommend you to watch: ${recommendation.animeName}`,
                attachment: imageStream,
            };


            await api.sendMessage(messageObject, event.threadID, event.messageID);


            await api.unsendMessage(loadingMessage.messageID);
        } else {
            message.reply("Genre not found. Please choose from available genres: shonen, seinen, isekai, scifi.");
        }
    }
};
