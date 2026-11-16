# Howard University campus photography in The Yard Studio

The Yard Studio is an independent student demo and **not endorsed by or affiliated with Howard University**. The photos below depict actual campus places, not the fictional sample organizations, events, messages or profiles shown in the app.

Photos load as 960-pixel thumbnails from Wikimedia Commons, rather than checked-in full-resolution copies. Each appearance carries clickable photographer and license attribution, with a note that images may be responsively cropped using CSS `object-fit: cover`. Photo URLs and attributions are stored in `src/lib/campus-photos.ts`.

| Campus image | Photographer | License | Source |
|---|---|---|---|
| Founders Library | Derek E. Morton | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Howard_University_Washington_DC_-_Founders_Library.jpg) |
| Frederick Douglass Memorial Hall | Ajay Suresh | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Frederick_Douglas_Memorial_Hall_-_Howard_University_(55257059763).jpg) |
| Andrew Rankin Memorial Chapel | Qwerty0 | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Andrew_Rankin_Memorial_Chapel_at_Howard_University.jpg) |
| Upper Quadrangle | Fourandsixty | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Howard_University_the_quad.JPG) |
| Howard campus courtyard | AgnosticPreachersKid | [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Howard_University_courtyard.jpg) |
| Founders Library through chapel arch | Fourandsixty | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Howard_University_clock_tower_through_chapel_arch.JPG) |

**Licensing note:** Each Commons file page was checked individually; the Commons site as a whole does **not** grant one blanket license. Preserve credits and license links when reusing the images. CC BY-SA conditions apply to modifications or adaptations of those photos; this is not a blanket statement about app code. CSS crops are explicitly identified in the UI.

**Visual truthfulness:** Photo-backed sample event pages say that the event content is fictional; photos must not be captioned as evidence that those events occurred. No real student portrait was assigned to a fictional person. Building photo thumbnails are attached only to directories with a verified matching landmark (Founders Library, Douglass Hall, Upper Quad).

**Reliability:** Images use lazy loading and reserved aspect ratios; a local text fallback replaces failed network images. The campus map itself is not changed.

**Future sourcing:** For an expanded Homecoming/student-life gallery, collect photos with explicit authorization or independently verified Commons licenses and consent when necessary; do not copy images from Howard websites or social media on the assumption that they are freely reusable. Howard trademarks remain subject to separate rules.

## Verification checklist

- Open the homepage and confirm four distinct campus photographs with visible credits.
- Open the geographic map, select Founders Library, Douglass Hall and the Upper Quad and verify matching images.
- Open Seasonal Spaces and confirm real campus photos are not represented as footage of fictional events.
- Open My Bison Card and verify the decorative photo never implies a real student's identity.
- Check 320px mobile, large desktop, high contrast, keyboard focus, images blocked, and slow connection.
- Run the repository's TypeScript and production build checks where dependencies are available.
