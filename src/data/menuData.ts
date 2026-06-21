import type { MenuItem } from '../types'

// ─────────────────────────────────────────────────────────────
// Hardcoded demo menu for Café Spice.
// Used directly in DEMO MODE and seeded into Firestore on first run
// when a real Firebase project is connected (see menuService.ts).
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
    emoji: '🥟',
  },
  {
    id: 'paneer-tikka',
    name: 'Paneer Tikka',
    description: 'Char-grilled cottage cheese in smoky tandoori spices',
    price: 229,
    category: 'Starters',
    isVeg: true,
    emoji: '🧀',
  },
  {
    id: 'chicken-wings',
    name: 'Chicken Wings',
    description: 'Juicy wings tossed in a tangy peri-peri glaze',
    price: 279,
    category: 'Starters',
    isVeg: false,
    emoji: '🍗',
  },
  {
    id: 'mushroom-soup',
    name: 'Mushroom Soup',
    description: 'Creamy button mushroom soup with herbs',
    price: 129,
    category: 'Starters',
    isVeg: true,
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
    emoji: '🍛',
  },
  {
    id: 'paneer-butter-masala',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese simmered in creamy makhani sauce',
    price: 299,
    category: 'Main Course',
    isVeg: true,
    emoji: '🍲',
  },
  {
    id: 'veg-biryani',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with spiced vegetables',
    price: 249,
    category: 'Main Course',
    isVeg: true,
    emoji: '🍚',
  },
  {
    id: 'chicken-biryani',
    name: 'Chicken Biryani',
    description: 'Hyderabadi dum biryani with succulent chicken',
    price: 349,
    category: 'Main Course',
    isVeg: false,
    emoji: '🍗',
  },
  {
    id: 'dal-makhani',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in a velvety cream finish',
    price: 219,
    category: 'Main Course',
    isVeg: true,
    emoji: '🥘',
  },
  {
    id: 'grilled-fish',
    name: 'Grilled Fish',
    description: 'Marinated fish fillet grilled with lemon & herbs',
    price: 399,
    category: 'Main Course',
    isVeg: false,
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
    emoji: '☕',
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee',
    description: 'Thick blended iced coffee topped with cream',
    price: 129,
    category: 'Beverages',
    isVeg: true,
    emoji: '🥤',
  },
  {
    id: 'fresh-lime-soda',
    name: 'Fresh Lime Soda',
    description: 'Zesty lime soda — sweet, salty or mixed',
    price: 79,
    category: 'Beverages',
    isVeg: true,
    emoji: '🍋',
  },
  {
    id: 'mango-lassi',
    name: 'Mango Lassi',
    description: 'Chilled yoghurt smoothie with Alphonso mango',
    price: 99,
    category: 'Beverages',
    isVeg: true,
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
    emoji: '🍮',
  },
  {
    id: 'chocolate-lava-cake',
    name: 'Chocolate Lava Cake',
    description: 'Molten dark chocolate centre with vanilla scoop',
    price: 179,
    category: 'Desserts',
    isVeg: true,
    emoji: '🍫',
  },
  {
    id: 'kulfi',
    name: 'Kulfi',
    description: 'Traditional slow-churned Indian ice cream',
    price: 99,
    category: 'Desserts',
    isVeg: true,
    emoji: '🍦',
  },
]
