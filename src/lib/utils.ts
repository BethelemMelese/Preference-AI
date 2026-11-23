import { createCn } from "cn/config";

// cn() merges class names and resolves Tailwind conflicts ("p-4 p-6" → "p-6").
// It recognises Tailwind's built-in names, but it has to GUESS custom ones.
// Without this config, "text-label-md text-primary" lost the size class,
// because both look like "text-<something>" and it assumed two colours.
// Registering our DESIGN.md type scale and shadows fixes the guess.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "display-lg-mobile",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label-md",
            "label-sm",
          ],
        },
      ],
      shadow: [{ shadow: ["tier-1", "tier-2"] }],
    },
  },
});
