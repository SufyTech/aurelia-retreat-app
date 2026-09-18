// The concierge's grounded knowledge. Each entry is a distinct, retrievable
// fact-chunk about the property. Keep entries focused on ONE topic each —
// retrieval quality depends on chunks being specific, not sprawling.

export type KnowledgeChunk = {
  id: string
  topic: string
  content: string
}

export const knowledgeBase: KnowledgeChunk[] = [
  {
    id: 'rooms-cliffside-suite',
    topic: 'Cliffside Suite',
    content:
      'The Cliffside Suite is a private terrace room with a deep soaking tub positioned at sea level. It sleeps two, has a king bed, and starts at €650 per night including breakfast.',
  },
  {
    id: 'rooms-garden-villa',
    topic: 'Garden Villa',
    content:
      'The Garden Villa is a two-room villa wrapped in citrus and jasmine planting, with the sound of a running water feature audible from both rooms. It sleeps up to four guests and starts at €890 per night including breakfast.',
  },
  {
    id: 'rooms-wellness-pavilion',
    topic: 'Wellness Pavilion',
    content:
      'The Wellness Pavilion is not an overnight room but a treatment space: a cedar sauna, open-air massage and facial treatments, and a private plunge pool. It is open from sunrise to sunset. Treatments are bookable in 60 or 90 minute sessions and are complimentary for guests staying 3+ nights, otherwise priced at €120–€220.',
  },
  {
    id: 'dining-overview',
    topic: 'Dining',
    content:
      'Dinner is served nightly beneath the pergola from 7:30–10pm, built around citrus, herbs from the on-site garden, and the daily catch from local fishermen. Breakfast is included with every stay and served until 11am, later on request. There is no fixed menu — the kitchen adjusts nightly to what is fresh that day.',
  },
  {
    id: 'dining-dietary',
    topic: 'Dietary accommodations',
    content:
      'The kitchen can accommodate vegetarian, vegan, gluten-free, and most allergy-related dietary needs with advance notice at booking or at least 24 hours before a stay.',
  },
  {
    id: 'policies-checkin',
    topic: 'Check-in and check-out',
    content: 'Check-in is from 3pm, check-out is by 11am. Early check-in or late check-out can sometimes be arranged based on occupancy — ask the concierge closer to your stay.',
  },
  {
    id: 'policies-cancellation',
    topic: 'Cancellation policy',
    content:
      'Stays can be cancelled free of charge up to 14 days before arrival. Cancellations within 14 days are charged 50% of the stay total; within 72 hours, the full amount applies.',
  },
  {
    id: 'location-access',
    topic: 'Location and getting there',
    content:
      'Aurelia Retreat is located at Via del Silenzio 8, 84017 Positano, Italy, on the Amalfi Coast. The nearest airport is Naples International (NAP), roughly a 90-minute private transfer, which can be arranged by the concierge team.',
  },
  {
    id: 'experiences-availability',
    topic: 'Availability and seasonality',
    content:
      'Aurelia is open year-round. Late spring (May–June) and early autumn (September–October) tend to be the quietest and most temperate periods. Peak summer (July–August) books out fastest, often 2–3 months in advance.',
  },
  {
    id: 'policies-children-pets',
    topic: 'Children and pets',
    content:
      'Aurelia welcomes children of all ages in the Garden Villa; the Cliffside Suite is better suited to adults given the open terrace edge. Well-behaved pets, including dogs and cats, are welcome in the Garden Villa only, with advance notice.',
  },
]
