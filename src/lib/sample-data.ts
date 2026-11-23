// =============================================================================
// SAMPLE DATA (Phase 2 only). Replaced by PostgreSQL in Phase 3.
//
// Every number on the dashboard is CALCULATED from these arrays by
// lib/preferences/stats.ts. Nothing is hard-coded, so when the database
// arrives only the data source changes, not the maths.
// =============================================================================

import type {
  AIReport,
  AISuggestion,
  Category,
  CategorySlug,
  Decision,
  PreferenceItem,
  User,
  UserPreference,
} from "@/types/preferences";

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;

/** ISO date `days` ago (at noon), minus `order` minutes so several decisions
 *  on the same day keep a stable newest-first order. */
function daysAgo(days: number, order = 0): string {
  const date = new Date(Date.now() - days * DAY);
  date.setHours(12, 0, 0, 0);
  return new Date(date.getTime() - order * MINUTE).toISOString();
}

export const sampleUser: User = { id: "user-guest", name: "Elena", email: null };

export const sampleCategories: Category[] = [
  { id: "cat-food", slug: "food-drinks", name: "Food & Drinks", tagline: "Culinary & Taste", description: "Cuisines, tasting notes, dietary styles, coffee rituals, and dining experiences.", sortOrder: 1 },
  { id: "cat-entertainment", slug: "entertainment", name: "Entertainment", tagline: "Screen & Stories", description: "Cinema genres, streaming preferences, narrative styles, games, and live shows.", sortOrder: 2 },
  { id: "cat-hobbies", slug: "hobbies", name: "Hobbies & Passions", tagline: "Creative & Outdoors", description: "Creative arts, craft pursuits, collecting, mindfulness, and outdoor activities.", sortOrder: 3 },
  { id: "cat-lifestyle", slug: "lifestyle", name: "Lifestyle & Wellness", tagline: "Routines & Wellbeing", description: "Daily routines, sleep habits, interior design aesthetics, and wellness practices.", sortOrder: 4 },
  { id: "cat-work", slug: "work-career", name: "Work & Career", tagline: "Productivity & Culture", description: "Collaboration modes, office environments, meeting cadences, and career paths.", sortOrder: 5 },
  { id: "cat-travel", slug: "travel", name: "Travel & Destinations", tagline: "Destinations & Styles", description: "Solo vs group expeditions, lodging styles, urban exploration, and nature escapes.", sortOrder: 6 },
  { id: "cat-technology", slug: "technology", name: "Technology & Tools", tagline: "Tools & Gadgets", description: "Software ecosystems, smart home devices, gadget ergonomics, and digital habits.", sortOrder: 7 },
  { id: "cat-learning", slug: "learning", name: "Learning & Growth", tagline: "Growth & Curiosity", description: "Non-fiction genres, podcast topics, learning formats, and skill building.", sortOrder: 8 },
  { id: "cat-social", slug: "social", name: "Social Activities", tagline: "People & Gatherings", description: "Gathering sizes, networking formats, hosting preferences, and weekend plans.", sortOrder: 9 },
  { id: "cat-creativity", slug: "creativity", name: "Creativity & Expression", tagline: "Making & Expression", description: "Writing formats, design aesthetics, musical expression, and DIY crafting.", sortOrder: 10 },
];

// [name, description] per category. Item ids become "<slug>-<n>".
const ITEMS: Record<CategorySlug, [string, string][]> = {
  "food-drinks": [
    ["Specialty Espresso", "Single-origin micro-lots"],
    ["Fermented Beverages", "Kombucha, kefir, and kvass"],
    ["Street Food Markets", "Casual, fast, and varied"],
    ["Fine Dining Tasting Menus", "Long multi-course chef's menus"],
    ["Spicy Cuisine", "Chili-forward dishes"],
    ["Home Baking", "Bread, pastries, and cakes"],
  ],
  entertainment: [
    ["Documentary Films", "Real stories, deep dives"],
    ["Live Stand-up Comedy", "Small clubs and big stages"],
    ["Strategy Board Games", "Long, thoughtful game nights"],
    ["Reality TV", "Competition and lifestyle shows"],
    ["Narrative Podcasts", "Serialised audio storytelling"],
    ["Music Festivals", "Multi-day outdoor events"],
  ],
  hobbies: [
    ["Analog Film Photography", "Medium format 120mm"],
    ["Gardening", "Herbs, vegetables, and flowers"],
    ["Pottery & Ceramics", "Wheel throwing and glazing"],
    ["Marathon Running", "Long-distance race training"],
    ["Chess", "Online and over-the-board play"],
    ["Birdwatching", "Field guides and early mornings"],
  ],
  lifestyle: [
    ["Early Morning Routines", "Up before sunrise"],
    ["Minimalist Interiors", "Clean, uncluttered spaces"],
    ["Yoga", "Flexibility and breath work"],
    ["Meal Prepping", "Cooking the week ahead"],
    ["Digital Detox Weekends", "Screen-free days"],
    ["Busy City Living", "Dense, lively neighbourhoods"],
  ],
  "work-career": [
    ["Open-Plan Tech Offices", "High-density collaborative spaces"],
    ["Remote Work", "Working from home or anywhere"],
    ["Deep Work Blocks", "Long, uninterrupted focus time"],
    ["Frequent Meetings", "Daily syncs and check-ins"],
    ["Mentoring Others", "Guiding less experienced people"],
    ["Startup Culture", "Fast-paced, small teams"],
  ],
  travel: [
    ["High-Altitude Mountaineering", "Technical alpine expeditions"],
    ["Solo Travel", "Exploring on your own schedule"],
    ["Beach Resorts", "All-inclusive relaxation"],
    ["Nordic Retreats", "Quiet cabins and cold climates"],
    ["Backpacking Hostels", "Budget travel and shared rooms"],
    ["City Breaks", "Short trips to big cities"],
  ],
  technology: [
    ["Smart Home Devices", "Voice assistants and automation"],
    ["Mechanical Keyboards", "Tactile switches and custom builds"],
    ["Open-Source Software", "Community-built tools"],
    ["Fitness Trackers", "Wearables for health data"],
    ["VR Gaming", "Immersive headsets"],
    ["E-readers", "Paper-like digital reading"],
  ],
  learning: [
    ["Non-fiction Books", "History, science, and ideas"],
    ["Online Courses", "Self-paced video learning"],
    ["Language Learning", "Picking up a new language"],
    ["In-person Workshops", "Hands-on group sessions"],
    ["Science Podcasts", "Research explained"],
    ["Museums", "Exhibitions and collections"],
  ],
  social: [
    ["Small Dinner Parties", "A few close friends"],
    ["Large Networking Events", "Meeting many new people"],
    ["Game Nights", "Board and party games with friends"],
    ["Volunteering", "Giving time to a cause"],
    ["Weekend Brunches", "Long, slow late mornings"],
    ["Team Sports", "Playing in a league"],
  ],
  creativity: [
    ["Creative Writing", "Stories, poems, and essays"],
    ["Graphic Design", "Layouts, type, and colour"],
    ["Playing Music", "Learning an instrument"],
    ["DIY Crafting", "Making things by hand"],
    ["Journaling", "Daily reflective writing"],
    ["Digital Illustration", "Drawing on a tablet"],
  ],
};

export const sampleItems: PreferenceItem[] = sampleCategories.flatMap((category) =>
  ITEMS[category.slug].map(([name, description], index) => ({
    id: `${category.slug}-${index + 1}`,
    categoryId: category.id,
    name,
    description,
    source: "SEED" as const,
  })),
);

// [itemId, decision, days ago, explanation?]: newest first.
const DECISIONS: [string, Decision, number, string?][] = [
  ["food-drinks-1", "LIKE", 1, "The ritual of brewing is half the fun."],
  ["travel-1", "DISLIKE", 2],
  ["hobbies-1", "LIKE", 3],
  ["work-career-1", "NOT_SURE", 3, "Depends on how noisy it is."],
  ["travel-2", "LIKE", 4],
  ["work-career-2", "LIKE", 4],
  ["hobbies-2", "LIKE", 5],
  ["work-career-3", "LIKE", 6],
  ["hobbies-3", "NOT_SURE", 6],
  ["work-career-4", "DISLIKE", 7],
  ["work-career-5", "LIKE", 7],
  ["food-drinks-2", "LIKE", 8],
  ["food-drinks-3", "LIKE", 9],
  ["food-drinks-4", "DISLIKE", 9],
  ["food-drinks-5", "NOT_SURE", 10],
  ["entertainment-1", "LIKE", 11],
  ["hobbies-4", "DISLIKE", 12],
  ["entertainment-2", "NOT_SURE", 13],
  ["lifestyle-1", "LIKE", 14],
  ["lifestyle-2", "LIKE", 14],
  ["lifestyle-3", "NOT_SURE", 15],
  ["lifestyle-4", "LIKE", 15],
  ["lifestyle-5", "LIKE", 16],
  ["lifestyle-6", "DISLIKE", 16],
  ["learning-1", "LIKE", 16],
  ["creativity-1", "LIKE", 17],
  ["creativity-2", "LIKE", 17],
  ["creativity-3", "NOT_SURE", 18],
  ["creativity-4", "LIKE", 18],
  ["creativity-5", "LIKE", 19],
  ["creativity-6", "DISLIKE", 19],
];

export const samplePreferences: UserPreference[] = DECISIONS.map(
  ([itemId, decision, days, explanation], index) => {
    const at = daysAgo(days, index);
    return {
      id: `pref-${index + 1}`,
      itemId,
      decision,
      explanation: explanation ?? null,
      createdAt: at,
      updatedAt: at,
    };
  },
);

/** What the AI suggestions endpoint might return in Phase 6. Each one
 *  points at the real decisions it was based on (basedOnItemIds). */
export const sampleSuggestions: AISuggestion[] = [
  {
    id: "sug-1",
    categoryId: "cat-hobbies",
    title: "Darkroom Printing",
    description: "Develop and print your own black-and-white photos by hand.",
    reasoning: "A hands-on next step for someone who likes analog film photography.",
    basedOnItemIds: ["hobbies-1"],
    status: "PENDING",
    createdAt: daysAgo(1),
  },
  {
    id: "sug-2",
    categoryId: "cat-travel",
    title: "Coastal Walking Routes",
    description: "Multi-day, low-intensity walks along quiet coastlines.",
    reasoning:
      "Matches your like of solo travel while staying far from the high-intensity mountaineering you passed on.",
    basedOnItemIds: ["travel-2", "travel-1"],
    status: "PENDING",
    createdAt: daysAgo(1),
  },
  {
    id: "sug-3",
    categoryId: "cat-food",
    title: "Home Fermentation",
    description: "Make your own kombucha, kimchi, or sourdough starter.",
    reasoning: "Builds on your like of fermented beverages and your interest in careful brewing.",
    basedOnItemIds: ["food-drinks-2", "food-drinks-1"],
    status: "PENDING",
    createdAt: daysAgo(1),
  },
  {
    id: "sug-4",
    categoryId: "cat-social",
    title: "Silent Reading Clubs",
    description: "Meet up with others to read quietly together, then chat briefly.",
    reasoning:
      "Social time that suits your preference for focus, and your like of non-fiction books.",
    basedOnItemIds: ["work-career-3", "learning-1"],
    status: "PENDING",
    createdAt: daysAgo(1),
  },
  {
    id: "sug-5",
    categoryId: "cat-food",
    title: "Coffee Cupping Sessions",
    description: "Guided tastings that compare coffees side by side.",
    reasoning: "You liked specialty espresso; cupping explores the same interest in depth.",
    basedOnItemIds: ["food-drinks-1"],
    status: "ACCEPTED",
    createdAt: daysAgo(6),
  },
  {
    id: "sug-6",
    categoryId: "cat-hobbies",
    title: "Trail Running",
    description: "Running on forest and mountain trails.",
    reasoning: "An outdoor activity related to your like of gardening and nature.",
    basedOnItemIds: ["hobbies-2"],
    status: "REJECTED",
    createdAt: daysAgo(6),
  },
];

/** What the report endpoint might return in Phase 7. Wording only
 *  interprets the sample decisions; it never claims what the data
 *  doesn't show. Newest first. */
export const sampleReports: AIReport[] = [
  {
    id: "report-2",
    type: "REPORT",
    basedOnDecisions: 31,
    createdAt: daysAgo(1),
    content: {
      overview:
        "Across 31 decisions in 8 categories, your choices lean toward hands-on, slow-paced activities and focused, independent work. You tend to pass on high-intensity physical challenges and busy, crowded settings.",
      patterns: [
        "Craft and process: you liked specialty espresso, fermented beverages, film photography, and gardening, which all reward patience and attention to detail.",
        "Independent work: remote work, deep work blocks, and mentoring were likes, while frequent meetings was a dislike.",
        "Low intensity over high intensity: you disliked high-altitude mountaineering and marathon running.",
      ],
      connections: [
        "Film photography and solo travel could combine naturally into travel photography.",
        "Specialty espresso and fermented beverages both involve careful brewing and tasting.",
      ],
      recommendations: [
        { title: "Travel photography walks", reason: "Combines two of your likes: film photography and solo travel." },
        { title: "Home fermentation", reason: "Builds on your like of fermented beverages." },
        { title: "Quiet co-working spaces", reason: "Supports deep work without the noise of open-plan offices." },
      ],
      worthExploring: [
        "Pottery & Ceramics: you were not sure. A single beginner class could settle it.",
        "Open-plan offices: you were not sure. A day in a quiet co-working space would make a useful comparison.",
      ],
    },
  },
  {
    id: "report-1",
    type: "REPORT",
    basedOnDecisions: 18,
    createdAt: daysAgo(12),
    content: {
      overview:
        "Based on 18 decisions, you enjoy creative, self-directed activities and calm daily routines. Most of your choices so far come from Lifestyle and Creativity.",
      patterns: [
        "Creative making: creative writing, graphic design, DIY crafting, and journaling were all likes.",
        "Calm routines: early mornings, minimalist interiors, and meal prepping were likes.",
      ],
      connections: ["Journaling and early morning routines often pair well as a daily habit."],
      recommendations: [
        { title: "Morning pages", reason: "Connects your likes of journaling and early routines." },
      ],
      worthExploring: ["Food & Drinks and Work & Career have no decisions yet."],
    },
  },
];
