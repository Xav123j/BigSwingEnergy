// Define video types for the song list selector
export interface VideoData {
  id: string;
  title: string;
  artist: string;
  runtime: string;
  mp4: string;
  poster: string;
  youtubeEmbedSrc?: string;
}

// Video data for the song list and player
export const videos: VideoData[] = [
  {
    id: 'sweetItIs',
    title: 'How Sweet It Is (To Be Loved By You)',
    artist: 'James Taylor',
    runtime: '3:35',
    mp4: '/videos/SWEET IT IS.mp4',
    poster: '/videos/posters/SWEET IT IS-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/2Te1oU2Z-xM?si=J7SCt12lHOWD6HUj&controls=0'
  },
  {
    id: 'love',
    title: 'L-O-V-E',
    artist: 'Nat King Cole',
    runtime: '2:33',
    mp4: '/videos/LOVE.mp4',
    poster: '/videos/posters/LOVE-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/hMNo4EgF_B0?si=YHqA_Bd2S4sAH63K&controls=0'
  },
  {
    id: 'ruleTheWorld',
    title: 'Everybody Wants To Rule The World',
    artist: 'Tears For Fears',
    runtime: '4:11',
    mp4: '/videos/RULE THE WORLD .mp4',
    poster: '/videos/posters/RULE THE WORLD -poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/8Ejz3_3zQQQ?si=nLG-0gWhBJKEYibE'
  },
  {
    id: 'flyMeToTheMoon',
    title: 'Fly Me To The Moon',
    artist: 'Frank Sinatra',
    runtime: '2:28',
    mp4: '/videos/FLY ME TO THE MOON.mp4',
    poster: '/videos/posters/FLY ME TO THE MOON-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/5QXxh07uAfU?si=Xye41b6ORgp5-FmM&controls=0'
  },
  {
    id: 'letItBe',
    title: 'LET IT BE',
    artist: 'The Beatles',
    runtime: '3:45',
    mp4: '/videos/LET IT BE.mp4',
    poster: '/videos/posters/LET IT BE-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/K1kVGz5XOhs?si=wsbjWjGaxDNvZaiG'
  },
  {
    id: 'letItSnow',
    title: 'LET IT SNOW',
    artist: 'Seasonal',
    runtime: '2:56',
    mp4: '/videos/LET IT SNOW.mp4',
    poster: '/videos/posters/LET IT SNOW-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/LP2ewrEjUHw?si=sSgyvQXJ-C3K0Y87'
  },
  
  {
    id: 'makeMyDreams',
    title: 'MAKE MY DREAMS',
    artist: 'Hall & Oates',
    runtime: '3:12',
    mp4: '/videos/MAKE MY DREAMS .mp4',
    poster: '/videos/posters/MAKE MY DREAMS -poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/NDif-Vck58E?si=uvHyndX_TyzrMOLN'
  },
  {
    id: 'rockingCrimbo',
    title: 'Rockin\' Around The Xmas Tree',
    artist: 'Brenda Lee',
    runtime: '2:05',
    mp4: '/videos/ROCKING CRIMBO TREE .mp4',
    poster: '/videos/posters/ROCKING CRIMBO TREE -poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/JDVWLeSNGfk?si=NtoRezEW4exl-zgo&controls=0'
  },
  {
    id: 'sway',
    title: 'SWAY',
    artist: 'Dean Martin',
    runtime: '2:41',
    mp4: '/videos/SWAY.mp4',
    poster: '/videos/posters/SWAY-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/Cd6NCDlybtE?si=wqayLGPk-5vfFCQp'
  },
  {
    id: 'theseAreTheDays',
    title: 'THESE ARE THE DAYS',
    artist: 'Van Morrison',
    runtime: '3:58',
    mp4: '/videos/THESE ARE THE DAYS .mp4',
    poster: '/videos/posters/THESE ARE THE DAYS -poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/KyJoaabwMgw?si=OxnFHQBRBhfN3VoE'
  },
  {
    id: 'hallelujahILoveHerSo',
    title: 'Hallelujah, I Love Her So',
    artist: 'Ray Charles',
    runtime: '2:38',
    mp4: '/videos/HALLELUJAH I LOVE HER SO.mp4',
    poster: '/videos/posters/HALLELUJAH I LOVE HER SO-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/cFvZRj4l_20?si=YgmY6ksygNw5ULxZ&controls=0'
  },
  {
    id: 'holdTheLine',
    title: 'Hold The Line',
    artist: 'Toto',
    runtime: '3:56',
    mp4: '/videos/HOLD THE LINE.mp4',
    poster: '/videos/posters/HOLD THE LINE-poster.webp',
    youtubeEmbedSrc: 'https://www.youtube.com/embed/f9PNiNin5Ak?si=iVv7F_AQhawAoqOF&controls=0'
  },
]; 