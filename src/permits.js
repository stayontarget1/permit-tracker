// Permit configuration.
// Categories: 'day' = day hike, 'overnight' = backpacking / overnight wilderness.
//
// Two availability endpoints exist upstream and we pick per permit:
//   - "permitinyo": newer system → /api/permitinyo/{id}/availability?start_date=&end_date=
//   - "permits":    legacy system → /api/permits/{id}/availability/month?start_date=
// Metadata (division names) is uniformly available from /api/permitcontent/{id}.

export const PERMITS = [
  {
    id: "445859",
    area: "Yosemite",
    fullName: "Yosemite Wilderness",
    api: "permitinyo",
    defaultCategory: "overnight",
    bookingType: "overnight-permit",
  },
  {
    id: "445860",
    area: "Mt. Whitney",
    fullName: "Mt. Whitney",
    api: "permitinyo",
    defaultCategory: "overnight",
    // 166 = Mt. Whitney Trail (Overnight), 406 = Mt. Whitney Day Use (All Routes)
    divisionCategory: (divId) => (String(divId) === "406" ? "day" : "overnight"),
    divisionBookingType: (divId) =>
      String(divId) === "406" ? "day-use-permit" : "overnight-permit",
    bookingType: "overnight-permit",
  },
  {
    id: "233261",
    area: "Desolation",
    fullName: "Desolation Wilderness",
    api: "permits",
    defaultCategory: "overnight",
    bookingType: "overnight-permit",
  },
  {
    id: "234652",
    area: "Half Dome",
    fullName: "Half Dome (Yosemite)",
    api: "permits",
    defaultCategory: "day",
    bookingType: "day-use-permit",
  },
  {
    id: "233262",
    area: "Inyo NF",
    fullName: "Inyo National Forest Wilderness",
    api: "permitinyo",
    defaultCategory: "overnight",
    bookingType: "overnight-permit",
  },
  {
    id: "445857",
    area: "Sequoia-Kings",
    fullName: "Sequoia & Kings Canyon Wilderness",
    api: "permitinyo",
    defaultCategory: "overnight",
    bookingType: "overnight-permit",
  },
  {
    id: "445856",
    area: "Hoover",
    fullName: "Hoover Wilderness",
    api: "permitinyo",
    defaultCategory: "overnight",
    bookingType: "overnight-permit",
  },
];

export const CATEGORY_LABELS = {
  day: "Day Hike",
  overnight: "Backpacking",
};

// Dates where the quota is effectively unlimited/walk-up get skipped — they
// aren't actionable "what just opened?" signal. Real wilderness quotas top out
// around 160 (Whitney day-use); anything above 300 is a sentinel for no limit.
export const NO_QUOTA_THRESHOLD = 300;
