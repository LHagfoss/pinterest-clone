const NAMED_COLORS: Record<string, [number, number, number]> = {
    black: [0, 0, 0],
    white: [255, 255, 255],
    gray: [128, 128, 128],
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    yellow: [255, 255, 0],
    cyan: [0, 255, 255],
    magenta: [255, 0, 255],
    silver: [192, 192, 192],
    maroon: [128, 0, 0],
    olive: [128, 128, 0],
    purple: [128, 0, 128],
    teal: [0, 128, 128],
    navy: [0, 0, 128],
    orange: [255, 165, 0],
    pink: [255, 192, 203],
    beige: [245, 245, 220],
    brown: [165, 42, 42],
};

export function getColorNameFromHex(hex: string): string {
    const cleanHex = hex.replace("#", "");

    if (cleanHex.length !== 6) {
        return "neutral";
    }

    const r = Number.parseInt(cleanHex.substring(0, 2), 16);
    const g = Number.parseInt(cleanHex.substring(2, 4), 16);
    const b = Number.parseInt(cleanHex.substring(4, 6), 16);

    let minDistance = Number.MAX_VALUE;
    let closestColor = "neutral";

    for (const [name, [cr, cg, cb]] of Object.entries(NAMED_COLORS)) {
        const distance = Math.sqrt(
            (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2,
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    }

    return closestColor;
}
