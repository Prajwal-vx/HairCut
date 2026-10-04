import { NextResponse } from "next/server";
import { readDatabase, writeDatabase } from "@/lib/db";
import { Hairstyle } from "@/lib/types";

const DEFAULT_HAIRSTYLES: Hairstyle[] = [
  {
    id: "style-1",
    name: "Textured Crop",
    category: "Short Cuts",
    description: "A short, choppy cut with texture on top and tight sides. Versatile and low-fuss for everyday wear.",
    imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80",
    tags: ["textured", "crop", "short", "modern", "popular"],
    maintenanceLevel: "low",
    lengthType: "short",
    bestFor: ["oval", "square", "round"],
    texture: ["straight", "wavy"],
    styleTime: 5,
    trimFrequencyDays: 28,
    popularityScore: 95,
  },
  {
    id: "style-2",
    name: "Low Fade",
    category: "Short Cuts",
    description: "A gradual fade starting low near the ears, giving a clean and polished look with length on top.",
    imageUrl: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80",
    tags: ["fade", "low fade", "clean", "classic", "barber"],
    maintenanceLevel: "medium",
    lengthType: "short",
    bestFor: ["oval", "square", "diamond"],
    texture: ["straight", "wavy", "curly"],
    styleTime: 10,
    trimFrequencyDays: 21,
    popularityScore: 92,
  },
  {
    id: "style-3",
    name: "High Fade",
    category: "Short Cuts",
    description: "Bold contrast between close-cropped sides and full top. Makes a strong style statement.",
    imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80",
    tags: ["fade", "high fade", "bold", "contrast", "barber"],
    maintenanceLevel: "medium",
    lengthType: "short",
    bestFor: ["oval", "heart", "square"],
    texture: ["straight", "wavy", "curly"],
    styleTime: 10,
    trimFrequencyDays: 18,
    popularityScore: 88,
  },
  {
    id: "style-4",
    name: "Taper",
    category: "Short Cuts",
    description: "A classic taper gradually shortens the hair towards the neckline. Timeless and professional.",
    imageUrl: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=600&auto=format&fit=crop&q=80",
    tags: ["taper", "classic", "professional", "clean", "traditional"],
    maintenanceLevel: "low",
    lengthType: "short",
    bestFor: ["oval", "oblong", "square", "round"],
    texture: ["straight", "wavy"],
    styleTime: 5,
    trimFrequencyDays: 28,
    popularityScore: 85,
  },
  {
    id: "style-5",
    name: "Undercut",
    category: "Short Cuts",
    description: "Shaved or very short sides with longer hair on top. Edgy and dramatic with maximum contrast.",
    imageUrl: "https://images.unsplash.com/photo-1534297635766-a262cdcb8ee4?w=600&auto=format&fit=crop&q=80",
    tags: ["undercut", "edgy", "contrast", "modern", "bold"],
    maintenanceLevel: "medium",
    lengthType: "short",
    bestFor: ["oval", "square", "heart"],
    texture: ["straight", "wavy", "curly"],
    styleTime: 15,
    trimFrequencyDays: 21,
    popularityScore: 80,
  },
  {
    id: "style-6",
    name: "Pompadour",
    category: "Short Cuts",
    description: "Volume-swept top with slicked-back sides. Classic retro elegance with a modern twist.",
    imageUrl: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80",
    tags: ["pompadour", "volume", "retro", "classic", "slicked"],
    maintenanceLevel: "high",
    lengthType: "short",
    bestFor: ["oval", "oblong", "square"],
    texture: ["straight", "wavy"],
    styleTime: 20,
    trimFrequencyDays: 21,
    popularityScore: 75,
  },
  {
    id: "style-7",
    name: "Wolf Cut",
    category: "Long Cuts",
    description: "Shaggy layers with a choppy fringe inspired by the 70s. Effortlessly cool and full of movement.",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    tags: ["wolf cut", "shaggy", "layers", "trendy", "70s"],
    maintenanceLevel: "low",
    lengthType: "medium",
    bestFor: ["oval", "round", "heart", "square"],
    texture: ["wavy", "curly"],
    styleTime: 10,
    trimFrequencyDays: 42,
    popularityScore: 90,
  },
  {
    id: "style-8",
    name: "Pixie",
    category: "Short Cuts",
    description: "Cropped close at the back and sides with a little length on top. Feminine, bold, and effortlessly chic.",
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=600&auto=format&fit=crop&q=80",
    tags: ["pixie", "short", "bold", "chic", "feminine"],
    maintenanceLevel: "low",
    lengthType: "very-short",
    bestFor: ["oval", "square", "heart"],
    texture: ["straight", "wavy", "curly"],
    styleTime: 5,
    trimFrequencyDays: 28,
    popularityScore: 78,
  },
  {
    id: "style-9",
    name: "Bob",
    category: "Long Cuts",
    description: "Classic blunt or textured cut sitting at or above the chin. Polished, structured and universally flattering.",
    imageUrl: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=600&auto=format&fit=crop&q=80",
    tags: ["bob", "classic", "structured", "chin-length", "blunt"],
    maintenanceLevel: "medium",
    lengthType: "short",
    bestFor: ["oval", "round", "square", "heart"],
    texture: ["straight", "wavy"],
    styleTime: 10,
    trimFrequencyDays: 35,
    popularityScore: 87,
  },
  {
    id: "style-10",
    name: "Layered",
    category: "Long Cuts",
    description: "Flowing layers that add movement, volume, and dimension to longer hair. Naturally beautiful.",
    imageUrl: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80",
    tags: ["layered", "long", "movement", "volume", "natural"],
    maintenanceLevel: "medium",
    lengthType: "long",
    bestFor: ["oval", "oblong", "round", "heart"],
    texture: ["straight", "wavy", "curly"],
    styleTime: 15,
    trimFrequencyDays: 42,
    popularityScore: 83,
  },
  {
    id: "style-11",
    name: "Curly Natural",
    category: "Long Cuts",
    description: "Embracing and defining natural curl patterns with shape-enhancing cuts. Celebrate your texture.",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
    tags: ["curly", "natural", "afro", "coily", "texture"],
    maintenanceLevel: "medium",
    lengthType: "medium",
    bestFor: ["oval", "round", "heart", "diamond"],
    texture: ["curly", "coily"],
    styleTime: 20,
    trimFrequencyDays: 56,
    popularityScore: 76,
  },
  {
    id: "style-12",
    name: "Buzz Cut",
    category: "Short Cuts",
    description: "Uniformly short all over for a clean, no-fuss look. The ultimate low-maintenance style.",
    imageUrl: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?w=600&auto=format&fit=crop&q=80",
    tags: ["buzz cut", "minimal", "low maintenance", "short", "clean"],
    maintenanceLevel: "low",
    lengthType: "very-short",
    bestFor: ["oval", "square", "diamond"],
    texture: ["straight", "wavy", "curly", "coily"],
    styleTime: 2,
    trimFrequencyDays: 21,
    popularityScore: 70,
  },
];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const query = url.searchParams.get("q")?.toLowerCase().trim();

  const db = readDatabase();
  if (!db.hairstyles) {
    db.hairstyles = [];
    writeDatabase(db);
  }

  // Merge db entries with defaults (db entries take precedence by id)
  const dbIds = new Set(db.hairstyles.map((s) => s.id));
  const merged: Hairstyle[] = [
    ...db.hairstyles,
    ...DEFAULT_HAIRSTYLES.filter((s) => !dbIds.has(s.id)),
  ];

  let results = merged;

  if (category) {
    results = results.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }

  if (query) {
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query)) ||
        s.category.toLowerCase().includes(query)
    );
  }

  // Sort by popularityScore descending
  results = results.sort((a, b) => b.popularityScore - a.popularityScore);

  return NextResponse.json({ hairstyles: results, total: results.length });
}
