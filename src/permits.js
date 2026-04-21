// Permit configuration.
// Categories: 'day' = day hike, 'overnight' = backpacking / overnight wilderness.
// Each permit declares how to fetch availability and how to classify its divisions.

export const PERMITS = [
  {
    id: "445859",
    area: "Yosemite",
    fullName: "Yosemite Wilderness",
    api: "permitinyo", // special endpoint
    metaApi: "permitcontent",
    defaultCategory: "overnight",
    divisionCategory: () => "overnight", // all 69 trailheads are overnight backpacking
    bookingType: "overnight-permit",
  },
  {
    id: "233260",
    area: "Mt. Whitney",
    fullName: "Mt. Whitney",
    api: "permits",
    metaApi: "permits",
    defaultCategory: "overnight",
    divisionCategory: (divId) => {
      // 166 = Mt. Whitney Trail (Overnight), 406 = Mt. Whitney Day Use
      if (String(divId) === "406") return "day";
      return "overnight";
    },
    divisionBookingType: (divId) =>
      String(divId) === "406" ? "day-use-permit" : "overnight-permit",
    bookingType: "overnight-permit",
  },
  {
    id: "233261",
    area: "Desolation",
    fullName: "Desolation Wilderness",
    api: "permits",
    metaApi: "permits",
    defaultCategory: "overnight",
    divisionCategory: () => "overnight",
    bookingType: "overnight-permit",
  },
];

export const CATEGORY_LABELS = {
  day: "Day Hike",
  overnight: "Backpacking",
};

// Dates where the permit's quota is effectively unlimited/walk-up get skipped
// because they're not interesting for a "what just opened up?" dashboard.
// Desolation uses 900000 for zones with no quota limit, and 999 as a
// "throttled but effectively unlimited" signal for its thru-hike bucket.
// Real Yosemite trailhead quotas max out around 30; Mt. Whitney day-use around 160.
// 300 is well above any real wilderness quota and filters out both 999 and 900000.
export const NO_QUOTA_THRESHOLD = 300;
