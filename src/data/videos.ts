export interface Video {
  id: string;
  title: string;
  googleDriveLink: string;
  thumbnail?: string;
  category: string;
  isLatest: boolean;
  isVertical: boolean;
  description?: string;
}

export const videos: Video[] = [
  // Featured Videos (Latest)
  {
    id: "featured-1",
    title: "Featured Edit 1",
    googleDriveLink: "https://drive.google.com/file/d/1JDg8xKFJ6N-Z2hIPwTf2MLnM1wgC9zhK/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured creative edit"
  },
  {
    id: "featured-2",
    title: "Featured Edit 2",
    googleDriveLink: "https://drive.google.com/file/d/1CiRwgpYnsY2GTWzvaWwFtnZZKTtr_Y5R/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured viral content"
  },
  {
    id: "featured-3",
    title: "Featured Edit 3",
    googleDriveLink: "https://drive.google.com/file/d/1p0o_n_FSfIxvJa11iFXxqM--GljKSXC9/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured dynamic edit"
  },
  {
    id: "featured-4",
    title: "Featured Edit 4",
    googleDriveLink: "https://drive.google.com/file/d/1vDF7AsxlQk_lduK5pcoMix7s6gy61MHZ/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured stylish content"
  },
  {
    id: "featured-5",
    title: "Featured Edit 5",
    googleDriveLink: "https://drive.google.com/file/d/1M8gCLXYv8UWV0EaEsmnEYeZCB7DS8Wba/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured trending edit"
  },
  {
    id: "featured-6",
    title: "Featured Edit 6",
    googleDriveLink: "https://drive.google.com/file/d/1clSIymWsqMZjUlS-3Z0Vd-38kz9_3hc8/view",
    category: "Popular Edits",
    isLatest: true,
    isVertical: true,
    description: "Featured creative piece"
  },

  // Anime Edits
  {
    id: "anime-1",
    title: "Anime Edit 1",
    googleDriveLink: "https://drive.google.com/file/d/1zNWeJMVvjSwwXJnCkEmhkjd9lStajSsU/preview",
    category: "Anime Edits",
    isLatest: false,
    isVertical: true,
    description: "Creative anime edit with smooth transitions"
  },
  {
    id: "anime-2",
    title: "Anime Edit 2",
    googleDriveLink: "https://drive.google.com/file/d/1RCTuGKvDZy4ssjWDl5B8DP2X4eEpYkLd/preview",
    category: "Anime Edits",
    isLatest: false,
    isVertical: true,
    description: "Dynamic anime sequence with VFX"
  },
  {
    id: "anime-3",
    title: "Anime Edit 3",
    googleDriveLink: "https://drive.google.com/file/d/16pBNw2_fZ3486JHJ_DKBKdwpBBGUGlBq/preview",
    category: "Anime Edits",
    isLatest: false,
    isVertical: true,
    description: "Stylized anime edit with motion graphics"
  },
  {
    id: "anime-4",
    title: "Anime Edit 4",
    googleDriveLink: "https://drive.google.com/file/d/1Czd84z1fyhG1nvjbgFOJRkGaQD34GHuc/preview",
    category: "Anime Edits",
    isLatest: false,
    isVertical: true,
    description: "Epic anime battle scene edit"
  },
  {
    id: "anime-5",
    title: "Anime Edit 5",
    googleDriveLink: "https://drive.google.com/file/d/1nrWTq1mbYRixB-HOFHElRJg9EjX__r82/preview",
    category: "Anime Edits",
    isLatest: false,
    isVertical: true,
    description: "Cinematic anime edit with effects"
  },

  // Popular Edits
  {
    id: "popular-1",
    title: "Popular Edit 1",
    googleDriveLink: "https://drive.google.com/file/d/1jxU6oArmFJaVp8EIWXHClUUHUEYJ1-qC/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Trending style edit with viral appeal"
  },
  {
    id: "popular-2",
    title: "Popular Edit 2",
    googleDriveLink: "https://drive.google.com/file/d/1g1idcrso4OhSD8Hqg2PuBha7fYKMgojR/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "High-energy popular content edit"
  },
  {
    id: "popular-3",
    title: "Woodl Style Edit",
    googleDriveLink: "https://drive.google.com/file/d/18ZyHfJeZ48_9hYDc7S5OyBQbDGUCoqQz/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Signature Woodl style editing"
  },
  {
    id: "popular-4",
    title: "Popular Edit 4",
    googleDriveLink: "https://drive.google.com/file/d/1K9Qv00URH4kldH87jP4GL10YO6loOSjx/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Viral-worthy short form content"
  },
  {
    id: "popular-5",
    title: "Popular Edit 5",
    googleDriveLink: "https://drive.google.com/file/d/18cpAxEt3RZeI_htpeuhOqFHx0p0n3hU_/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Engaging social media edit"
  },
  {
    id: "popular-6",
    title: "Popular Edit 6",
    googleDriveLink: "https://drive.google.com/file/d/1XEltWOoJVLQAo_Wv6JSlKrGwP49bKfmV/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Creative popular content piece"
  },
  {
    id: "popular-7",
    title: "Popular Edit 7",
    googleDriveLink: "https://drive.google.com/file/d/11zbGlFKpbcbWZl-citdGfo_bhs1Z-tQD/preview",
    category: "Popular Edits",
    isLatest: false,
    isVertical: true,
    description: "Modern style viral edit"
  },

  // Intros
  {
    id: "intro-1",
    title: "Channel Intro",
    googleDriveLink: "https://drive.google.com/file/d/1X2eVzDTPhNIDB_VXPBSjiE7l6MXEuipL/preview",
    category: "Intros",
    isLatest: false,
    isVertical: false,
    description: "Professional channel intro with animation"
  },

  // Logo Animation
  {
    id: "logo-1",
    title: "Logo Animation 1",
    googleDriveLink: "https://drive.google.com/file/d/1X1N0bnhaPAA_T_WUjlzpz7mnxW_7b5WA/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Dynamic logo reveal animation"
  },
  {
    id: "logo-2",
    title: "Logo Animation 2",
    googleDriveLink: "https://drive.google.com/file/d/1sCyrz0AJnMuwtYFLLnhjn16PyctSQe1d/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Corporate logo animation"
  },
  {
    id: "logo-3",
    title: "Logo Animation 3",
    googleDriveLink: "https://drive.google.com/file/d/193vp3ctrs-0kbiTZ0wXtqaBT8oSR9bvI/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Modern logo intro with effects"
  },
  {
    id: "logo-4",
    title: "Logo Animation 4",
    googleDriveLink: "https://drive.google.com/file/d/1ZyvD82e1SswHDV2Q2-w1DKyEcJwKQ_7i/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "3D logo animation reveal"
  },
  {
    id: "logo-5",
    title: "Logo Animation 5",
    googleDriveLink: "https://drive.google.com/file/d/1nDu3KUQJNsQOXAoUQwUfa8r3TEySeeUt/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Sleek logo motion graphics"
  },
  {
    id: "logo-6",
    title: "Logo Animation 6",
    googleDriveLink: "https://drive.google.com/file/d/15Xn6lCnTitK9tiU4CtG-AH0xRkuyPq6v/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Professional brand logo reveal"
  },
  {
    id: "logo-7",
    title: "Logo Animation 7",
    googleDriveLink: "https://drive.google.com/file/d/1rKxdgolp6dY2LSX4g1TCMdsRwGezw_uX/preview",
    category: "Logo Animation",
    isLatest: false,
    isVertical: false,
    description: "Creative logo animation"
  },

  // HeadCam Reels
  {
    id: "headcam-1",
    title: "HeadCam Reel 1",
    googleDriveLink: "https://drive.google.com/file/d/1qcbPZs-5sUz41v7Leh4u8042w__M4CsN/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Dynamic POV headcam edit"
  },
  {
    id: "headcam-2",
    title: "HeadCam Reel 2",
    googleDriveLink: "https://drive.google.com/file/d/1Btw9AAFZaeHZtzUqEBBeHysS6ml86H6w/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Action-packed headcam content"
  },
  {
    id: "headcam-4",
    title: "HeadCam Reel 4",
    googleDriveLink: "https://drive.google.com/file/d/1M1o7nev5prddlGnwLRqZJp4DHpNiRqhC/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "First-person perspective edit"
  },
  {
    id: "headcam-5",
    title: "HeadCam Reel 5",
    googleDriveLink: "https://drive.google.com/file/d/1suuTr2KbVyB7W5Vbqt881UK_P2MGHSpW/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Immersive POV content"
  },
  {
    id: "headcam-6",
    title: "HeadCam Reel 6",
    googleDriveLink: "https://drive.google.com/file/d/1eNw3p6SkeSoUH56puKLLEBi22qVI-jLP/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Engaging headcam footage"
  },
  {
    id: "headcam-7",
    title: "HeadCam Reel 7",
    googleDriveLink: "https://drive.google.com/file/d/1c4wb0eEyKRCMEa0PlSo141sD3siSMUtR/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Creative POV editing"
  },
  {
    id: "headcam-8",
    title: "HeadCam Reel 8",
    googleDriveLink: "https://drive.google.com/file/d/1DIJYd_hF1yxd_5zgiQciiC8i5gN-mvD2/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "High-energy headcam reel"
  },
  {
    id: "headcam-9",
    title: "HeadCam Reel 9",
    googleDriveLink: "https://drive.google.com/file/d/19P6LniPFloUBEmTEuFZTrLjapZTjRJiB/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Action headcam content"
  },
  {
    id: "headcam-10",
    title: "HeadCam Reel 10",
    googleDriveLink: "https://drive.google.com/file/d/125405h7ATHvK9tbZlsQLs9S3SRCrYYry/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "POV adventure edit"
  },
  {
    id: "headcam-11",
    title: "HeadCam Reel 11",
    googleDriveLink: "https://drive.google.com/file/d/13dj9fki73TMiVfE4D6vrGYZLc6nf_BF7/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Dynamic first-person edit"
  },
  {
    id: "headcam-12",
    title: "HeadCam Reel 12",
    googleDriveLink: "https://drive.google.com/file/d/1kQMN21iV0ZWWQFmgu8en_GuG5tBueCgT/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Immersive headcam experience"
  },
  {
    id: "headcam-13",
    title: "HeadCam Reel 13",
    googleDriveLink: "https://drive.google.com/file/d/1NmSic4uaF3FfSIpsq8kprGJCsKK6XXK1/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Fast-paced POV content"
  },
  {
    id: "headcam-14",
    title: "HeadCam Reel 14",
    googleDriveLink: "https://drive.google.com/file/d/1VmGt8K29lVmFmG9S3toIu3WpChi7yfxe/preview",
    category: "HeadCam Reels",
    isLatest: false,
    isVertical: true,
    description: "Cinematic headcam edit"
  },

  // Long Form
  {
    id: "longform-1",
    title: "Long Form Video 1",
    googleDriveLink: "https://drive.google.com/file/d/1XnP8SPnMzPkyue2yiL79eYnNWHc4rG4y/preview",
    category: "Long Form",
    isLatest: false,
    isVertical: false,
    description: "Extended format professional edit"
  },
  {
    id: "longform-2",
    title: "Long Form Video 2",
    googleDriveLink: "https://drive.google.com/file/d/1JTCnfqO-F4HLzhRwkaiG3DJvS4sFsEHD/preview",
    category: "Long Form",
    isLatest: false,
    isVertical: false,
    description: "Long-form storytelling content"
  },

  // Face Less
  {
    id: "faceless-1",
    title: "Faceless Video 1",
    googleDriveLink: "https://drive.google.com/file/d/18UFujiasmkexVlCpUkPhuTlVz18Mc_y1/preview",
    category: "Face Less",
    isLatest: false,
    isVertical: true,
    description: "Faceless content creation"
  },
  {
    id: "faceless-2",
    title: "Faceless Video 2",
    googleDriveLink: "https://drive.google.com/file/d/1hEyUyhygg0HsaLheM8IOsEk_AJvoX2UU/preview",
    category: "Face Less",
    isLatest: false,
    isVertical: true,
    description: "Professional faceless edit"
  }
];

export const categories = ["All", "Anime Edits", "Popular Edits", "HeadCam Reels", "Logo Animation", "Intros", "Long Form", "Face Less"];

// Utility functions
export const getLatestVideos = (source: Video[] = videos) => source.filter(video => video.isLatest);
export const getVideosByCategory = (category: string, source: Video[] = videos) =>
  category === "All" ? source : source.filter(video => video.category === category);

export const getGoogleDriveFileId = (googleDriveLink: string) => {
  const fromPath = googleDriveLink.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  if (fromPath) {
    return fromPath;
  }

  const fromQuery = googleDriveLink.match(/[?&]id=([a-zA-Z0-9-_]+)/)?.[1];
  return fromQuery || null;
};

export const getVideoThumbnailCandidates = (googleDriveLink: string, width = 900) => {
  const fileId = getGoogleDriveFileId(googleDriveLink);
  if (!fileId) {
    return [];
  }

  const safeWidth = Math.max(320, Math.min(width, 1600));

  return [
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w${safeWidth}`,
    `https://lh3.googleusercontent.com/d/${fileId}=w${safeWidth}`,
    `https://drive.google.com/uc?export=view&id=${fileId}`,
  ];
};

export const getVideoThumbnail = (googleDriveLink: string, width = 900) => {
  const candidates = getVideoThumbnailCandidates(googleDriveLink, width);
  return candidates[0] || null;
};