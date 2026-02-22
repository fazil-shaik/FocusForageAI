/**
 * XP Engine - Server Authoritative Logic
 * Handles penalty/bonus calculations based on mental state and distraction logs.
 */

export type MentalState = "Flow" | "Neutral" | "Tired" | "Anxious";

export interface XPConfig {
    basePointsPerMin: number;
    completionBonus: number;
    penaltyPerDistraction: number;
}

const DEFAULT_CONFIG: XPConfig = {
    basePointsPerMin: 10,
    completionBonus: 50,
    penaltyPerDistraction: 10,
};

export function calculateXPChange(params: {
    durationMinutes: number;
    mentalState: MentalState;
    distractionCount: number;
    isBoosted: boolean;
    isCompleted: boolean;
}) {
    const { durationMinutes, mentalState, distractionCount, isBoosted, isCompleted } = params;

    if (isBoosted) {
        return -10; // Boosted sessions always result in a flat -10 XP penalty
    }

    let multiplier = 1;
    let ignoredDistractions = 0;

    switch (mentalState) {
        case "Flow":
            multiplier = 1.5;
            break;
        case "Tired":
            multiplier = 0.6;
            break;
        case "Anxious":
            ignoredDistractions = 2;
            multiplier = 1.0;
            break;
        case "Neutral":
        default:
            multiplier = 1.0;
            break;
    }

    const effectiveDistractions = Math.max(0, distractionCount - ignoredDistractions);

    let xp = durationMinutes * DEFAULT_CONFIG.basePointsPerMin;
    if (isCompleted) {
        xp += DEFAULT_CONFIG.completionBonus;
    }

    const penalty = effectiveDistractions * DEFAULT_CONFIG.penaltyPerDistraction * multiplier;

    // Total XP change (can be negative if penalties exceed gains)
    const result = Math.round(xp - penalty);

    return result;
}
