export function formatCurrency(amount: number): string {
  return `रू ${amount.toLocaleString("en-NP")}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function getDaysSince(dateString: string | null): number | null {
  if (!dateString) return null;
  const visit = new Date(dateString);
  const diff = Date.now() - visit.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export interface StreakInfo {
  streak: number;
  visitsToNextPerk: number;
  currentPerkTitle: string;
  nextPerkTitle: string;
  isWindowActive: boolean; // between 30 and 42 days since last cut
  daysRemainingInWindow: number | null;
}

export function calculateStreakInfo(streak: number, lastVisitDate: string | null): StreakInfo {
  const daysSince = getDaysSince(lastVisitDate);
  const visitsToNextPerk = 4 - (streak % 4 === 0 ? 4 : streak % 4);

  let currentPerkTitle = "Start your grooming streak";
  if (streak >= 8) currentPerkTitle = "25% Off Any Luxury Spa Treatment";
  else if (streak >= 4) currentPerkTitle = "Free Deluxe Beard Trim or Conditioning Mask";

  let nextPerkTitle = "Free Deluxe Beard Trim or Conditioning Mask (Visit 4)";
  if (streak >= 4 && streak < 8) {
    nextPerkTitle = "25% Off Any Luxury Spa Treatment (Visit 8)";
  } else if (streak >= 8) {
    nextPerkTitle = "VIP Masterclass Styling & Product Gift Bag (Visit 12)";
  }

  let isWindowActive = false;
  let daysRemainingInWindow: number | null = null;

  if (daysSince !== null) {
    // 35 to 40 days is the target reminder window
    if (daysSince >= 30 && daysSince <= 40) {
      isWindowActive = true;
      daysRemainingInWindow = 40 - daysSince;
    }
  }

  return {
    streak,
    visitsToNextPerk: visitsToNextPerk === 0 ? 4 : visitsToNextPerk,
    currentPerkTitle,
    nextPerkTitle,
    isWindowActive,
    daysRemainingInWindow,
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export function getUserBadges(streak: number, completedVisitsCount: number): Badge[] {
  return [
    {
      id: "first_cut",
      name: "Fresh Beginnings",
      description: "Completed your first session at Unisex Haircut",
      icon: "✂️",
      unlocked: completedVisitsCount >= 1,
    },
    {
      id: "disciplined",
      name: "35-Day Precision",
      description: "Maintained a consistent 5-week grooming schedule",
      icon: "⏱️",
      unlocked: streak >= 2,
    },
    {
      id: "streak_master",
      name: "Style Icon",
      description: "Achieved a 4+ visit continuous style streak",
      icon: "🔥",
      unlocked: streak >= 4,
    },
    {
      id: "birtamode_vip",
      name: "Ratan VIP Club",
      description: "Completed 5 or more total salon transformations",
      icon: "👑",
      unlocked: completedVisitsCount >= 5,
    },
  ];
}