// Mock data for WatchHive Premium Frontend

export const mockUsers = [
  {
    id: "user_1",
    name: "Smit Gopani",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=smit",
    role: "Host",
    isHost: true,
    isTyping: false
  },
  {
    id: "user_2",
    name: "Alice Dev",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
    role: "Co-Host",
    isHost: false,
    isTyping: false
  },
  {
    id: "user_3",
    name: "Bob Streamer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=bob",
    role: "Viewer",
    isHost: false,
    isTyping: false
  },
  {
    id: "user_4",
    name: "Sarah Cinephile",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sarah",
    role: "Viewer",
    isHost: false,
    isTyping: false
  },
  {
    id: "user_5",
    name: "David Gamer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=david",
    role: "Viewer",
    isHost: false,
    isTyping: false
  }
];

export const mockChatMessages = [
  {
    id: "msg_1",
    userId: "user_2",
    userName: "Alice Dev",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
    text: "Welcome to the WatchHive session! 🍿 Popcorn at the ready!",
    timestamp: "12:45 PM",
    isHost: false
  },
  {
    id: "msg_2",
    userId: "user_3",
    userName: "Bob Streamer",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=bob",
    text: "Wow, this sync is super crisp. The UI looks incredible!",
    timestamp: "12:46 PM",
    isHost: false
  },
  {
    id: "msg_3",
    userId: "user_1",
    userName: "Smit Gopani",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=smit",
    text: "Glad you like it! I just added a couple of cool tech videos to the queue.",
    timestamp: "12:47 PM",
    isHost: true
  },
  {
    id: "msg_4",
    userId: "user_4",
    userName: "Sarah Cinephile",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sarah",
    text: "Did you guys see the new trailer? Let's add that next!",
    timestamp: "12:48 PM",
    isHost: false
  }
];

export const mockRecentRooms = [
  {
    id: "room_1",
    name: "Lo-Fi Beats Study Cave 🎧",
    description: "Relax, study, or code to relaxing background lo-fi music.",
    participantsCount: 14,
    maxParticipants: 50,
    currentVideoTitle: "Lofi Hip Hop Radio 🌌 - Beats to Study/Relax to",
    hostName: "Alice Dev",
    hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alice",
    isPrivate: false,
    category: "Music"
  },
  {
    id: "room_2",
    name: "Apple Vision Pro Hype 🕶️",
    description: "Reviewing the specs, reviews and full testing videos.",
    participantsCount: 8,
    maxParticipants: 15,
    currentVideoTitle: "Apple Vision Pro Review: The Movie!",
    hostName: "Smit Gopani",
    hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=smit",
    isPrivate: false,
    category: "Tech"
  },
  {
    id: "room_3",
    name: "Late Night Indie Movie Trailer Marathon 🎬",
    description: "Reacting to upcoming independent films for 2026.",
    participantsCount: 4,
    maxParticipants: 10,
    currentVideoTitle: "Top 10 A24 Sci-Fi Movies You Must Watch",
    hostName: "Sarah Cinephile",
    hostAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sarah",
    isPrivate: true,
    category: "Cinema"
  }
];

export const mockDashboardStats = [
  { label: "Total Watch Time", value: "48h 30m", change: "+12% this week", icon: "Clock" },
  { label: "Rooms Hosted", value: "24", change: "+4 this month", icon: "Tv" },
  { label: "Saved Playlists", value: "9", change: "2 new added", icon: "ListMusic" },
  { label: "Hive Friends", value: "114", change: "+8 requests pending", icon: "Users" }
];

export const mockPlaylists = [
  {
    id: "pl_1",
    name: "Cyberpunk Aesthetic Vibes",
    videosCount: 15,
    updatedAt: "2 days ago",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "pl_2",
    name: "Next.js 15 & React Tutorials",
    videosCount: 8,
    updatedAt: "1 week ago",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "pl_3",
    name: "Space Documentary Marathon",
    videosCount: 12,
    updatedAt: "3 weeks ago",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80"
  }
];

export const mockTestimonials = [
  {
    id: "test_1",
    name: "Marcus Vane",
    username: "@marcusv_codes",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=marcus",
    text: "WatchHive completely redefined how I pair-program with my remote teammates. We stream tutorials, look at docs, and sync perfectly. Highly recommend it! 🚀",
    rating: 5
  },
  {
    id: "test_2",
    name: "Jessica Lopez",
    username: "@jessica_streams",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=jessica",
    text: "The glassmorphic design and dark Discord-style elements look so premium! Movie nights with friends are completely seamless now. The floating emoji reactions are incredibly satisfying.",
    rating: 5
  },
  {
    id: "test_3",
    name: "Alex Thorne",
    username: "@alex_t",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=alex",
    text: "Zero lag, gorgeous UI, and easy custom video queue controls. WatchHive looks like a multi-million funded SaaS out of the box. Absolutely stunning product.",
    rating: 5
  }
];

export const mockFAQs = [
  {
    question: "How does the synchronized video playback work?",
    answer: "WatchHive utilizes highly-optimized local state triggers that sync play, pause, and scrubber timelines across all room participants in real-time. If anyone falls out of sync, they can hit the 'Sync' button to snap back to the exact video millisecond instantly."
  },
  {
    question: "Do my friends need to create an account to watch together?",
    answer: "No, guests can easily join public or private rooms via your shared invite link. They only need to enter a nickname to join the room and chat, though creating an account unlocks profile styling, favorites, and playlist saves."
  },
  {
    question: "Which video platforms does WatchHive support?",
    answer: "Currently, WatchHive is optimized for YouTube videos (including live streams). We are working on integrations for Vimeo, Twitch, and direct MP4/HLS streams in upcoming phases."
  },
  {
    question: "Can I host a completely private watch party?",
    answer: "Absolutely! When creating a room from your dashboard, you can toggle the 'Private Room' setting. This hides your room from the public directory, making it accessible only to users who possess the direct invite link."
  }
];

export const mockQueue = [
  {
    id: "q_1",
    title: "MKBHD - Apple Vision Pro Review: The Movie",
    duration: "29:12",
    addedBy: "Smit Gopani",
    youtubeId: "dtp6b76pMak",
    thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "q_2",
    title: "Lofi Girl - Synthwave Radio 🌌 beats to game/chill to",
    duration: "Live Stream",
    addedBy: "Alice Dev",
    youtubeId: "4xDzrJKXOOY",
    thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "q_3",
    title: "ASAP Science - What Happens If You Stop Sleeping?",
    duration: "10:45",
    addedBy: "Bob Streamer",
    youtubeId: "nNhDkK4BcSw",
    thumbnail: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=400&q=80"
  }
];
