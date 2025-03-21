import { PackageType } from "../components/PackageCard";

export const packages: PackageType[] = [
  {
    id: "highlight",
    title: "THE HIGHLIGHT",
    subtitle: "COLLECTION",
    imageUrl: "/images/investment/highlight-package.jpg",
    features: [
      { text: "4 - 5 Minute Highlight Film" },
      { text: "2 Videographers" },
      { text: "Full Day Coverage" },
    ],
  },
  {
    id: "classic",
    title: "THE CLASSIC",
    subtitle: "COLLECTION",
    imageUrl: "/images/investment/classic-package.jpg",
    features: [
      { text: "6 - 7 Minute Highlight Film" },
      { text: "2 Videographers" },
      { text: "Full Day Coverage" },
      {
        text: "Instagram Teaser",
        note: "(delivered a week after the wedding)",
      },
      { text: "Drone Coverage" },
    ],
  },
  {
    id: "featurette",
    title: "THE FEATURETTE",
    subtitle: "COLLECTION",
    imageUrl: "/images/investment/featurette-package.jpg",
    features: [
      { text: "8 - 9 Minute Highlight Film" },
      { text: "2 Videographers" },
      { text: "Full Day Coverage" },
      {
        text: "Instagram Teaser",
        note: "(delivered a week after the wedding)",
      },
      { text: "Drone Coverage" },
      { text: "Ceremony + Toast Edit" },
    ],
  },
];
