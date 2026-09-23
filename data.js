const products = [
  {
    id: 1,
    name: "Classic Ring",
    category: "rings",
    material: "gold",
    karat: 18,
    weight: 3.2,
    price: 3200,
    discount: 25,
    salePrice: 2400,
    image: "grid1.jpeg",
    sizes: [7, 8, 9, 10],
    description: "A classic 18K gold ring with a simple, elegant design for everyday wear."
  },
  {
    id: 2,
    name: "Diamond Ring",
    category: "rings",
    material: "gold",
    karat: 21,
    weight: 4.1,
    price: 6500,
    discount: 20,
    salePrice: 5200,
    image: "grid2.jpeg",
    sizes: [7, 8, 9, 10, 11],
    description: "A 21K gold ring set with a diamond, perfect for special occasions."
  },
  {
    id: 3,
    name: "Gold Necklace",
    category: "necklaces",
    material: "gold",
    karat: 21,
    weight: 8.5,
    price: 4800,
    discount: 25,
    salePrice: 3600,
    image: "grid3.jpeg",
    sizes: [],
    description: "A 21K gold necklace with a classic design that shines on any occasion."
  },
  {
    id: 4,
    name: "Silver Bracelet",
    category: "bracelets",
    material: "silver",
    karat: null,
    weight: 6.0,
    price: 2800,
    discount: 25,
    salePrice: 2100,
    image: "grid4.jpeg",
    sizes: ["S", "M", "L"],
    description: "An elegant silver bracelet, light and comfortable for everyday wear."
  },
  {
    id: 5,
    name: "Gold Earrings",
    category: "earrings",
    material: "gold",
    karat: 18,
    weight: 2.4,
    price: 3500,
    discount: 20,
    salePrice: 2800,
    image: "grid5.jpeg",
    sizes: [],
    description: "18K gold earrings with a light, elegant design."
  },
  {
    id: 6,
    name: "Royal Ring",
    category: "rings",
    material: "gold",
    karat: 21,
    weight: 3.8,
    price: 4200,
    discount: 25,
    salePrice: 3150,
    image: "grid1.jpeg",
    sizes: [7, 8, 9, 10],
    description: "A luxurious 21K gold Royal ring, great as a gift or for special occasions."
  },
  {
    id: 7,
    name: "Luxury Ring",
    category: "rings",
    material: "gold",
    karat: 24,
    weight: 5.0,
    price: 5800,
    discount: 25,
    salePrice: 4350,
    image: "grid2.jpeg",
    sizes: [8, 9, 10, 11],
    description: "A luxury 24K ring, a standout piece for pure gold lovers."
  },
  {
    id: 8,
    name: "Pearl Necklace",
    category: "necklaces",
    material: "silver",
    karat: null,
    weight: 7.2,
    price: 4000,
    discount: 25,
    salePrice: 3000,
    image: "grid3.jpeg",
    sizes: [],
    description: "A pearl necklace on a silver chain, a refined and understated look."
  },
  {
    id: 9,
    name: "Silver Chain",
    category: "necklaces",
    material: "silver",
    karat: null,
    weight: 5.5,
    price: 2200,
    discount: 20,
    salePrice: 1760,
    image: "grid4.jpeg",
    sizes: [],
    description: "A simple silver chain that suits every everyday look."
  },
  {
    id: 10,
    name: "Gold Bracelet",
    category: "bracelets",
    material: "gold",
    karat: 18,
    weight: 6.8,
    price: 4500,
    discount: 25,
    salePrice: 3375,
    image: "grid5.jpeg",
    sizes: ["S", "M", "L"],
    description: "An 18K gold bracelet with a modern design that suits every age."
  }
];

const pricePerGram = {
  gold: { 18: 550, 21: 620, 24: 700 },
  silver: { base: 45 }
};

const makingFee = 300;