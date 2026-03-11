import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import fs from "fs";
import path from "path";

interface SeedProduct {
  name: string;
  slug: string;
  imagePath?: string;
  category: string;
  price: number;
  stock: number;
  pokemon?: string;
  binderType?: string;
  description?: string;
  featured?: boolean;
  badge?: string;
}

const CHARACTER_DESIGNS: SeedProduct[] = [
  {
    name: "Bulbasaur Love",
    slug: "bulbasaur-love",
    imagePath: "assets/BulbasaurLove/Bulbasaur Love/Bulbasaur Love.png",
    category: "engraved-binder",
    price: 3499,
    stock: 20,
    pokemon: "Bulbasaur",
    binderType: "9-Pocket",
    description:
      "Bulbasaur Love design laser-engraved onto a 9-pocket binder cover. Deep, clean lines on leatherette. Holds up to 360 cards.",
    featured: true,
    badge: "Best Seller",
  },
  {
    name: "Charizard Evolution",
    slug: "charizard-evolution",
    imagePath:
      "assets/CharizardEvolution/Charizard Evolution/Charizard Evolution.png",
    category: "engraved-binder",
    price: 3499,
    stock: 20,
    pokemon: "Charizard",
    binderType: "9-Pocket",
    description:
      "Charizard Evolution design laser-engraved onto a 9-pocket binder cover. xTool precision captures every detail. Holds up to 360 cards.",
    featured: true,
  },
  {
    name: "Charizard Fire",
    slug: "charizard-fire",
    imagePath: "assets/CharizardFire/Charizard Fire/Charizard Fire.png",
    category: "engraved-binder",
    price: 3499,
    stock: 18,
    pokemon: "Charizard",
    binderType: "9-Pocket",
    description:
      "Charizard Fire design laser-engraved onto a 9-pocket binder cover. Bold flames rendered in xTool laser detail. Holds up to 360 cards.",
    featured: true,
    badge: "New",
  },
  {
    name: "Cubone Design",
    slug: "cubone-design",
    imagePath: "assets/CuboneDesign/Cubone Design/Cubone Design.png",
    category: "engraved-binder",
    price: 3499,
    stock: 15,
    pokemon: "Cubone",
    binderType: "9-Pocket",
    description:
      "Cubone design laser-engraved onto a 9-pocket binder cover. Striking detail on leatherette surface. Holds up to 360 cards.",
  },
  {
    name: "Mew Skull",
    slug: "mew-skull",
    imagePath: "assets/MewSkull/Mew Skull/Mew Skull.png",
    category: "engraved-binder",
    price: 3499,
    stock: 12,
    pokemon: "Mew",
    binderType: "9-Pocket",
    description:
      "Mew Skull design laser-engraved onto a 9-pocket binder cover. Unique artistic style with xTool precision. Holds up to 360 cards.",
    badge: "Limited",
  },
  {
    name: "Pikachu Ball",
    slug: "pikachu-ball",
    imagePath: "assets/PikachuBall/Pekachu Ball/Pekachu Ball.png",
    category: "engraved-binder",
    price: 3499,
    stock: 25,
    pokemon: "Pikachu",
    binderType: "9-Pocket",
    description:
      "Pikachu Ball design laser-engraved onto a 9-pocket binder cover. Classic Pikachu artwork with xTool laser accuracy. Holds up to 360 cards.",
    featured: true,
  },
  {
    name: "Pokemon Ghost",
    slug: "pokemon-ghost",
    imagePath: "assets/PokemonGhost/Pokemon Ghost/pokemon ghost.png",
    category: "engraved-binder",
    price: 3499,
    stock: 18,
    pokemon: "Gengar",
    binderType: "9-Pocket",
    description:
      "Ghost-type Pokemon design laser-engraved onto a 9-pocket binder cover. Haunting silhouette with clean lines. Holds up to 360 cards.",
  },
  {
    name: "Pikachu Triple",
    slug: "pika3",
    imagePath: "assets/Pika3/3 PNG.png",
    category: "engraved-binder",
    price: 3499,
    stock: 20,
    pokemon: "Pikachu",
    binderType: "9-Pocket",
    description:
      "Triple Pikachu design laser-engraved onto a 9-pocket binder cover. Three Pikachu poses in xTool laser detail. Holds up to 360 cards.",
  },
  {
    name: "Espeon & Umbreon",
    slug: "espeon-umbreon",
    imagePath: "assets/TransparentPNGEspeonUmbreon.png",
    category: "engraved-binder",
    price: 4999,
    stock: 10,
    pokemon: "Espeon / Umbreon",
    binderType: "Zipper",
    description:
      "Espeon & Umbreon dual design laser-engraved onto a premium zipper binder. Day and night Eeveelutions in stunning detail. Full-zip closure with 20 pages.",
    featured: true,
    badge: "Limited",
  },
];

const VILLAIN_LOGOS: SeedProduct[] = [
  {
    name: "Aether Foundation Logo",
    slug: "aether-foundation-logo",
    imagePath:
      "assets/villainlogos/aether foundation/Aether-Foundation-Symbol.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Aether Foundation",
    binderType: "9-Pocket",
    description:
      "Aether Foundation logo laser-engraved onto a 9-pocket binder cover. Clean, symmetrical design. Holds up to 360 cards.",
  },
  {
    name: "Team Aqua Logo",
    slug: "team-aqua-logo",
    imagePath: "assets/villainlogos/team aqua/team-aqua.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Aqua",
    binderType: "9-Pocket",
    description:
      "Team Aqua logo laser-engraved onto a 9-pocket binder cover. Bold oceanic symbol. Holds up to 360 cards.",
  },
  {
    name: "Team Flare Logo",
    slug: "team-flare-logo",
    imagePath: "assets/villainlogos/team flare/team-flare.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Flare",
    binderType: "9-Pocket",
    description:
      "Team Flare logo laser-engraved onto a 9-pocket binder cover. Fiery emblem in xTool precision. Holds up to 360 cards.",
  },
  {
    name: "Team Galactic Logo",
    slug: "team-galactic-logo",
    imagePath: "assets/villainlogos/team galactic/Team-Galactic.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Galactic",
    binderType: "9-Pocket",
    description:
      "Team Galactic logo laser-engraved onto a 9-pocket binder cover. Cosmic emblem rendered in laser detail. Holds up to 360 cards.",
  },
  {
    name: "Team Magma Logo",
    slug: "team-magma-logo",
    imagePath: "assets/villainlogos/team magma/magma.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Magma",
    binderType: "9-Pocket",
    description:
      "Team Magma logo laser-engraved onto a 9-pocket binder cover. Volcanic symbol in bold relief. Holds up to 360 cards.",
  },
  {
    name: "Team Plasma Logo",
    slug: "team-plasma-logo",
    imagePath: "assets/villainlogos/team plasma/Team-Plasma.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Plasma",
    binderType: "9-Pocket",
    description:
      "Team Plasma logo laser-engraved onto a 9-pocket binder cover. Shield emblem in xTool laser detail. Holds up to 360 cards.",
  },
  {
    name: "Team Rocket Logo",
    slug: "team-rocket-logo",
    imagePath: "assets/villainlogos/team rocket/team-rocket.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 20,
    pokemon: "Team Rocket",
    binderType: "9-Pocket",
    description:
      "The iconic Team Rocket R logo laser-engraved onto a 9-pocket binder cover. Classic villain emblem. Holds up to 360 cards.",
    featured: true,
    badge: "Best Seller",
  },
  {
    name: "Team Skull Logo",
    slug: "team-skull-logo",
    imagePath: "assets/villainlogos/team skull/Team-Skull.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Skull",
    binderType: "9-Pocket",
    description:
      "Team Skull logo laser-engraved onto a 9-pocket binder cover. Edgy skull design with xTool precision. Holds up to 360 cards.",
    badge: "New",
  },
  {
    name: "Team Star Logo",
    slug: "team-star-logo",
    imagePath: "assets/villainlogos/team star/team-star.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Star",
    binderType: "9-Pocket",
    description:
      "Team Star logo laser-engraved onto a 9-pocket binder cover. Bold star emblem. Holds up to 360 cards.",
  },
  {
    name: "Team Yell Logo",
    slug: "team-yell-logo",
    imagePath: "assets/villainlogos/team yell/team-yell.png",
    category: "villain-logo-binder",
    price: 3499,
    stock: 15,
    pokemon: "Team Yell",
    binderType: "9-Pocket",
    description:
      "Team Yell logo laser-engraved onto a 9-pocket binder cover. Punk-inspired emblem. Holds up to 360 cards.",
  },
];

// Generate M23E collection products
const M23E_DESIGNS: SeedProduct[] = Array.from({ length: 21 }, (_, i) => {
  const num = String(i + 1).padStart(2, "0");
  return {
    name: `M23E Design ${num}`,
    slug: `m23e-design-${num}`,
    imagePath: `assets/M23E/PNG/Untitled-1-${num}.png`,
    category: "design-collection",
    price: 3499,
    stock: 10,
    binderType: "9-Pocket",
    description: `M23E collection design #${num} laser-engraved onto a 9-pocket binder cover. Part of the exclusive M23E design series. Holds up to 360 cards.`,
  };
});

// Generate Pokemon numbered designs
const POKEMON_NUMBERED: SeedProduct[] = Array.from({ length: 5 }, (_, i) => ({
  name: `Pokemon Design ${i + 1}`,
  slug: `pokemon-design-${i + 1}`,
  imagePath: `assets/pokemon/PNG/pokemon_${i + 1}.png`,
  category: "design-collection",
  price: 3499,
  stock: 10,
  binderType: "9-Pocket",
  description: `Pokemon collection design #${i + 1} laser-engraved onto a 9-pocket binder cover. Holds up to 360 cards.`,
}));

const SERVICES: SeedProduct[] = [
  {
    name: "Custom Engraving \u2013 Standard",
    slug: "custom-engraving-standard",
    category: "engraving-only",
    price: 1499,
    stock: -1,
    description:
      "Send us your 9-pocket binder and we\u2019ll laser-engrave any Pokemon design onto the cover using our xTool machine. Choose from our design library or provide your own reference art. Turnaround: 5\u20137 business days after binder is received.",
  },
  {
    name: "Custom Engraving \u2013 Premium",
    slug: "custom-engraving-premium",
    category: "engraving-only",
    price: 2499,
    stock: -1,
    description:
      "Full-cover detail engraving on any binder size. Bring your binder in or ship it to us \u2014 we\u2019ll engrave a custom Pokemon design with xTool precision. Ideal for large zipper binders or complex multi-character scenes. Turnaround: 7\u201310 business days.",
  },
];

const ALL_PRODUCTS: SeedProduct[] = [
  ...CHARACTER_DESIGNS,
  ...VILLAIN_LOGOS,
  ...M23E_DESIGNS,
  ...POKEMON_NUMBERED,
  ...SERVICES,
];

async function seed() {
  console.log(`Seeding ${ALL_PRODUCTS.length} products...\n`);

  // Dynamic imports so env vars are loaded before payload.config.ts evaluates
  const { getPayload } = await import("payload");
  const { default: config } = await import("../payload.config");
  const payload = await getPayload({ config });

  let created = 0;
  let skipped = 0;

  for (const product of ALL_PRODUCTS) {
    // Check if product already exists
    const existing = await payload.find({
      collection: "products",
      where: { slug: { equals: product.slug } },
      limit: 1,
    });

    if (existing.docs.length > 0) {
      console.log(`  SKIP  ${product.name} (already exists)`);
      skipped++;
      continue;
    }

    // Upload image to Media collection if provided
    let mediaId: string | number | undefined;
    if (product.imagePath) {
      const filePath = path.resolve(product.imagePath);
      if (!fs.existsSync(filePath)) {
        console.warn(
          `  WARN  Image not found for ${product.name}: ${filePath}`
        );
      } else {
        const fileBuffer = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const media = await payload.create({
          collection: "media",
          data: { alt: product.name },
          file: {
            data: fileBuffer,
            name: fileName,
            mimetype: "image/png",
            size: fileBuffer.length,
          },
        });
        mediaId = media.id;
      }
    }

    // Create product record
    await payload.create({
      collection: "products",
      data: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description:
          product.description ||
          `${product.name} laser-engraved binder cover.`,
        image: mediaId || undefined,
        category: product.category,
        featured: product.featured || false,
        stock: product.stock,
        pokemon: product.pokemon || undefined,
        binderType: product.binderType || undefined,
        badge: product.badge || undefined,
        inStock: true,
      },
    });

    console.log(`  OK    ${product.name}`);
    created++;
  }

  console.log(
    `\nDone! Created: ${created}, Skipped: ${skipped}, Total: ${ALL_PRODUCTS.length}`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
