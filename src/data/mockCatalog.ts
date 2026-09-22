import { Track, Artist, Album, Playlist } from '../types';

export const ARTISTS: Artist[] = [
  {
    "id": "artist_weeknd",
    "name": "The Weeknd",
    "avatarUrl": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80",
    "bio": "Abel Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer known for his sonic versatility and dark lyricism, boasting over 105 million monthly listeners globally.",
    "monthlyListeners": 108420910,
    "isVerified": true,
    "genres": [
      "R&B",
      "Pop",
      "Synthpop",
      "Alternative R&B"
    ],
    "popularTrackIds": [
      "track_1",
      "track_2",
      "track_3",
      "track_4"
    ],
    "albumIds": [
      "album_1542842760",
      "album_1440870373",
      "album_1505683624",
      "album_1440871397"
    ]
  },
  {
    "id": "artist_taylor",
    "name": "Taylor Swift",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&auto=format&fit=crop&q=80",
    "bio": "14-time Grammy winner Taylor Swift is one of the most influential cultural figures of the 21st century, renowned for narrative songwriting that crosses country, pop, indie folk, and rock.",
    "monthlyListeners": 104230000,
    "isVerified": true,
    "genres": [
      "Pop",
      "Country",
      "Indie Folk",
      "Synth-Pop"
    ],
    "popularTrackIds": [
      "track_5",
      "track_6",
      "track_7",
      "track_8"
    ],
    "albumIds": [
      "album_1468058165",
      "album_1649434004",
      "album_1708308989",
      "album_1524801260"
    ]
  },
  {
    "id": "artist_billie",
    "name": "Billie Eilish",
    "avatarUrl": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&auto=format&fit=crop&q=80",
    "bio": "Academy Award and multiple Grammy Award-winning singer-songwriter known for her whisper-soft vocal intimacy, subversive electropop arrangements, and genre-defying chart-toppers.",
    "monthlyListeners": 98400000,
    "isVerified": true,
    "genres": [
      "Alt-Pop",
      "Electropop",
      "Dark Pop",
      "Indie Pop"
    ],
    "popularTrackIds": [
      "track_9",
      "track_10",
      "track_11",
      "track_12"
    ],
    "albumIds": [
      "album_1739659134",
      "album_1450695723",
      "album_1689238301",
      "album_1584262454"
    ]
  },
  {
    "id": "artist_kendrick",
    "name": "Kendrick Lamar",
    "avatarUrl": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1400&auto=format&fit=crop&q=80",
    "bio": "Pulitzer Prize recipient and 17-time Grammy winner Kendrick Lamar is widely regarded as one of the most influential hip-hop artists of his generation, acclaimed for lyrical depth and technical brilliance.",
    "monthlyListeners": 74200000,
    "isVerified": true,
    "genres": [
      "Hip-Hop",
      "West Coast Rap",
      "Conscious Hip-Hop"
    ],
    "popularTrackIds": [
      "track_13",
      "track_14",
      "track_15",
      "track_16"
    ],
    "albumIds": [
      "album_1781353928",
      "album_1440881722",
      "album_1440903005"
    ]
  },
  {
    "id": "artist_dua",
    "name": "Dua Lipa",
    "avatarUrl": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&auto=format&fit=crop&q=80",
    "bio": "Global pop powerhouse Dua Lipa has redefined modern dance-pop and nu-disco with worldwide anthems including \"Levitating\", \"Don't Start Now\", and \"Houdini\".",
    "monthlyListeners": 76500000,
    "isVerified": true,
    "genres": [
      "Dance Pop",
      "Nu-Disco",
      "Pop",
      "Electropop"
    ],
    "popularTrackIds": [
      "track_17",
      "track_18",
      "track_19",
      "track_20"
    ],
    "albumIds": [
      "album_1538003494",
      "album_1484636581",
      "album_1714502820",
      "album_1689238301"
    ]
  },
  {
    "id": "artist_drake",
    "name": "Drake",
    "avatarUrl": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&auto=format&fit=crop&q=80",
    "bio": "The biggest-selling digital singles artist of all time, Drake effortlessly bridges melodic hip-hop, contemporary R&B, and dancehall rhythms across historic multi-platinum projects.",
    "monthlyListeners": 84000000,
    "isVerified": true,
    "genres": [
      "Hip-Hop",
      "Trap",
      "R&B",
      "Pop Rap"
    ],
    "popularTrackIds": [
      "track_21",
      "track_22",
      "track_23",
      "track_24"
    ],
    "albumIds": [
      "album_1406109769",
      "album_1440841363",
      "album_1440891750"
    ]
  },
  {
    "id": "artist_post",
    "name": "Post Malone",
    "avatarUrl": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1400&auto=format&fit=crop&q=80",
    "bio": "Diamond-certified hitmaker blending hip-hop, pop-rock, and country-folk sensibilities with unforgettable hooks and raw vulnerability.",
    "monthlyListeners": 82100000,
    "isVerified": true,
    "genres": [
      "Pop",
      "Hip-Hop",
      "Pop Rock",
      "Country"
    ],
    "popularTrackIds": [
      "track_25",
      "track_26",
      "track_27"
    ],
    "albumIds": [
      "album_1477880265",
      "album_1445949265",
      "album_1681605994"
    ]
  },
  {
    "id": "artist_bruno",
    "name": "Bruno Mars",
    "avatarUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&auto=format&fit=crop&q=80",
    "bio": "Showman extraordinaire Bruno Mars has earned 15 Grammy Awards, recognized for showstopping funk, R&B, pop, and soul musicianship.",
    "monthlyListeners": 112000000,
    "isVerified": true,
    "genres": [
      "Funk",
      "R&B",
      "Pop",
      "Soul"
    ],
    "popularTrackIds": [
      "track_28",
      "track_29",
      "track_30"
    ],
    "albumIds": [
      "album_943946661",
      "album_1161503945",
      "album_1762656724"
    ]
  },
  {
    "id": "artist_sza",
    "name": "SZA",
    "avatarUrl": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&auto=format&fit=crop&q=80",
    "bio": "Grammy-winning R&B visionary SZA captures modern romance, existential vulnerability, and acoustic soul across critically acclaimed albums like SOS and Ctrl.",
    "monthlyListeners": 68900000,
    "isVerified": true,
    "genres": [
      "Neo-Soul",
      "Contemporary R&B",
      "Pop"
    ],
    "popularTrackIds": [
      "track_31",
      "track_32",
      "track_33"
    ],
    "albumIds": [
      "album_1657869377",
      "album_1658650093",
      "album_1732348411"
    ]
  },
  {
    "id": "artist_coldplay",
    "name": "Coldplay",
    "avatarUrl": "https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1400&auto=format&fit=crop&q=80",
    "bio": "British rock icons Coldplay have filled stadiums worldwide for over two decades with anthems of hope, love, and sweeping orchestral rock.",
    "monthlyListeners": 88000000,
    "isVerified": true,
    "genres": [
      "Alternative Rock",
      "Pop Rock",
      "Britpop"
    ],
    "popularTrackIds": [
      "track_34",
      "track_35",
      "track_36"
    ],
    "albumIds": [
      "album_1122773394",
      "album_1122782080",
      "album_1207120422"
    ]
  },
  {
    "id": "artist_harry",
    "name": "Harry Styles",
    "avatarUrl": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1400&auto=format&fit=crop&q=80",
    "bio": "Grammy Album of the Year recipient Harry Styles delivers sunny 70s-inspired soft rock, shimmering synth-pop, and heartfelt balladry.",
    "monthlyListeners": 52000000,
    "isVerified": true,
    "genres": [
      "Pop Rock",
      "Soft Rock",
      "Synthpop"
    ],
    "popularTrackIds": [
      "track_37",
      "track_38"
    ],
    "albumIds": [
      "album_1615584999",
      "album_1485802965"
    ]
  },
  {
    "id": "artist_olivia",
    "name": "Olivia Rodrigo",
    "avatarUrl": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1400&auto=format&fit=crop&q=80",
    "bio": "Triple Grammy-winner Olivia Rodrigo took the world by storm with raw pop-punk energy, heart-wrenching piano ballads, and sharp coming-of-age lyricism.",
    "monthlyListeners": 58000000,
    "isVerified": true,
    "genres": [
      "Pop Rock",
      "Pop-Punk",
      "Indie Pop",
      "Alternative Pop"
    ],
    "popularTrackIds": [
      "track_39",
      "track_40"
    ],
    "albumIds": [
      "album_1736994853",
      "album_1582277315"
    ]
  },
  {
    "id": "artist_queen",
    "name": "Queen",
    "avatarUrl": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
    "bannerUrl": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1400&auto=format&fit=crop&q=80",
    "bio": "Legendary British rock band fronted by the incomparable Freddie Mercury, boasting timeless masterpieces that forever transformed the history of rock.",
    "monthlyListeners": 50400000,
    "isVerified": true,
    "genres": [
      "Classic Rock",
      "Hard Rock",
      "Glam Rock",
      "Progressive Rock"
    ],
    "popularTrackIds": [
      "track_41",
      "track_42"
    ],
    "albumIds": [
      "album_6781024026",
      "album_6781079346"
    ]
  }
];

export const ALBUMS: Album[] = [
  {
    "id": "album_1542842760",
    "title": "Blinding Lights (Remix) - Single",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2020,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_1"
    ]
  },
  {
    "id": "album_1440870373",
    "title": "Starboy",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2016,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_2"
    ]
  },
  {
    "id": "album_1505683624",
    "title": "After Hours (Deluxe)",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2020,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_3"
    ]
  },
  {
    "id": "album_1440871397",
    "title": "Starboy",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/61/f8/e261f8c1-73db-9a7a-c89e-1068f19970e0/16UMGIM67863.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2016,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_4"
    ]
  },
  {
    "id": "album_1468058165",
    "title": "Lover",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2019,
    "genre": "Pop",
    "trackIds": [
      "track_5"
    ]
  },
  {
    "id": "album_1649434004",
    "title": "Midnights",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3d/01/f2/3d01f2e5-5a08-835f-3d30-d031720b2b80/22UM1IM07364.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2022,
    "genre": "Pop",
    "trackIds": [
      "track_6"
    ]
  },
  {
    "id": "album_1708308989",
    "title": "1989 (Taylor's Version)",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/a6/80/11a680e6-2e48-08fa-5e87-3f18e838d31f/23UM1IM11868.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2023,
    "genre": "Pop",
    "trackIds": [
      "track_7"
    ]
  },
  {
    "id": "album_1524801260",
    "title": "folklore",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ca/f3/67/caf367a5-2cf6-6b2e-a891-97dc57b19f08/20UMGIM64216.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2020,
    "genre": "Alternative",
    "trackIds": [
      "track_8"
    ]
  },
  {
    "id": "album_1739659134",
    "title": "HIT ME HARD AND SOFT",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2024,
    "genre": "Alternative",
    "trackIds": [
      "track_9"
    ]
  },
  {
    "id": "album_1450695723",
    "title": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2019,
    "genre": "Alternative",
    "trackIds": [
      "track_10"
    ]
  },
  {
    "id": "album_1689238301",
    "title": "Barbie The Album",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c0/54/97/c05497aa-c19f-bf4f-de29-71edf30fbefb/075679688767.jpg/600x600bb.jpg",
    "releaseYear": 2023,
    "genre": "Pop",
    "trackIds": [
      "track_11",
      "track_20"
    ]
  },
  {
    "id": "album_1584262454",
    "title": "Happier Than Ever (Edit) - Single",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/d5/0c/53/d50c5343-58d1-9dfa-22ea-b6ea25b6327b/21UMGIM36684.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2021,
    "genre": "Alternative",
    "trackIds": [
      "track_12"
    ]
  },
  {
    "id": "album_1781353928",
    "title": "Not Like Us - Single",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/3a/3f/313a3fbc-bb8f-80c7-b5a2-e226869a38cd/24UMGIM51924.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2024,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_13"
    ]
  },
  {
    "id": "album_1440881722",
    "title": "DAMN.",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ab/16/ef/ab16efe9-e7f1-66ec-021c-5592a23f0f9e/17UMGIM88793.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2017,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_14",
      "track_16"
    ]
  },
  {
    "id": "album_1440903005",
    "title": "Black Panther: The Album",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4d/16/55/4d165549-3d11-86dc-fcbf-be7fe0bcadfb/18UMGIM00002.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2018,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_15"
    ]
  },
  {
    "id": "album_1538003494",
    "title": "Future Nostalgia",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg",
    "releaseYear": 2020,
    "genre": "Pop",
    "trackIds": [
      "track_17"
    ]
  },
  {
    "id": "album_1484636581",
    "title": "Don't Start Now - Single",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/ee/66/41ee66fa-f8dd-7e82-155a-3a1b360dc562/190295322175.jpg/600x600bb.jpg",
    "releaseYear": 2019,
    "genre": "Pop",
    "trackIds": [
      "track_18"
    ]
  },
  {
    "id": "album_1714502820",
    "title": "Houdini - Single",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dd/af/ea/ddafeab5-797a-5b6f-7735-f96c537b45e0/5054197894091.jpg/600x600bb.jpg",
    "releaseYear": 2023,
    "genre": "Pop",
    "trackIds": [
      "track_19"
    ]
  },
  {
    "id": "album_1406109769",
    "title": "Scorpion",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/6d/8f/bb6d8f67-6d04-10b5-dd62-eb5809ac54fc/00602567879152.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2018,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_21"
    ]
  },
  {
    "id": "album_1440841363",
    "title": "Views",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2016,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_22",
      "track_23"
    ]
  },
  {
    "id": "album_1440891750",
    "title": "More Life",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/18/9d/b8/189db80b-bfa8-89d1-1514-5fcb7e5cf8f4/00602557611526.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2017,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_24"
    ]
  },
  {
    "id": "album_1477880265",
    "title": "Hollywood's Bleeding",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/1b/1b/7b1b1b0b-7ce2-b223-f9e0-8e36abe51877/19UMGIM78325.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2019,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_25"
    ]
  },
  {
    "id": "album_1445949265",
    "title": "Spider-Man: Into the Spider-Verse (Soundtrack From & Inspired by the Motion Picture)",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2018,
    "genre": "Hip-Hop/Rap",
    "trackIds": [
      "track_26"
    ]
  },
  {
    "id": "album_1681605994",
    "title": "Chemical - Single",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e5/8e/50/e58e5094-0413-c936-1dd3-c905297198a0/23UMGIM38555.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2023,
    "genre": "Pop",
    "trackIds": [
      "track_27"
    ]
  },
  {
    "id": "album_943946661",
    "title": "Uptown Special",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/30/c5/7e30c572-aa47-5f7b-c6fd-42d50cd2c56d/886444959797.jpg/600x600bb.jpg",
    "releaseYear": 2014,
    "genre": "Pop",
    "trackIds": [
      "track_28"
    ]
  },
  {
    "id": "album_1161503945",
    "title": "24K Magic",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e3/47/a0/e347a0cc-87ce-5d05-d560-176c7d48f66e/075679904119.jpg/600x600bb.jpg",
    "releaseYear": 2016,
    "genre": "Pop",
    "trackIds": [
      "track_29"
    ]
  },
  {
    "id": "album_1762656724",
    "title": "Die With A Smile - Single",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2024,
    "genre": "Pop",
    "trackIds": [
      "track_30"
    ]
  },
  {
    "id": "album_1657869377",
    "title": "SOS",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/600x600bb.jpg",
    "releaseYear": 2022,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_31"
    ]
  },
  {
    "id": "album_1658650093",
    "title": "SOS",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/600x600bb.jpg",
    "releaseYear": 2022,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_32"
    ]
  },
  {
    "id": "album_1732348411",
    "title": "Saturn - Single",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0f/90/a8/0f90a856-0447-d846-fa7b-b9c937e72310/196871881180.jpg/600x600bb.jpg",
    "releaseYear": 2024,
    "genre": "R&B/Soul",
    "trackIds": [
      "track_33"
    ]
  },
  {
    "id": "album_1122773394",
    "title": "Viva La Vida or Death and All His Friends",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bb.jpg",
    "releaseYear": 2008,
    "genre": "Alternative",
    "trackIds": [
      "track_34"
    ]
  },
  {
    "id": "album_1122782080",
    "title": "Parachutes",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg",
    "releaseYear": 2000,
    "genre": "Alternative",
    "trackIds": [
      "track_35"
    ]
  },
  {
    "id": "album_1207120422",
    "title": "Memories...Do Not Open",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9d/56/6f/9d566f55-5253-bed6-5c31-df952dae649d/886446379289.jpg/600x600bb.jpg",
    "releaseYear": 2017,
    "genre": "Dance",
    "trackIds": [
      "track_36"
    ]
  },
  {
    "id": "album_1615584999",
    "title": "Harry's House",
    "artistId": "artist_harry",
    "artistName": "Harry Styles",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg",
    "releaseYear": 2022,
    "genre": "Pop",
    "trackIds": [
      "track_37"
    ]
  },
  {
    "id": "album_1485802965",
    "title": "Fine Line",
    "artistId": "artist_harry",
    "artistName": "Harry Styles",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/600x600bb.jpg",
    "releaseYear": 2019,
    "genre": "Pop",
    "trackIds": [
      "track_38"
    ]
  },
  {
    "id": "album_1736994853",
    "title": "GUTS (spilled)",
    "artistId": "artist_olivia",
    "artistName": "Olivia Rodrigo",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/9e/07/089e0799-b405-9e69-b648-e6a19df9879c/24UMGIM30485.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2023,
    "genre": "Pop",
    "trackIds": [
      "track_39"
    ]
  },
  {
    "id": "album_1582277315",
    "title": "SOUR (Video Version)",
    "artistId": "artist_olivia",
    "artistName": "Olivia Rodrigo",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/76/46/48/76464884-0e9c-1951-a3f6-ce02f74c2b19/21UMGIM26093.rgb.jpg/600x600bb.jpg",
    "releaseYear": 2021,
    "genre": "Pop",
    "trackIds": [
      "track_40"
    ]
  },
  {
    "id": "album_6781024026",
    "title": "A Night At The Opera (Deluxe Edition)",
    "artistId": "artist_queen",
    "artistName": "Queen",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/0a/ea/8b0aea60-6f4a-195b-5958-cdf459c2333b/602527644271.jpg/600x600bb.jpg",
    "releaseYear": 1975,
    "genre": "Rock",
    "trackIds": [
      "track_41"
    ]
  },
  {
    "id": "album_6781079346",
    "title": "Jazz (Deluxe Edition)",
    "artistId": "artist_queen",
    "artistName": "Queen",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9e/ae/4a/9eae4a23-130a-4ed7-d590-bfa701f9acaf/602527717685.jpg/600x600bb.jpg",
    "releaseYear": 1978,
    "genre": "Rock",
    "trackIds": [
      "track_42"
    ]
  }
];

export const TRACKS: Track[] = [
  {
    "id": "track_1",
    "title": "Blinding Lights (Remix)",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "albumId": "album_1542842760",
    "albumTitle": "Blinding Lights (Remix) - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F12%2F73%2Fca%2F1273ca46-233a-5331-189b-25ac1d656533%2Fmzaf_976341070785891411.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/12/73/ca/1273ca46-233a-5331-189b-25ac1d656533/mzaf_976341070785891411.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 573370862,
    "releaseYear": 2020,
    "bpm": 128,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Yeah..."
      },
      {
        "time": 3,
        "text": "I've been tryna call"
      },
      {
        "time": 6,
        "text": "I've been on my own for long enough"
      },
      {
        "time": 10,
        "text": "Maybe you can show me how to love, maybe"
      },
      {
        "time": 15,
        "text": "I'm going through withdrawals"
      },
      {
        "time": 19,
        "text": "You don't even have to do too much"
      },
      {
        "time": 23,
        "text": "You can turn me on with just a touch, baby"
      },
      {
        "time": 26,
        "text": "I said, ooh, I'm blinded by the lights!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_2",
    "title": "Starboy (feat. Daft Punk)",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "albumId": "album_1440870373",
    "albumTitle": "Starboy",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b5/92/bb/b592bb72-52e3-e756-9b26-9f56d08f47ab/16UMGIM67864.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F11%2F71%2Fd6%2F1171d6ad-3c96-e027-2af6-58028426588c%2Fmzaf_15137631797407745471.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/11/71/d6/1171d6ad-3c96-e027-2af6-58028426588c/mzaf_15137631797407745471.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 613552355,
    "releaseYear": 2016,
    "bpm": 115,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "I'm tryna put you in the worst mood, ah"
      },
      {
        "time": 4,
        "text": "P1 cleaner than your church shoes, ah"
      },
      {
        "time": 8,
        "text": "Milli point two just to hurt you, ah"
      },
      {
        "time": 12,
        "text": "All red Lamb' just to tease you, ah"
      },
      {
        "time": 16,
        "text": "None of these toys on lease too, ah"
      },
      {
        "time": 20,
        "text": "Look what you've done..."
      },
      {
        "time": 24,
        "text": "I'm a motherfuckin' starboy!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_3",
    "title": "Save Your Tears",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "albumId": "album_1505683624",
    "albumTitle": "After Hours (Deluxe)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/83/3a/f7/833af71b-2e0c-3303-24f5-8f5c546c073b/20UMGIM21167.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F8b%2F38%2F17%2F8b3817e4-c0e9-7e02-2654-3e2ecee93603%2Fmzaf_18415642125637540903.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8b/38/17/8b3817e4-c0e9-7e02-2654-3e2ecee93603/mzaf_18415642125637540903.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 564062793,
    "releaseYear": 2020,
    "bpm": 121,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Ooh, na na, yeah"
      },
      {
        "time": 4,
        "text": "I saw you dancing in a crowded room"
      },
      {
        "time": 8,
        "text": "You look so happy when I'm not with you"
      },
      {
        "time": 13,
        "text": "But then you saw me, caught you by surprise"
      },
      {
        "time": 18,
        "text": "A single teardrop falling from your eye"
      },
      {
        "time": 23,
        "text": "I don't know why I run away..."
      },
      {
        "time": 27,
        "text": "Save your tears for another day!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_4",
    "title": "Die For You",
    "artistId": "artist_weeknd",
    "artistName": "The Weeknd",
    "albumId": "album_1440871397",
    "albumTitle": "Starboy",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/e2/61/f8/e261f8c1-73db-9a7a-c89e-1068f19970e0/16UMGIM67863.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F50%2F50%2F1a%2F50501a86-bd74-e90d-8a56-68c9b5e6e7d6%2Fmzaf_4588197682084244913.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/50/1a/50501a86-bd74-e90d-8a56-68c9b5e6e7d6/mzaf_4588197682084244913.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 1007024330,
    "releaseYear": 2016,
    "bpm": 109,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Die For You ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_5",
    "title": "Cruel Summer",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "albumId": "album_1468058165",
    "albumTitle": "Lover",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F44%2Faf%2F81%2F44af8168-9609-1b85-5048-ada08dceacf3%2Fmzaf_1341699644335558812.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/44/af/81/44af8168-9609-1b85-5048-ada08dceacf3/mzaf_1341699644335558812.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 719410858,
    "releaseYear": 2019,
    "bpm": 107,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Fever dream high in the quiet of the night"
      },
      {
        "time": 4,
        "text": "You know that I caught it"
      },
      {
        "time": 8,
        "text": "Bad, bad boy, shiny toy with a price"
      },
      {
        "time": 12,
        "text": "You know that I bought it"
      },
      {
        "time": 16,
        "text": "Killing me slow, out the window"
      },
      {
        "time": 20,
        "text": "I'm always waiting for you to be waiting below"
      },
      {
        "time": 24,
        "text": "And it's new, the shape of your body"
      },
      {
        "time": 27,
        "text": "It's blue, the feeling I've got..."
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_6",
    "title": "Anti-Hero",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "albumId": "album_1649434004",
    "albumTitle": "Midnights",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/3d/01/f2/3d01f2e5-5a08-835f-3d30-d031720b2b80/22UM1IM07364.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F1d%2F56%2F2a%2F1d562a07-dc5f-a9c0-1f36-2051a8c14eb7%2Fmzaf_7214829135431340590.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/1d/56/2a/1d562a07-dc5f-a9c0-1f36-2051a8c14eb7/mzaf_7214829135431340590.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 632433806,
    "releaseYear": 2022,
    "bpm": 120,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "I have this thing where I get older, but just never wiser"
      },
      {
        "time": 5,
        "text": "Midnights become my afternoons"
      },
      {
        "time": 9,
        "text": "When my depression works the graveyard shift"
      },
      {
        "time": 14,
        "text": "All of the people I've ghosted stand there in the room"
      },
      {
        "time": 19,
        "text": "It's me, hi, I'm the problem, it's me"
      },
      {
        "time": 24,
        "text": "At teatime, everybody agrees"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_7",
    "title": "Blank Space (Taylor's Version)",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "albumId": "album_1708308989",
    "albumTitle": "1989 (Taylor's Version)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/a6/80/11a680e6-2e48-08fa-5e87-3f18e838d31f/23UM1IM11868.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Ff1%2Fdd%2F3a%2Ff1dd3add-0fc5-2e35-3460-923fb707f21e%2Fmzaf_7924539200493199372.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f1/dd/3a/f1dd3add-0fc5-2e35-3460-923fb707f21e/mzaf_7924539200493199372.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 989624733,
    "releaseYear": 2023,
    "bpm": 139,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Nice to meet you, where you been?"
      },
      {
        "time": 4,
        "text": "I could show you incredible things"
      },
      {
        "time": 8,
        "text": "Magic, madness, heaven, sin"
      },
      {
        "time": 11,
        "text": "Saw you there and I thought: 'Oh my God, look at that face!'"
      },
      {
        "time": 16,
        "text": "'You look like my next mistake'"
      },
      {
        "time": 20,
        "text": "'Love's a game, wanna play?'"
      },
      {
        "time": 24,
        "text": "Cause darling I'm a nightmare dressed like a daydream!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_8",
    "title": "cardigan",
    "artistId": "artist_taylor",
    "artistName": "Taylor Swift",
    "albumId": "album_1524801260",
    "albumTitle": "folklore",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/ca/f3/67/caf367a5-2cf6-6b2e-a891-97dc57b19f08/20UMGIM64216.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F00%2Fb3%2Ff2%2F00b3f2a0-3228-b65f-7189-91eb26f5adf6%2Fmzaf_3535055549125623460.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/00/b3/f2/00b3f2a0-3228-b65f-7189-91eb26f5adf6/mzaf_3535055549125623460.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 761436768,
    "releaseYear": 2020,
    "bpm": 107,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ cardigan ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_9",
    "title": "BIRDS OF A FEATHER",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "albumId": "album_1739659134",
    "albumTitle": "HIT ME HARD AND SOFT",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F34%2F31%2Fd3%2F3431d34e-847f-5d66-df83-0bce688d997e%2Fmzaf_18106743962423782018.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/34/31/d3/3431d34e-847f-5d66-df83-0bce688d997e/mzaf_18106743962423782018.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 852883510,
    "releaseYear": 2024,
    "bpm": 122,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "I want you to stay"
      },
      {
        "time": 4,
        "text": "Till I'm in the grave"
      },
      {
        "time": 8,
        "text": "Till I rot away, dead and buried"
      },
      {
        "time": 13,
        "text": "Till I'm in the casket you carry"
      },
      {
        "time": 17,
        "text": "If you go, I'm goin' too, uh"
      },
      {
        "time": 21,
        "text": "'Cause it was always you, alright"
      },
      {
        "time": 25,
        "text": "Birds of a feather, we should stick together!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_10",
    "title": "bad guy",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "albumId": "album_1450695723",
    "albumTitle": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2Fc3%2F87%2F1f%2Fc3871f7e-3260-d615-1c66-5fdca2c3a48f%2Fmzaf_10721331211699880949.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c3/87/1f/c3871f7e-3260-d615-1c66-5fdca2c3a48f/mzaf_10721331211699880949.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 617332968,
    "releaseYear": 2019,
    "bpm": 121,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "White shirt now red, my bloody nose"
      },
      {
        "time": 4,
        "text": "Sleepin', you're on your tippy-toes"
      },
      {
        "time": 8,
        "text": "Creepin' around like no one knows"
      },
      {
        "time": 11,
        "text": "Think you're so criminal"
      },
      {
        "time": 15,
        "text": "Bruises on both my knees for you"
      },
      {
        "time": 19,
        "text": "Don't say thank you or please"
      },
      {
        "time": 23,
        "text": "I do what I want when I'm wanting to"
      },
      {
        "time": 27,
        "text": "So you're a tough guy... duh!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_11",
    "title": "What Was I Made For?",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "albumId": "album_1689238301",
    "albumTitle": "Barbie The Album",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c0/54/97/c05497aa-c19f-bf4f-de29-71edf30fbefb/075679688767.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F16%2F69%2F77%2F16697701-c8c4-6d9c-4491-7423e3fde6e8%2Fmzaf_13139724549993369958.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/16/69/77/16697701-c8c4-6d9c-4491-7423e3fde6e8/mzaf_13139724549993369958.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 442519455,
    "releaseYear": 2023,
    "bpm": 123,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ What Was I Made For? ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_12",
    "title": "Happier Than Ever (Edit)",
    "artistId": "artist_billie",
    "artistName": "Billie Eilish",
    "albumId": "album_1584262454",
    "albumTitle": "Happier Than Ever (Edit) - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/d5/0c/53/d50c5343-58d1-9dfa-22ea-b6ea25b6327b/21UMGIM36684.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview115%2Fv4%2F8c%2F6b%2F20%2F8c6b203a-cadc-25b3-1c91-2a8e77210e31%2Fmzaf_9684961884676177661.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/8c/6b/20/8c6b203a-cadc-25b3-1c91-2a8e77210e31/mzaf_9684961884676177661.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 981221879,
    "releaseYear": 2021,
    "bpm": 107,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Happier Than Ever (Edit) ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_13",
    "title": "Not Like Us",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "albumId": "album_1781353928",
    "albumTitle": "Not Like Us - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/3a/3f/313a3fbc-bb8f-80c7-b5a2-e226869a38cd/24UMGIM51924.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F2d%2Fe0%2Fe8%2F2de0e874-cd0b-e9a9-e876-76be13a86662%2Fmzaf_12385336780649591409.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2d/e0/e8/2de0e874-cd0b-e9a9-e876-76be13a86662/mzaf_12385336780649591409.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 637244105,
    "releaseYear": 2024,
    "bpm": 124,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Psst, I see dead people..."
      },
      {
        "time": 4,
        "text": "Mustard on the beat, ho!"
      },
      {
        "time": 7,
        "text": "Ayy, Mustard on the beat, ho"
      },
      {
        "time": 10,
        "text": "Deebo, any rap nigga, he a free throw"
      },
      {
        "time": 14,
        "text": "Man down, call an amberbulance, tell him, 'Breathe, bro'"
      },
      {
        "time": 18,
        "text": "Nail a nigga to the cross, he walk around like Teezo"
      },
      {
        "time": 22,
        "text": "What's up with these jabroni-ass niggas tryna see Compton?"
      },
      {
        "time": 26,
        "text": "They not like us, they not like us, they not like us!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_14",
    "title": "HUMBLE.",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "albumId": "album_1440881722",
    "albumTitle": "DAMN.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ab/16/ef/ab16efe9-e7f1-66ec-021c-5592a23f0f9e/17UMGIM88793.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F1f%2F2e%2F37%2F1f2e37be-bdd0-d770-6ea4-091011a6aade%2Fmzaf_2360827885900940865.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/2e/37/1f2e37be-bdd0-d770-6ea4-091011a6aade/mzaf_2360827885900940865.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 553241242,
    "releaseYear": 2017,
    "bpm": 130,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Nobody pray for me"
      },
      {
        "time": 4,
        "text": "Even a day for me, way (yeah, yeah!)"
      },
      {
        "time": 8,
        "text": "Ayy, I remember syrup sandwiches and crime allowances"
      },
      {
        "time": 13,
        "text": "Finesse a nigga with some counterfeits, but now I'm countin' this"
      },
      {
        "time": 18,
        "text": "Parmesan where my accountant is"
      },
      {
        "time": 22,
        "text": "My left stroke just went viral!"
      },
      {
        "time": 26,
        "text": "Be humble, sit down, be humble!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_15",
    "title": "All The Stars",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "albumId": "album_1440903005",
    "albumTitle": "Black Panther: The Album",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/4d/16/55/4d165549-3d11-86dc-fcbf-be7fe0bcadfb/18UMGIM00002.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Fea%2F8b%2F2c%2Fea8b2cf4-95f2-b0b3-ffc5-10f4611bf98f%2Fmzaf_6758805407695014001.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ea/8b/2c/ea8b2cf4-95f2-b0b3-ffc5-10f4611bf98f/mzaf_6758805407695014001.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 772728397,
    "releaseYear": 2018,
    "bpm": 138,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ All The Stars ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_16",
    "title": "DNA.",
    "artistId": "artist_kendrick",
    "artistName": "Kendrick Lamar",
    "albumId": "album_1440881722",
    "albumTitle": "DAMN.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/ab/16/ef/ab16efe9-e7f1-66ec-021c-5592a23f0f9e/17UMGIM88793.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F2f%2F9e%2F3f%2F2f9e3fae-1e5f-18df-c762-039e3cc13028%2Fmzaf_8715454916909593560.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2f/9e/3f/2f9e3fae-1e5f-18df-c762-039e3cc13028/mzaf_8715454916909593560.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 1027810409,
    "releaseYear": 2017,
    "bpm": 139,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ DNA. ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_17",
    "title": "Levitating",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "albumId": "album_1538003494",
    "albumTitle": "Future Nostalgia",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/6c/11/d6/6c11d681-aa3a-d59e-4c2e-f77e181026ab/190295092665.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F59%2Fdc%2F4d%2F59dc4dda-93ff-8f1c-c536-f005f6ea6af5%2Fmzaf_3066686759813252385.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/59/dc/4d/59dc4dda-93ff-8f1c-c536-f005f6ea6af5/mzaf_3066686759813252385.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 802323218,
    "releaseYear": 2020,
    "bpm": 133,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "If you wanna run away with me, I know a galaxy"
      },
      {
        "time": 4,
        "text": "And I can take you for a ride"
      },
      {
        "time": 8,
        "text": "I had a premonition that we fell into a rhythm"
      },
      {
        "time": 12,
        "text": "Where the music don't stop for life"
      },
      {
        "time": 16,
        "text": "Glitter in the sky, glitter in my eyes"
      },
      {
        "time": 20,
        "text": "Shining just the way I like"
      },
      {
        "time": 24,
        "text": "You want me, I want you, baby"
      },
      {
        "time": 27,
        "text": "My sugarboo, I'm levitating!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_18",
    "title": "Don't Start Now",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "albumId": "album_1484636581",
    "albumTitle": "Don't Start Now - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/41/ee/66/41ee66fa-f8dd-7e82-155a-3a1b360dc562/190295322175.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F24%2F3d%2F34%2F243d3413-a0fc-b229-f54a-1715ebd3a9ca%2Fmzaf_11578996572221800393.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/24/3d/34/243d3413-a0fc-b229-f54a-1715ebd3a9ca/mzaf_11578996572221800393.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 445111212,
    "releaseYear": 2019,
    "bpm": 106,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Don't Start Now ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_19",
    "title": "Houdini",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "albumId": "album_1714502820",
    "albumTitle": "Houdini - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/dd/af/ea/ddafeab5-797a-5b6f-7735-f96c537b45e0/5054197894091.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F2c%2Fda%2Fb5%2F2cdab5c6-04a8-5231-c697-00101e876479%2Fmzaf_5586859405346659517.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/2c/da/b5/2cdab5c6-04a8-5231-c697-00101e876479/mzaf_5586859405346659517.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 742035606,
    "releaseYear": 2023,
    "bpm": 115,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Houdini ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_20",
    "title": "Dance The Night",
    "artistId": "artist_dua",
    "artistName": "Dua Lipa",
    "albumId": "album_1689238301",
    "albumTitle": "Barbie The Album",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c0/54/97/c05497aa-c19f-bf4f-de29-71edf30fbefb/075679688767.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F9d%2F9f%2F56%2F9d9f566f-abf6-5f10-bcdb-09e14dcace42%2Fmzaf_10277018989080903908.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9d/9f/56/9d9f566f-abf6-5f10-bcdb-09e14dcace42/mzaf_10277018989080903908.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 694312508,
    "releaseYear": 2023,
    "bpm": 135,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Dance The Night ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_21",
    "title": "God's Plan",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "albumId": "album_1406109769",
    "albumTitle": "Scorpion",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/bb/6d/8f/bb6d8f67-6d04-10b5-dd62-eb5809ac54fc/00602567879152.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2Fc6%2F4a%2Fbe%2Fc64abe74-adb4-cff5-005d-0fab3d72a806%2Fmzaf_10276154697254415719.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c6/4a/be/c64abe74-adb4-cff5-005d-0fab3d72a806/mzaf_10276154697254415719.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 798362517,
    "releaseYear": 2018,
    "bpm": 108,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Yeah, they wishin' and wishin' and wishin' and wishin'"
      },
      {
        "time": 4,
        "text": "They wishin' on me, yuh"
      },
      {
        "time": 8,
        "text": "I been movin' calm, don't start no trouble with me"
      },
      {
        "time": 12,
        "text": "Tryna keep it peaceful is a struggle for me"
      },
      {
        "time": 16,
        "text": "Don't pull up at 6 AM to cuddle with me"
      },
      {
        "time": 20,
        "text": "You know how I like it when you lovin' on me"
      },
      {
        "time": 24,
        "text": "God's plan, God's plan..."
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_22",
    "title": "One Dance (feat. Wizkid & Kyla)",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "albumId": "album_1440841363",
    "albumTitle": "Views",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Fcb%2Fee%2Fe3%2Fcbeee354-21e5-2c44-daeb-bcd95e26fe6a%2Fmzaf_5204581280747289469.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/cb/ee/e3/cbeee354-21e5-2c44-daeb-bcd95e26fe6a/mzaf_5204581280747289469.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 742824090,
    "releaseYear": 2016,
    "bpm": 108,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ One Dance ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_23",
    "title": "Hotline Bling",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "albumId": "album_1440841363",
    "albumTitle": "Views",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/f2/0d/8b/f20d8bff-a927-ae98-6784-20a1f51cb23e/16UMGIM27642.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F73%2F56%2F5c%2F73565c27-16d4-1f8a-ec12-77616e3ca05d%2Fmzaf_9178247693050174633.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/73/56/5c/73565c27-16d4-1f8a-ec12-77616e3ca05d/mzaf_9178247693050174633.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 673543553,
    "releaseYear": 2016,
    "bpm": 107,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Hotline Bling ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_24",
    "title": "Passionfruit",
    "artistId": "artist_drake",
    "artistName": "Drake",
    "albumId": "album_1440891750",
    "albumTitle": "More Life",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/18/9d/b8/189db80b-bfa8-89d1-1514-5fcb7e5cf8f4/00602557611526.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F3d%2Fb7%2F73%2F3db773ac-bade-82c1-c570-4a699945d1f6%2Fmzaf_13103071700695768982.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/3d/b7/73/3db773ac-bade-82c1-c570-4a699945d1f6/mzaf_13103071700695768982.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 984378314,
    "releaseYear": 2017,
    "bpm": 115,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Passionfruit ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_25",
    "title": "Circles",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "albumId": "album_1477880265",
    "albumTitle": "Hollywood's Bleeding",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/1b/1b/7b1b1b0b-7ce2-b223-f9e0-8e36abe51877/19UMGIM78325.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Ff9%2Fb1%2Faa%2Ff9b1aaed-3e24-227f-153d-99969f8b8464%2Fmzaf_6272498007975402144.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/f9/b1/aa/f9b1aaed-3e24-227f-153d-99969f8b8464/mzaf_6272498007975402144.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 513546847,
    "releaseYear": 2019,
    "bpm": 116,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Seasons change and our love went cold"
      },
      {
        "time": 5,
        "text": "Feed the flame 'cause we can't let it go"
      },
      {
        "time": 9,
        "text": "Run away, but we're running in circles"
      },
      {
        "time": 14,
        "text": "Run away, run away..."
      },
      {
        "time": 18,
        "text": "I dare you to do something, I'm waiting on you"
      },
      {
        "time": 23,
        "text": "Again and again, falling down again..."
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_26",
    "title": "Sunflower (Spider-Man: Into the Spider-Verse)",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "albumId": "album_1445949265",
    "albumTitle": "Spider-Man: Into the Spider-Verse (Soundtrack From & Inspired by the Motion Picture)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4b/30/2c/4b302cb6-7a14-5464-4e97-0577e9d0be49/18UMGIM82277.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F98%2Ff0%2Fd6%2F98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd%2Fmzaf_4543283896248560946.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/98/f0/d6/98f0d67e-f8bf-762d-cac7-1c6b3b6b35dd/mzaf_4543283896248560946.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Hip-Hop/Rap",
    "playsCount": 746276013,
    "releaseYear": 2018,
    "bpm": 139,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Sunflower (Spider-Man: Into the Spider-Verse) ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_27",
    "title": "Chemical",
    "artistId": "artist_post",
    "artistName": "Post Malone",
    "albumId": "album_1681605994",
    "albumTitle": "Chemical - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/e5/8e/50/e58e5094-0413-c936-1dd3-c905297198a0/23UMGIM38555.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Fa1%2F65%2Ffe%2Fa165fece-1198-ccf4-2ed3-83508c2ffb15%2Fmzaf_448707518512243130.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/a1/65/fe/a165fece-1198-ccf4-2ed3-83508c2ffb15/mzaf_448707518512243130.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 448275911,
    "releaseYear": 2023,
    "bpm": 135,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Chemical ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_28",
    "title": "Uptown Funk (feat. Bruno Mars)",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "albumId": "album_943946661",
    "albumTitle": "Uptown Special",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7e/30/c5/7e30c572-aa47-5f7b-c6fd-42d50cd2c56d/886444959797.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2Fb9%2F96%2F2c%2Fb9962c79-3662-235c-e55d-6c4b41457499%2Fmzaf_18075623088273148288.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/b9/96/2c/b9962c79-3662-235c-e55d-6c4b41457499/mzaf_18075623088273148288.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 1072547363,
    "releaseYear": 2014,
    "bpm": 129,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Doh, doh doh doh, doh doh doh, doh doh"
      },
      {
        "time": 4,
        "text": "This hit, that ice cold, Michelle Pfeiffer, that white gold"
      },
      {
        "time": 9,
        "text": "This one for them hood girls, them good girls, straight masterpieces"
      },
      {
        "time": 14,
        "text": "Stylin', wilin', livin' it up in the city"
      },
      {
        "time": 19,
        "text": "Got Chucks on with Saint Laurent, gotta kiss myself, I'm so pretty!"
      },
      {
        "time": 25,
        "text": "Don't believe me, just watch! (Come on!)"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_29",
    "title": "24K Magic",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "albumId": "album_1161503945",
    "albumTitle": "24K Magic",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e3/47/a0/e347a0cc-87ce-5d05-d560-176c7d48f66e/075679904119.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F45%2Fc4%2Fcb%2F45c4cb28-670f-f1fe-9678-7fa1601bbb5a%2Fmzaf_2006385778979520718.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/45/c4/cb/45c4cb28-670f-f1fe-9678-7fa1601bbb5a/mzaf_2006385778979520718.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 443209588,
    "releaseYear": 2016,
    "bpm": 114,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ 24K Magic ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_30",
    "title": "Die With A Smile",
    "artistId": "artist_bruno",
    "artistName": "Bruno Mars",
    "albumId": "album_1762656724",
    "albumTitle": "Die With A Smile - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/11/ae/f2/11aef294-f57c-bab9-c9fc-529162984e62/24UMGIM85348.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F07%2F6a%2F99%2F076a99ed-b946-431b-6f1f-54fa187ca5bd%2Fmzaf_8102882277995122875.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/07/6a/99/076a99ed-b946-431b-6f1f-54fa187ca5bd/mzaf_8102882277995122875.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 1050936463,
    "releaseYear": 2024,
    "bpm": 122,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Die With A Smile ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_31",
    "title": "Kill Bill",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "albumId": "album_1657869377",
    "albumTitle": "SOS",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F45%2F2b%2Fea%2F452bead6-c7f5-82d4-f5f7-ec876014b4cc%2Fmzaf_2905911853279084717.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/2b/ea/452bead6-c7f5-82d4-f5f7-ec876014b4cc/mzaf_2905911853279084717.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 819594171,
    "releaseYear": 2022,
    "bpm": 100,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "I'm still a fan even though I was salty"
      },
      {
        "time": 4,
        "text": "Hate to see you with some other broad, number one"
      },
      {
        "time": 8,
        "text": "I'm so mature, I got me a therapist to tell me there's other men"
      },
      {
        "time": 13,
        "text": "I don't want none, I just want you"
      },
      {
        "time": 17,
        "text": "If I can't have you, no one should, I might..."
      },
      {
        "time": 22,
        "text": "I might kill my ex, not the best idea"
      },
      {
        "time": 26,
        "text": "His new girlfriend's next, how'd I get here?"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_32",
    "title": "Snooze",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "albumId": "album_1658650093",
    "albumTitle": "SOS",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/62/93/13/6293132e-20ff-67ab-3d1f-96bb6797a6ba/196589564955.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2Fb3%2F9b%2Fca%2Fb39bca57-2627-1aec-77af-cbf551205394%2Fmzaf_4430383240210492712.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b3/9b/ca/b39bca57-2627-1aec-77af-cbf551205394/mzaf_4430383240210492712.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 669834788,
    "releaseYear": 2022,
    "bpm": 109,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Snooze ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_33",
    "title": "Saturn",
    "artistId": "artist_sza",
    "artistName": "SZA",
    "albumId": "album_1732348411",
    "albumTitle": "Saturn - Single",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/0f/90/a8/0f90a856-0447-d846-fa7b-b9c937e72310/196871881180.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F7c%2F28%2Fb3%2F7c28b3ed-9aa9-6454-92c6-e46d20849bed%2Fmzaf_518591709818271733.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/28/b3/7c28b3ed-9aa9-6454-92c6-e46d20849bed/mzaf_518591709818271733.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "R&B/Soul",
    "playsCount": 1197876004,
    "releaseYear": 2024,
    "bpm": 123,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Saturn ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_34",
    "title": "Viva La Vida",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "albumId": "album_1122773394",
    "albumTitle": "Viva La Vida or Death and All His Friends",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2Fb0%2F19%2F60%2Fb0196060-7786-24c0-8c56-8f628fe89f52%2Fmzaf_12479456646715449366.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b0/19/60/b0196060-7786-24c0-8c56-8f628fe89f52/mzaf_12479456646715449366.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 897034258,
    "releaseYear": 2008,
    "bpm": 122,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "I used to rule the world"
      },
      {
        "time": 4,
        "text": "Seas would rise when I gave the word"
      },
      {
        "time": 8,
        "text": "Now in the morning I sleep alone"
      },
      {
        "time": 12,
        "text": "Sweep the streets I used to own"
      },
      {
        "time": 16,
        "text": "I used to roll the dice"
      },
      {
        "time": 20,
        "text": "Feel the fear in my enemy's eyes"
      },
      {
        "time": 24,
        "text": "Listen as the crowd would sing: 'Now the old king is dead!'"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_35",
    "title": "Yellow",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "albumId": "album_1122782080",
    "albumTitle": "Parachutes",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F66%2Ff3%2F1a%2F66f31a76-a6ed-cb4c-f353-23310a7ae9a8%2Fmzaf_10593596652344378873.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/66/f3/1a/66f31a76-a6ed-cb4c-f353-23310a7ae9a8/mzaf_10593596652344378873.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Alternative",
    "playsCount": 430306341,
    "releaseYear": 2000,
    "bpm": 117,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Yellow ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_36",
    "title": "Something Just Like This",
    "artistId": "artist_coldplay",
    "artistName": "Coldplay",
    "albumId": "album_1207120422",
    "albumTitle": "Memories...Do Not Open",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9d/56/6f/9d566f55-5253-bed6-5c31-df952dae649d/886446379289.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F64%2F7f%2F96%2F647f9601-aa94-3599-6c73-0143510b8b92%2Fmzaf_13538528720942742126.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/7f/96/647f9601-aa94-3599-6c73-0143510b8b92/mzaf_13538528720942742126.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Dance",
    "playsCount": 428600544,
    "releaseYear": 2017,
    "bpm": 126,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Something Just Like This ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_37",
    "title": "As It Was",
    "artistId": "artist_harry",
    "artistName": "Harry Styles",
    "albumId": "album_1615584999",
    "albumTitle": "Harry's House",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/2a/19/fb/2a19fb85-2f70-9e44-f2a9-82abe679b88e/886449990061.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F67%2F10%2F16%2F67101606-3869-ca44-6c03-e13d6322cb51%2Fmzaf_1135399237022217274.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/67/10/16/67101606-3869-ca44-6c03-e13d6322cb51/mzaf_1135399237022217274.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 413861813,
    "releaseYear": 2022,
    "bpm": 126,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Hold on, Harry, we wanna say goodnight to you!"
      },
      {
        "time": 4,
        "text": "Come on, Harry, we wanna say goodnight to you!"
      },
      {
        "time": 8,
        "text": "Holdin' me back, gravity's holdin' me back"
      },
      {
        "time": 12,
        "text": "I want you to hold out the palm of your hand"
      },
      {
        "time": 16,
        "text": "Why don't we leave it at that?"
      },
      {
        "time": 20,
        "text": "Nothing to say, when everything gets in the way"
      },
      {
        "time": 24,
        "text": "You know it's not the same as it was!"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_38",
    "title": "Watermelon Sugar",
    "artistId": "artist_harry",
    "artistName": "Harry Styles",
    "albumId": "album_1485802965",
    "albumTitle": "Fine Line",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/2b/c4/c9/2bc4c9d4-3bc6-ab13-3f71-df0b89b173de/886448022213.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F25%2F54%2F81%2F255481c0-1ef2-c1bc-f3b3-ea2b1419c1f1%2Fmzaf_5289557126888202047.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/25/54/81/255481c0-1ef2-c1bc-f3b3-ea2b1419c1f1/mzaf_5289557126888202047.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 975224407,
    "releaseYear": 2019,
    "bpm": 127,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Watermelon Sugar ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_39",
    "title": "vampire",
    "artistId": "artist_olivia",
    "artistName": "Olivia Rodrigo",
    "albumId": "album_1736994853",
    "albumTitle": "GUTS (spilled)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/08/9e/07/089e0799-b405-9e69-b648-e6a19df9879c/24UMGIM30485.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F83%2F09%2F5e%2F83095ea1-83bf-ecdc-3b75-358c350fca51%2Fmzaf_15560849688086702972.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/09/5e/83095ea1-83bf-ecdc-3b75-358c350fca51/mzaf_15560849688086702972.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 462873470,
    "releaseYear": 2023,
    "bpm": 113,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ vampire ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_40",
    "title": "good 4 u",
    "artistId": "artist_olivia",
    "artistName": "Olivia Rodrigo",
    "albumId": "album_1582277315",
    "albumTitle": "SOUR (Video Version)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/76/46/48/76464884-0e9c-1951-a3f6-ce02f74c2b19/21UMGIM26093.rgb.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview211%2Fv4%2F9f%2Fbd%2Ff1%2F9fbdf1ce-12d9-7440-1c1c-3fed40567619%2Fmzaf_7303839465958373073.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/9f/bd/f1/9fbdf1ce-12d9-7440-1c1c-3fed40567619/mzaf_7303839465958373073.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Pop",
    "playsCount": 1148189322,
    "releaseYear": 2021,
    "bpm": 139,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ good 4 u ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_41",
    "title": "Bohemian Rhapsody",
    "artistId": "artist_queen",
    "artistName": "Queen",
    "albumId": "album_6781024026",
    "albumTitle": "A Night At The Opera (Deluxe Edition)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/8b/0a/ea/8b0aea60-6f4a-195b-5958-cdf459c2333b/602527644271.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F17%2Ffc%2F1e%2F17fc1eba-946d-84a9-710b-a0e88ea64209%2Fmzaf_3049006317693088799.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/17/fc/1e/17fc1eba-946d-84a9-710b-a0e88ea64209/mzaf_3049006317693088799.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Rock",
    "playsCount": 619448503,
    "releaseYear": 1975,
    "bpm": 127,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "Is this the real life? Is this just fantasy?"
      },
      {
        "time": 6,
        "text": "Caught in a landslide, no escape from reality"
      },
      {
        "time": 12,
        "text": "Open your eyes, look up to the skies and see..."
      },
      {
        "time": 19,
        "text": "I'm just a poor boy, I need no sympathy"
      },
      {
        "time": 24,
        "text": "'Cause I'm easy come, easy go, little high, little low"
      },
      {
        "time": 28,
        "text": "Anyway the wind blows doesn't really matter to me..."
      }
    ],
    "isRealSong": true
  },
  {
    "id": "track_42",
    "title": "Don't Stop Me Now",
    "artistId": "artist_queen",
    "artistName": "Queen",
    "albumId": "album_6781079346",
    "albumTitle": "Jazz (Deluxe Edition)",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/9e/ae/4a/9eae4a23-130a-4ed7-d590-bfa701f9acaf/602527717685.jpg/600x600bb.jpg",
    "audioUrl": "/api/stream/proxy?url=https%3A%2F%2Faudio-ssl.itunes.apple.com%2Fitunes-assets%2FAudioPreview221%2Fv4%2F4b%2Fd2%2F85%2F4bd2852c-81a9-1da0-01df-31b77705830c%2Fmzaf_17036269860840746883.plus.aac.p.m4a",
    "previewUrl": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4b/d2/85/4bd2852c-81a9-1da0-01df-31b77705830c/mzaf_17036269860840746883.plus.aac.p.m4a",
    "durationSeconds": 30,
    "genre": "Rock",
    "playsCount": 780592781,
    "releaseYear": 1978,
    "bpm": 117,
    "audioFileSize": 1048576,
    "lyrics": [
      {
        "time": 0,
        "text": "♪ Don't Stop Me Now ♪"
      },
      {
        "time": 6,
        "text": "High-fidelity real audio playback"
      },
      {
        "time": 15,
        "text": "Feel the rhythm and emotion of the performance"
      },
      {
        "time": 24,
        "text": "♪ (Vocal crescendo & melody) ♪"
      }
    ],
    "isRealSong": true
  }
];

export const PLAYLISTS: Playlist[] = [
  {
    "id": "playlist_1",
    "title": "Today's Top Hits",
    "description": "The biggest global bangers from The Weeknd, Taylor Swift, Kendrick Lamar, Billie Eilish, and Dua Lipa.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_1",
      "track_2",
      "track_3",
      "track_4",
      "track_5",
      "track_6",
      "track_7",
      "track_8",
      "track_9",
      "track_10",
      "track_11",
      "track_12",
      "track_13",
      "track_14",
      "track_15"
    ],
    "createdAt": "2024-01-01"
  },
  {
    "id": "playlist_2",
    "title": "RapCaviar",
    "description": "Heavy hitters from Kendrick Lamar, Drake, and Post Malone with razor-sharp beats.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/31/3a/3f/313a3fbc-bb8f-80c7-b5a2-e226869a38cd/24UMGIM51924.rgb.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_13",
      "track_14",
      "track_15",
      "track_16",
      "track_21",
      "track_22",
      "track_23",
      "track_24",
      "track_25",
      "track_26",
      "track_27"
    ],
    "createdAt": "2024-01-15"
  },
  {
    "id": "playlist_3",
    "title": "Pop Royalty",
    "description": "Pure anthems from Taylor Swift, Dua Lipa, Billie Eilish, Bruno Mars, and Olivia Rodrigo.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/49/3d/ab/493dab54-f920-9043-6181-80993b8116c9/19UMGIM53909.rgb.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_5",
      "track_6",
      "track_7",
      "track_8",
      "track_9",
      "track_10",
      "track_11",
      "track_12",
      "track_17",
      "track_18",
      "track_19",
      "track_20",
      "track_28",
      "track_29",
      "track_30",
      "track_39",
      "track_40"
    ],
    "createdAt": "2024-02-01"
  },
  {
    "id": "playlist_4",
    "title": "All Out 2020s",
    "description": "The defining chart-toppers that shaped the modern music era.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/61/e7/3f/61e73f94-018d-5f50-50ec-8521952bc72e/20UM1IM11629.rgb.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_6",
      "track_7",
      "track_8",
      "track_9",
      "track_10",
      "track_11",
      "track_12",
      "track_13",
      "track_14",
      "track_15",
      "track_16",
      "track_17",
      "track_18",
      "track_19",
      "track_20"
    ],
    "createdAt": "2024-02-14"
  },
  {
    "id": "playlist_5",
    "title": "Rock & Alt Icons",
    "description": "Timeless stadium anthems from Queen, Coldplay, and modern alt-pop masters.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/52/aa/85/52aa851f-15b7-6322-f91f-df84b15b7b19/190295978044.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_34",
      "track_35",
      "track_36",
      "track_37",
      "track_38",
      "track_41",
      "track_42"
    ],
    "createdAt": "2024-03-01"
  },
  {
    "id": "playlist_6",
    "title": "Late Night R&B & Mood",
    "description": "Intoxicating melodies, soulful vocals, and late-night vibes from The Weeknd and SZA.",
    "coverUrl": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/600x600bb.jpg",
    "creatorId": "user_editorial",
    "creatorName": "DOODLE Editorial",
    "isPublic": true,
    "trackIds": [
      "track_1",
      "track_2",
      "track_3",
      "track_4",
      "track_28",
      "track_29",
      "track_30",
      "track_31",
      "track_32",
      "track_33"
    ],
    "createdAt": "2024-03-10"
  }
];

export interface GenreCard {
  id: string;
  name: string;
  color: string;
  coverUrl: string;
}

export const GENRES: GenreCard[] = [
  {
    id: 'genre_pop',
    name: 'Pop',
    color: 'from-pink-600 to-rose-700',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'genre_hiphop',
    name: 'Hip-Hop',
    color: 'from-orange-600 to-amber-700',
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'genre_rnb',
    name: 'R&B / Soul',
    color: 'from-purple-600 to-indigo-800',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'genre_rock',
    name: 'Rock',
    color: 'from-red-600 to-rose-900',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'genre_dance',
    name: 'Dance & EDM',
    color: 'from-cyan-600 to-blue-800',
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'genre_indie',
    name: 'Indie & Alt',
    color: 'from-emerald-600 to-teal-800',
    coverUrl: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=300&auto=format&fit=crop&q=80',
  },
];

