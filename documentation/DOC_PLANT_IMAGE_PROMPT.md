# Plant Image Generation Prompt

Use this prompt to generate consistent, garden-themed plant images that match the GrowFarm app theme. The prompt enforces **rules of thirds** composition, a **fixed background**, and **consistent margins** so images remain visually coherent across the app.

**Format:** Square (1:1). Margins: 25% on left and right (each side), 5% top and bottom—subject confined to the central 50% width × 90% height. The bottom of the image shows a dirt patch where the plant emerges.

---

## Theme Colour Palette (GrowFarm)

Reference these hex values for colour accuracy:

| Token | Hex | Description |
|-------|-----|-------------|
| Primary | `#A4D397` | Soft sage green |
| On-primary | `#0F380C` | Deep forest green |
| Secondary | `#BBCCB2` | Muted sage grey-green |
| Background dark | `#11140F` | Very dark, almost black |
| Background paper | `#191D17` | Slightly lighter dark surface |
| Gradient start | `#275021` | Dark forest green |
| Gradient end | `#A4D397` | Soft sage green |
| Earth | `#B5754A` | Warm terracotta/brown |
| Plant | `#54B54A` | Fresh leaf green |
| Grain | `#E8B923` | Warm golden yellow |
| Water | `#4A8AB5` | Soft blue-grey |
| Text/cream | `#E1E4DA` | Off-white, cream |
| Divider | `#42493F` | Muted grey-green |

---

## Master Image Prompt (Copy-Paste Ready)

```
A stylistic garden-themed illustration of a single plant, botanical art style. 

FORMAT:
- Square image (1:1 aspect ratio).
- 25% margin on left and right sides (each)—background gradient only, no subject.
- 5% margin on top and bottom—background gradient only, no subject.
- Plant subject confined to the central 50% width × 90% height area.

COMPOSITION (rules of thirds within the content area):
- Place the main subject (plant stem, leaves, or focal bloom) at one of the four intersection points of the rule of thirds grid (e.g. lower-right or upper-left third).
- Leave negative space in the opposite two-thirds for visual balance.
- Vertical orientation preferred: plant rising from lower third into upper frame.

BACKGROUND (fixed, identical every time):
- Bottom of image: a dirt patch (soil/earth) in #B5754A, #0F380C—where the plant emerges from.
- Above the dirt: solid gradient from #11140F (bottom) to #191D17 (top).
- Subtle, soft vignette at edges.
- No other objects, textures, or patterns—only the dirt patch and gradient.
- Slight atmospheric haze in #42493F at the very edges.

COLOUR PALETTE (strict):
- Plant foliage: #54B54A, #A4D397, #275021.
- Stems/soil accents: #B5754A, #0F380C.
- Flower accents (if any): #E8B923, #AB4AB5, #A0CFD2.
- Highlights: #E1E4DA, #BBCCB2.
- Avoid colours outside this palette.

STYLE:
- Soft, organic lines. Slightly painterly or botanical illustration.
- No harsh shadows. Gentle, diffused lighting from upper-left.
- Medium detail—readable at small sizes but not overly busy.
- Cohesive with a dark-mode garden/farm app aesthetic.
```

---

## Shorter Variant (for token-limited tools)

```
Square garden plant illustration (1:1). Margins: 25% left/right, 5% top/bottom. Subject in central 50%×90% area. Bottom of image: dirt patch (#B5754A, #0F380C) where plant emerges. Above: gradient #11140F to #191D17. Rules of thirds. Palette: #54B54A, #A4D397, #275021, #B5754A, #E8B923. Botanical art style, soft lighting, dark-mode aesthetic.
```

---

## Composition Reference (Rules of Thirds)

**Square image (1:1).** Margins: 25% L/R, 5% top/bottom.

```
               SQUARE FRAME
         25%      50%      25%
        ←──→   ←──────→   ←──→
     ┌──┬─────────────┬──┐  ↑
     │  │             │  │  5%
     │  │      ·      │  │
     │  │             │  │
     │  ├─────────────┤  │
     │  │      ·      │  │  ← Plant focal point
     │  │             │  │     at these · intersections
     │  ├─────────────┤  │
     │  │      ·      │  │  5%
     │  │             │  │  ↓
     └──┴─────────────┴──┘
     (dirt patch at bottom)
```

**Recommended placements:**
- **Lower-right intersection**: Plant emerging from bottom-right, leaves reaching up-left.
- **Upper-left intersection**: Bloom or top of plant at upper-left, stem descending.
- **Lower-left intersection**: Good for side-view plants with foliage spreading right.

---

## Notes

- **Consistency**: Use the exact background hex values and composition rules for every plant image so they feel like a unified set.
- **Subject swap**: Replace "a single plant" with the specific plant name (e.g. "a tomato plant", "a basil plant") when generating per-plant images.
- **Aspect ratio**: Square (1:1). Margins: 25% left/right, 5% top/bottom.
