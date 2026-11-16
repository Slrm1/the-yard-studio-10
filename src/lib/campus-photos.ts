/**
 * Real Howard University campus photography sourced from Wikimedia Commons.
 * Only files whose individual license and author were checked are included.
 * Images are remotely served at Wikimedia thumbnail sizes. Avoid silently
 * relabeling event sample content as documentary photography.
 *
 * See docs/CAMPUS_IMAGE_CREDITS.md for verified attribution and license links.
 */
export type CampusPhotoId = "founders" | "douglass" | "chapel" | "quad" | "courtyard" | "arch";

export type CampusPhoto = {
  id: CampusPhotoId;
  title: string;
  src: string;
  alt: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
};

const commons = (name: string) => `https://commons.wikimedia.org/wiki/File:${name}`;

export const CAMPUS_PHOTOS: Record<CampusPhotoId, CampusPhoto> = {
  founders: {
    id: "founders",
    title: "Founders Library",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cf/Howard_University_Washington_DC_-_Founders_Library.jpg/960px-Howard_University_Washington_DC_-_Founders_Library.jpg",
    alt: "Founders Library at Howard University, with its clock tower rising above a red-brick facade.",
    author: "Derek E. Morton",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: commons("Howard_University_Washington_DC_-_Founders_Library.jpg"),
  },
  douglass: {
    id: "douglass",
    title: "Frederick Douglass Memorial Hall",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Frederick_Douglas_Memorial_Hall_-_Howard_University_%2855257059763%29.jpg/960px-Frederick_Douglas_Memorial_Hall_-_Howard_University_%2855257059763%29.jpg",
    alt: "Frederick Douglass Memorial Hall, a red-brick campus building with columns and a central cupola.",
    author: "Ajay Suresh",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: commons("Frederick_Douglas_Memorial_Hall_-_Howard_University_(55257059763).jpg"),
  },
  chapel: {
    id: "chapel",
    title: "Andrew Rankin Memorial Chapel",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/64/Andrew_Rankin_Memorial_Chapel_at_Howard_University.jpg/960px-Andrew_Rankin_Memorial_Chapel_at_Howard_University.jpg",
    alt: "Andrew Rankin Memorial Chapel framed by leafy trees on Howard University's campus.",
    author: "Qwerty0",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: commons("Andrew_Rankin_Memorial_Chapel_at_Howard_University.jpg"),
  },
  quad: {
    id: "quad",
    title: "The Upper Quadrangle",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Howard_University_the_quad.JPG/960px-Howard_University_the_quad.JPG",
    alt: "Howard University's Upper Quadrangle in winter, with a snowy lawn and campus buildings.",
    author: "Fourandsixty",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: commons("Howard_University_the_quad.JPG"),
  },
  courtyard: {
    id: "courtyard",
    title: "Howard campus courtyard",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/40/Howard_University_courtyard.jpg/960px-Howard_University_courtyard.jpg",
    alt: "Broad green courtyard and walking paths surrounded by Howard University campus buildings.",
    author: "AgnosticPreachersKid",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: commons("Howard_University_courtyard.jpg"),
  },
  arch: {
    id: "arch",
    title: "Founders Library through the chapel arch",
    src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Howard_University_clock_tower_through_chapel_arch.JPG/960px-Howard_University_clock_tower_through_chapel_arch.JPG",
    alt: "Founders Library clock tower visible through an arched passageway on a snowy day.",
    author: "Fourandsixty",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: commons("Howard_University_clock_tower_through_chapel_arch.JPG"),
  },
};

export const FEATURED_CAMPUS_PHOTOS: CampusPhotoId[] = [
  "founders", "douglass", "courtyard", "chapel", "quad", "arch",
];

const LANDMARK_PHOTO_IDS: Record<string, CampusPhotoId | undefined> = {
  founders: "founders",
  douglass: "douglass",
  yard: "quad",
};

export function photoForLandmark(id: string): CampusPhoto | undefined {
  const photoId = LANDMARK_PHOTO_IDS[id];
  return photoId ? CAMPUS_PHOTOS[photoId] : undefined;
}
