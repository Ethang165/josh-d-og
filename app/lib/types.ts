// Shared types for the Josh Dog Kush change-request portal.

export type SectionId = "special" | "gallery" | "seeds" | "offers";

export interface SectionMeta {
  id: SectionId;
  label: string;
  tagline: string;
  /** Short hint shown to the AI assistant so its help is on-topic. */
  aiContext: string;
}

export const SECTIONS: SectionMeta[] = [
  {
    id: "special",
    label: "Special / Any Changes",
    tagline: "Describe any change to the site — text, images, or video.",
    aiContext:
      "A general 'any changes here' request for the website. Could be a tweak to copy, layout, a new page, a bug, etc. Help write a clear, specific description of what should change.",
  },
  {
    id: "gallery",
    label: "Gallery",
    tagline: "Add an image to the gallery with a description.",
    aiContext:
      "Adding a new image to the site's photo gallery. Help write an appealing caption / description for the gallery image.",
  },
  {
    id: "seeds",
    label: "Seeds",
    tagline: "Add seeds with images, a price, and a description.",
    aiContext:
      "Adding a new cannabis seed product listing with one or more product photos, a price, and a description. Help write an enticing, accurate product description for the seed strain.",
  },
  {
    id: "offers",
    label: "Special Offers",
    tagline: "Update the site's special offers — image and description.",
    aiContext:
      "Creating or changing a promotional 'special offer' on the website. Help write a punchy, persuasive offer description.",
  },
];

export interface SubmitResult {
  ok: boolean;
  message: string;
  emailed?: boolean;
}
