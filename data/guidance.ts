import type { Metric } from "@/lib/types";

export const careSources = {
  cardiovascular: { label: "NASA · Cardiovascular adaptations", url: "https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/" },
  sleep: { label: "NASA · Sleep and irregular schedules", url: "https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/" },
  activity: { label: "NASA · Human spaceflight risks", url: "https://www.nasa.gov/hrp/risks/" },
  standard: { label: "NASA · Standard Measures", url: "https://www.nasa.gov/reference/standard-measures/" },
  hazards: { label: "NASA · Five hazards", url: "https://www.nasa.gov/hrp/hazards/" },
  medical: { label: "NASA · Health and medical care §§3.1, 3.5", url: "https://www.nasa.gov/reference/3-0-health-and-medical-care/" },
  training: { label: "NASA · Medical training §5.2.1", url: "https://www.nasa.gov/reference/5-0-training/" },
  pulse: { label: "American Heart Association · Measuring a pulse", url: "https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates" },
  diary: { label: "NHLBI · Sleep diary guidance", url: "https://www.nhlbi.nih.gov/health/insomnia/diagnosis" },
} as const;

export const measurementGuides: Record<Metric, {
  title: string; represents: string; relevance: string; method: string; equipment: string;
  quality: string; limit: string; convention: string; sources: (keyof typeof careSources)[];
}> = {
  heartRate: {
    title: "Resting heart rate", represents: "Heartbeats per minute while resting, not an exercise pulse.",
    relevance: "NASA studies heart and blood-vessel adaptation in reduced gravity. A pulse trend provides limited personal context.",
    method: "Use your approved mission measurement method. For a general manual wrist pulse, place the first two fingertips on the thumb-side of the wrist, count for 30 seconds and multiply by two. Record a resting reading, not one taken during exertion.",
    equipment: "Manual entry from a timed pulse or an approved device readout. OrbitCare has no sensor connection and verifies no device accuracy.",
    quality: "A different method, recent activity, stress or medication can affect interpretation. Note changed conditions. Uncheck comparable resting conditions to exclude that heart-rate reading from comparisons.",
    limit: "Heart rate alone cannot assess heart structure, diagnose a rhythm problem or rule out an emergency.",
    convention: "Use consistent timing and conditions for this personal comparison. This is measurement-quality guidance, not a NASA-certified acquisition protocol.", sources: ["pulse", "cardiovascular"],
  },
  sleep: {
    title: "Sleep duration", represents: "Estimated time asleep during the daily reporting interval; time in bed is different.",
    relevance: "NASA identifies irregular schedules, light-dark cycles and disrupted sleep as mission stressors.",
    method: "Use a sleep diary: note sleep/wake times, time awake and naps. For this prototype, enter total estimated sleep, including naps, in the preceding 24-hour reporting interval. Avoid counting the same sleep twice.",
    equipment: "Self-report or a consistently used approved sleep record. No sleep-stage or wearable integration is implemented.",
    quality: "Changed reporting intervals, missed naps, recall uncertainty or switching methods can affect comparison. Describe these in the context note; leave an unknown value blank.",
    limit: "Hours alone do not measure sleep quality, circadian alignment or cognitive readiness.",
    convention: "The 24-hour aggregation is an OrbitCare reporting convention. NASA research and NHLBI diary guidance do not validate its alert threshold.", sources: ["diary", "sleep", "standard"],
  },
  fatigue: {
    title: "Self-reported fatigue", represents: "Your subjective fatigue at check-in: 1 no fatigue, 2 slight, 3 moderate, 4 high, 5 very high.",
    relevance: "Sleep disruption and workload are relevant to spaceflight well-being. A report adds context that a pulse cannot supply.",
    method: "Choose the category that describes how fatigued you feel now. Use the same anchors and a consistent point in your routine; add workload or sleep context when useful.",
    equipment: "Self-report only. No cognitive test, brain sensor or medical questionnaire is being administered.",
    quality: "Different reporting times, interpretation of the categories and changing workload affect comparability. Blank means unknown, not no fatigue.",
    limit: "This illustrative scale is not clinically validated and cannot diagnose impairment or certify fitness for duty.",
    convention: "The scale and two-category change rule are prototype engineering assumptions, separate from NASA sleep research.", sources: ["sleep"],
  },
  exercise: {
    title: "Exercise / activity context", represents: "Recorded exercise duration in minutes; it does not measure intensity, strength or fitness.",
    relevance: "NASA researches physical deconditioning in altered gravity. Activity records can help interpret the surrounding mission routine.",
    method: "Enter completed exercise minutes for the same daily reporting interval, using a timer or activity log. Note activity type or interruptions if relevant. Follow your approved mission exercise plan.",
    equipment: "Manual duration entry. No exercise hardware, loading, energy-expenditure or movement sensor is connected.",
    quality: "Changing activity type, intensity, interruptions or logging method may make equal durations very different. Record context rather than inferring a health effect.",
    limit: "No independent alert or exercise target is calculated. Minutes cannot measure muscle loss, bone density or conditioning.",
    convention: "Daily duration is a contextual engineering choice; this application does not prescribe exercise or change mission countermeasures.", sources: ["standard", "activity"],
  },
};

export const bodySystems = [
  { id: "cardiovascular", label: "Cardiovascular", subtitle: "Resting heart rate", metrics: ["heartRate"], source: "cardiovascular", context: "Reduced gravity can alter circulation and cardiovascular function. NASA investigates these adaptations with measurements far beyond a daily pulse.", limit: "A highlighted chest region is an educational navigation point. OrbitCare does not image the heart, measure blood pressure, diagnose cardiovascular disease or establish organ health." },
  { id: "sleep", label: "Sleep & fatigue", subtitle: "Sleep duration · fatigue", metrics: ["sleep", "fatigue"], source: "sleep", context: "Workload, irregular schedules and light-dark cycles can disrupt sleep. Sleep duration and a subjective fatigue report offer different pieces of personal context.", limit: "The head region is an educational navigation point. OrbitCare does not measure brain function, circadian phase, sleep stages or cognitive impairment." },
  { id: "activity", label: "Activity context", subtitle: "Exercise duration", metrics: ["exercise"], source: "activity", context: "Altered gravity changes physical loading. NASA studies reduced cardiorespiratory and musculoskeletal conditioning; recorded exercise minutes add routine context.", limit: "Highlighted muscle regions are schematic educational context. OrbitCare does not measure muscle loss, bone density, strength, energy expenditure or fitness." },
] as const;
export type BodySystemId = typeof bodySystems[number]["id"];
