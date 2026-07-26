import type { MenuItem } from '../types'

// ─────────────────────────────────────────────────────────────
// Dish photography
// ─────────────────────────────────────────────────────────────
// All photo URLs live here so they're trivial to swap for the
// restaurant's own food photography before a client demo.
//
// To use your own images, either:
//   • replace a URL below, or
//   • drop files into `public/menu/` and use "/menu/butter-chicken.jpg", or
//   • edit the "Image URL" field on any item in Admin → Menu Management.
//
// Every photo degrades gracefully: while it loads the card shows a
// shimmer, and if it fails (offline / bad URL) it falls back to a
// gradient tile + emoji. The menu never shows a broken image.
// ─────────────────────────────────────────────────────────────

/** Shared Unsplash transform: square-ish crop, compressed for fast mobile loads. */
const shot = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&h=400&q=70`

const PHOTOS = {
  springRolls: shot('1544025162-d76694265947'),
  paneerTikka: shot('1567188040759-fb8a883dc6d8'),
  chickenWings: shot('1608039755401-742074f0548d'),
  mushroomSoup: shot('1547592166-23ac45744acd'),
  butterChicken: shot('1603894584373-5ac82b2ae398'),
  paneerButterMasala: shot('1631452180519-c014fe946bc7'),
  vegBiryani: shot('1596797038530-2c107229654b'),
  chickenBiryani: shot('1563379091339-03b21ab4a4f8'),
  dalMakhani: shot('1546833999-b9f581a1996d'),
  grilledFish: shot('1519708227418-c8fd9a32b7a2'),
  masalaChai: shot('1571934811356-5cc061b6821f'),
  coldCoffee: shot('1461023058943-07fcbe16d735'),
  limeSoda: shot('1621263764928-df1444c5e859'),
  mangoLassi: shot('1553530666-ba11a7da3888'),
  gulabJamun: shot('1601050690597-df0568f70950'),
  lavaCake: shot('1624353365286-3f8d62daad51'),
  kulfi: shot('1567206563064-6f60f40a2b57'),
}

// ─────────────────────────────────────────────────────────────
// Hardcoded demo menu for Café Spice.
// Used directly in DEMO MODE and as the seed/fallback when a real
// Firebase project is connected (see menuService.ts).
// ─────────────────────────────────────────────────────────────

export const DEMO_MENU: MenuItem[] = [
  // ── Starters ──────────────────────────────────────────────
  {
    id: 'veg-spring-rolls',
    name: 'Veg Spring Rolls',
    description: 'Crispy rolls stuffed with seasoned garden vegetables',
    price: 149,
    category: 'Starters',
    isVeg: true,
    image: PHOTOS.springRolls,
    emoji: '🥟',
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    description: 'Char-grilled cottage cheese in smoky tandoori spices',
    price: 229,
    category: 'Starters',
    isVeg: true,
    image: PHOTOS.paneerTikka,
    emoji: '🧀',
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: 'Juicy wings tossed in a tangy peri-peri glaze',
    price: 279,
    category: 'Starters',
    isVeg: false,
    image: PHOTOS.chickenWings,
    emoji: '🍗',
  },
  {
    id: 'mushroom-soup',
    name: 'Mushroom Soup',
    description: 'Creamy button mushroom soup with herbs',
    price: 129,
    category: 'Starters',
    isVeg: true,
    image: PHOTOS.mushroomSoup,
    emoji: '🍲',
  },

  // ── Main Course ───────────────────────────────────────────
  {
    id: 'butter-chicken',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich tomato-butter gravy',
    price: 349,
    category: 'Main Course',
    isVeg: false,
    image: PHOTOS.butterChicken,
    emoji: '🍛',
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese simmered in creamy makhani sauce',
    price: 299,
    category: 'Main Course',
    isVeg: true,
    image: PHOTOS.paneerButterMasala,
    emoji: '🍲',
  },
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with spiced vegetables',
    price: 249,
    category: 'Main Course',
    isVeg: true,
    image: PHOTOS.vegBiryani,
    emoji: '🍚',
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description: 'Hyderabadi dum biryani with succulent chicken',
    price: 349,
    category: 'Main Course',
    isVeg: false,
    image: PHOTOS.chickenBiryani,
    emoji: '🍗',
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in a velvety cream finish',
    price: 219,
    category: 'Main Course',
    isVeg: true,
    image: PHOTOS.dalMakhani,
    emoji: '🥘',
  },
  {
    id: 'grilled-fish',
    name: 'Grilled Fish',
    description: 'Marinated fish fillet grilled with lemon & herbs',
    price: 399,
    category: 'Main Course',
    isVeg: false,
    image: PHOTOS.grilledFish,
    emoji: '🐟',
  },

  // ── Beverages ─────────────────────────────────────────────
  {
    id: 'masala-chai',
    name: 'Masala Chai',
    description: 'Spiced Indian tea brewed with milk & cardamom',
    price: 49,
    category: 'Beverages',
    isVeg: true,
    image: PHOTOS.masalaChai,
    emoji: '☕',
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    description: 'Thick blended iced coffee topped with cream',
    price: 129,
    category: 'Beverages',
    isVeg: true,
    image: PHOTOS.coldCoffee,
    emoji: '🥤',
  },
  {
    id: 'fresh-lime-soda',
    name: 'Fresh Lime Soda',
    description: 'Zesty lime soda — sweet, salty or mixed',
    price: 79,
    category: 'Beverages',
    isVeg: true,
    image: PHOTOS.limeSoda,
    emoji: '🍋',
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    description: 'Chilled yoghurt smoothie with Alphonso mango',
    price: 99,
    category: 'Beverages',
    isVeg: true,
    image: PHOTOS.mangoLassi,
    emoji: '🥭',
  },

  // ── Desserts ──────────────────────────────────────────────
  {
    id: 'gulab-jamun',
    name: 'Gulab Jamun',
    description: 'Warm milk dumplings soaked in rose syrup',
    price: 89,
    category: 'Desserts',
    isVeg: true,
    image: PHOTOS.gulabJamun,
    emoji: '🍮',
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    description: 'Molten dark chocolate centre with vanilla scoop',
    price: 179,
    category: 'Desserts',
    isVeg: true,
    image: PHOTOS.lavaCake,
    emoji: '🍫',
  },
  {
    id: 'kulfi',
    name: 'Kulfi',
    description: 'Traditional slow-churned Indian ice cream',
    price: 99,
    category: 'Desserts',
    isVeg: true,
    image: PHOTOS.kulfi,
    emoji: '🍦',
  },
]
