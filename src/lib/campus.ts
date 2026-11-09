// Howard University (Washington, DC) landmarks.
// Coordinates come from OpenStreetMap building outlines (Nominatim lookup, way ids below),
// names/descriptions follow Howard's official Central Campus Map. No coordinate is invented:
// places we could not verify as a point (e.g. The Yard / Upper Quad) carry no pin.

export const OFFICIAL_MAP_URL = "https://howard-central-campus-map.vercel.app/";
export const OFFICIAL_MAPS_PAGE = "https://realestate.howard.edu/campus-maps";
export const CAMPUS_CENTER: [number, number] = [38.9228, -77.0205];

export type Category = "Library" | "Student life" | "Performance" | "Athletics" | "Academic" | "Administration" | "Research";
export const CATEGORIES: Category[] = ["Library", "Student life", "Performance", "Athletics", "Academic", "Administration", "Research"];

export type Landmark = {
  id: string;
  name: string;
  officialName: string;
  category: Category;
  description: string;
  lat: number | null;
  lng: number | null;
  osmWay?: number;
  officialUrl?: string;
};

export const LANDMARKS: Landmark[] = [
  { id: "founders", name: "Founders Library", officialName: "Founders Library", category: "Library", description: "Landmark main library whose clock tower overlooks the Upper Quadrangle.", lat: 38.9223059, lng: -77.0193584, osmWay: 226022474, officialUrl: "https://events.howard.edu/founders_library" },
  { id: "blackburn", name: "Armour J. Blackburn Center", officialName: "Armour J. Blackburn University Center", category: "Student life", description: "Student center with dining, event space and student services.", lat: 38.9239374, lng: -77.019151, osmWay: 226023234, officialUrl: "https://studentaffairs.howard.edu/about/departments/blackburn-university-center" },
  { id: "cramton", name: "Cramton Auditorium", officialName: "Louis C. Cramton Auditorium", category: "Performance", description: "Major performance venue for concerts, convocations, lectures and community events.", lat: 38.9245243, lng: -77.0209302, osmWay: 293164193, officialUrl: "https://events.howard.edu/cramton_auditorium" },
  { id: "burr", name: "Burr Gymnasium", officialName: "John H. Burr Gymnasium Building", category: "Athletics", description: "University gymnasium on north campus for indoor athletics and recreation.", lat: 38.9263126, lng: -77.0222225, osmWay: 277831037, officialUrl: "https://events.howard.edu/burr_gym" },
  { id: "douglass", name: "Douglass Hall", officialName: "Frederick Douglass Memorial Hall", category: "Academic", description: "Classroom building on the Upper Quadrangle for College of Arts and Sciences departments.", lat: 38.9236546, lng: -77.0208069, osmWay: 226023218, officialUrl: "https://events.howard.edu/frederick_douglas_hall" },
  { id: "johnson", name: "Mordecai Johnson Administration Building", officialName: "Mordecai Wyatt Johnson Building", category: "Administration", description: "Central administration and visitor-facing services (often called the A Building).", lat: 38.9230071, lng: -77.0215104, osmWay: 293164229, officialUrl: "https://events.howard.edu/mordecai_johnson_administrative_building" },
  { id: "irb", name: "Interdisciplinary Research Building", officialName: "Interdisciplinary Research Building", category: "Research", description: "The university's interdisciplinary research building on the Georgia Avenue side of campus.", lat: 38.9193769, lng: -77.0214895, osmWay: 401650412, officialUrl: "https://events.howard.edu/interdisciplinary_research_building" },
  { id: "yard", name: "The Yard / Upper Quad", officialName: "Upper Quadrangle", category: "Student life", description: "Open quadrangle framed by Founders Library and Douglass Hall. Shown without a pin: it is an area, and we could not verify a single point for it.", lat: null, lng: null },
];

export const pinned = (l: Landmark): l is Landmark & { lat: number; lng: number } => l.lat !== null && l.lng !== null;

export function filterLandmarks(list: Landmark[], query: string, category: Category | "all"): Landmark[] {
  const q = query.trim().toLowerCase();
  return list.filter(
    (l) =>
      (category === "all" || l.category === category) &&
      (!q || [l.name, l.officialName, l.category, l.description].join(" ").toLowerCase().includes(q)),
  );
}
