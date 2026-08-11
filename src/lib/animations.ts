import GravityText from "@/components/text/GravityText";
import CharacterBlur from "@/components/text/CharacterBlur";
import FlipText from "@/components/text/FlipText";
// import your remaining animations here

export const animations = [
  {
    name: "Gravity",
    slug: "gravity",
    description: "Characters fall and settle with physical motion.",
    component: GravityText,
  },
  {
    name: "Character Blur",
    slug: "character-blur",
    description: "Characters emerge from a soft blur.",
    component: CharacterBlur,
  },
  {
    name: "3D Flip",
    slug: "3d-flip",
    description: "Characters rotate into view in 3D.",
    component: FlipText,
  },
];