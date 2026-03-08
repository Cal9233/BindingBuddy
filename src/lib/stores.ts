// Partner store registry.
// To add a store: give them the URL https://bindingbuddy.com/?ref=<their-id>
// They can print it as a QR code on their counter.

export const stores: Record<string, string> = {
  "cool-cards-phoenix": "Cool Cards Phoenix",
  "pallet-town-comics": "Pallet Town Comics",
  "elite-four-games": "Elite Four Games",
  "trainer-hub": "Trainer Hub",
  "pocket-monsters-shop": "Pocket Monsters Shop",
};

/** Returns the display name for a store ID, or the raw ID if not found. */
export function getStoreName(id: string): string {
  return stores[id] ?? id;
}
