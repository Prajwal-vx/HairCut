import type { ConsultationInputs, DiagnosisResult } from "./consultationTypes";

export function computeConsultationRecommendation(
  inputs: ConsultationInputs
): DiagnosisResult {
  const { genderPreference, hairGoal, faceShape, hairTexture } = inputs;
  const capitalizedTexture = hairTexture.charAt(0).toUpperCase() + hairTexture.slice(1);
  const capitalizedFaceShape = faceShape.charAt(0).toUpperCase() + faceShape.slice(1);

  if (
    genderPreference === "mens" ||
    (genderPreference === "unisex" && (hairGoal === "clean" || hairGoal === "low_maintenance"))
  ) {
    if (faceShape === "round") {
      return {
        title: "Textured Crop Fade & Angular Fringe",
        subtitle: "Adds vertical height and sharp jawline definition",
        faceShape: "Round",
        hairTexture: capitalizedTexture,
        matchScore: 97,
        description:
          "A mid-skin fade with textured volume on top elongates the face and creates strong cheekbone and jawline contours.",
        whyItWorks: [
          "Vertical height balances circular facial proportions",
          "High tapered edges sharpen the temples and jaw",
          "Textured top directs visual attention upward",
        ],
        stylingTips: [
          "Use sea salt spray on towel-dried hair for natural grip",
          "Finish with matte styling clay for an effortless textured finish",
        ],
        maintenanceIntervalDays: 21,
        recommendedServiceId: "srv-2",
        recommendedServiceName: "Zero / Skin Fade & Hot Towel",
        recommendedStylistId: "stylist-1",
        recommendedStylistName: "Bishal Shrestha",
        productSuggestion: "Matte Styling Clay & Sea Salt Spray",
        sampleImage: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
      };
    }

    if (faceShape === "square") {
      return {
        title: "Classic Low Taper Pompadour",
        subtitle: "Softens prominent jawlines while preserving clean masculine structure",
        faceShape: "Square",
        hairTexture: capitalizedTexture,
        matchScore: 98,
        description:
          "Subtle scissor-over-comb tapering with sweeping top length accentuates your strong bone structure without looking overly rigid.",
        whyItWorks: [
          "Complements chiselled facial angles naturally",
          "Adds height at the crown to balance jaw width",
          "Clean neckline enhances neck posture",
        ],
        stylingTips: [
          "Blow dry backward using a round brush for root lift",
          "Apply a nickel-sized dab of medium-hold water pomade",
        ],
        maintenanceIntervalDays: 28,
        recommendedServiceId: "srv-1",
        recommendedServiceName: "Precision Barber Cut",
        recommendedStylistId: "stylist-1",
        recommendedStylistName: "Bishal Shrestha",
        productSuggestion: "Water-based Classic Pomade",
        sampleImage: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&auto=format&fit=crop&q=80",
      };
    }

    return {
      title: "Executive Scissor Taper & Beard Sculpt",
      subtitle: "Bespoke balance for oval and versatile facial shapes",
      faceShape: capitalizedFaceShape,
      hairTexture: capitalizedTexture,
      matchScore: 96,
      description:
        "Clean silhouette scissor work with razor-sharp edges and an invigorating hot towel finish to frame the cheekbones.",
      whyItWorks: [
        "Proportionate perimeter maintains golden ratio symmetry",
        "Seamless transition from hair into facial hair or sideburns",
        "Versatile styling: professional by day, relaxed by evening",
      ],
      stylingTips: [
        "Work light styling paste through damp hair",
        "Finger comb for modern movement",
      ],
      maintenanceIntervalDays: 25,
      recommendedServiceId: "srv-8",
      recommendedServiceName: "The Uptown Royal Executive Package",
      recommendedStylistId: "stylist-1",
      recommendedStylistName: "Bishal Shrestha",
      productSuggestion: "Argan Beard Elixir & Light Cream",
      sampleImage: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format&fit=crop&q=80",
    };
  }

  // Women's / Layered / Color styling
  if (hairGoal === "volume" || faceShape === "heart" || faceShape === "diamond") {
    return {
      title: "Face-Framing Butterfly Layers & Curtain Fringe",
      subtitle: "Dynamic movement that highlights cheekbones and softens the forehead",
      faceShape: capitalizedFaceShape,
      hairTexture: capitalizedTexture,
      matchScore: 99,
      description:
        "Cascading graduated layers tailored precisely to your cheekbone apex, delivering bounce, movement, and effortless framing.",
      whyItWorks: [
        "Curtain bangs draw focal gaze toward your eyes and smile",
        "Layers distribute volume weight away from ends",
        "Creates an illusion of fuller, bouncier hair density",
      ],
      stylingTips: [
        "Blow dry bangs forward, then curl backward with large rollers",
        "Finish with lightweight shine serum on ends",
      ],
      maintenanceIntervalDays: 45,
      recommendedServiceId: "srv-4",
      recommendedServiceName: "Signature Layered Cut & Blowout",
      recommendedStylistId: "stylist-3",
      recommendedStylistName: "Rohan Thapa",
      productSuggestion: "Volumizing Mousse & Botanical Polish",
      sampleImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    };
  }

  if (hairGoal === "fashion_forward") {
    return {
      title: "Dimensional Custom Balayage & Gloss Therapy",
      subtitle: "Sun-kissed hand-painted contours matching your skin undertones",
      faceShape: capitalizedFaceShape,
      hairTexture: capitalizedTexture,
      matchScore: 98,
      description:
        "Custom seamless light placement highlighting your jaw and collarbone with tone-perfect gloss and bonding seal.",
      whyItWorks: [
        "Highlights placed around face illuminate complexion",
        "Low-maintenance root blend grows out gracefully",
        "High-gloss finish seals cuticles for maximum light reflection",
      ],
      stylingTips: [
        "Use sulfate-free color preserve shampoo",
        "Apply heat protectant spray prior to any heat styling",
      ],
      maintenanceIntervalDays: 60,
      recommendedServiceId: "srv-11",
      recommendedServiceName: "Balayage & Ombre Artistry",
      recommendedStylistId: "stylist-2",
      recommendedStylistName: "Priya Sharma",
      productSuggestion: "Color-Safe Bond Restoring Hair Mask",
      sampleImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80",
    };
  }

  return {
    title: "Japanese Silk Keratin & Scalp Rebirth",
    subtitle: "Deep cellular restoration for silky smooth shine and zero frizz",
    faceShape: capitalizedFaceShape,
    hairTexture: capitalizedTexture,
    matchScore: 95,
    description:
      "Infuses pure hydrolysed keratin and botanical moisture deep into the cortex, eliminating humidity puffiness.",
    whyItWorks: [
      "Restores internal hydration barrier",
      "Cuts daily blow dry and styling time by 70%",
      "Imparts mirror-like radiance in natural daylight",
    ],
    stylingTips: [
      "Sleep on a silk pillowcase to prevent friction",
      "Use leave-in conditioning mist after morning wash",
    ],
    maintenanceIntervalDays: 90,
    recommendedServiceId: "srv-13",
    recommendedServiceName: "Japanese Silk Keratin Treatment",
    recommendedStylistId: "stylist-4",
    recommendedStylistName: "Anita Adhikari",
    productSuggestion: "Keratin Leave-In Serum & Scalp Oil",
    sampleImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80",
  };
}
