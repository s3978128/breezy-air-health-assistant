'use client'

import { useState, useEffect } from 'react'
import { useLocation } from '@/contexts/location-context'
import { ExternalLink, ThumbsUp, MapPin, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Types for our initiatives
interface Initiative {
  id: string
  name: string
  description: string
  category: string
  location: string
  date?: string
  organizer: string
  contactInfo: string
  website?: string
  imageUrl?: string
}

const locationRegionMap: Record<string, string> = {
  // North America
  'united states': 'North America',
  usa: 'North America',
  us: 'North America',
  canada: 'North America',
  ca: 'North America',
  mexico: 'North America',
  mx: 'North America',
  bermuda: 'North America',
  greenland: 'North America',
  bahamas: 'North America',
  cuba: 'North America',
  haiti: 'North America',
  'dominican republic': 'North America',
  jamaica: 'North America',
  'puerto rico': 'North America',

  // Europe
  germany: 'Europe',
  de: 'Europe',
  france: 'Europe',
  fr: 'Europe',
  'united kingdom': 'Europe',
  uk: 'Europe',
  england: 'Europe',
  gb: 'Europe',
  spain: 'Europe',
  es: 'Europe',
  italy: 'Europe',
  it: 'Europe',
  netherlands: 'Europe',
  nl: 'Europe',
  sweden: 'Europe',
  se: 'Europe',
  norway: 'Europe',
  no: 'Europe',
  finland: 'Europe',
  fi: 'Europe',
  denmark: 'Europe',
  dk: 'Europe',
  belgium: 'Europe',
  be: 'Europe',
  austria: 'Europe',
  at: 'Europe',
  ireland: 'Europe',
  ie: 'Europe',
  poland: 'Europe',
  pl: 'Europe',
  'czech republic': 'Europe',
  cz: 'Europe',
  switzerland: 'Europe',
  ch: 'Europe',
  portugal: 'Europe',
  pt: 'Europe',
  greece: 'Europe',
  gr: 'Europe',
  hungary: 'Europe',
  hu: 'Europe',
  romania: 'Europe',
  ro: 'Europe',
  slovakia: 'Europe',
  sk: 'Europe',
  slovenia: 'Europe',
  si: 'Europe',
  bulgaria: 'Europe',
  bg: 'Europe',
  croatia: 'Europe',
  hr: 'Europe',
  estonia: 'Europe',
  ee: 'Europe',
  latvia: 'Europe',
  lv: 'Europe',
  lithuania: 'Europe',
  lt: 'Europe',
  iceland: 'Europe',
  is: 'Europe',

  // Asia
  china: 'Asia',
  cn: 'Asia',
  daxing: 'Asia',
  japan: 'Asia',
  jp: 'Asia',
  india: 'Asia',
  in: 'Asia',
  'south korea': 'Asia',
  korea: 'Asia',
  kr: 'Asia',
  thailand: 'Asia',
  th: 'Asia',
  vietnam: 'Asia',
  vn: 'Asia',
  philippines: 'Asia',
  ph: 'Asia',
  indonesia: 'Asia',
  id: 'Asia',
  malaysia: 'Asia',
  my: 'Asia',
  singapore: 'Asia',
  sg: 'Asia',
  taiwan: 'Asia',
  tw: 'Asia',
  nepal: 'Asia',
  np: 'Asia',
  bangladesh: 'Asia',
  bd: 'Asia',
  pakistan: 'Asia',
  pk: 'Asia',
  'sri lanka': 'Asia',
  lk: 'Asia',
  mongolia: 'Asia',
  mn: 'Asia',
  myanmar: 'Asia',
  mm: 'Asia',
  cambodia: 'Asia',
  kh: 'Asia',
  laos: 'Asia',
  la: 'Asia',

  // Australia/Oceania
  australia: 'Australia/Oceania',
  au: 'Australia/Oceania',
  'new zealand': 'Australia/Oceania',
  nz: 'Australia/Oceania',
  fiji: 'Australia/Oceania',
  fj: 'Australia/Oceania',
  'papua new guinea': 'Australia/Oceania',
  pg: 'Australia/Oceania',
  samoa: 'Australia/Oceania',
  ws: 'Australia/Oceania',
  tonga: 'Australia/Oceania',
  to: 'Australia/Oceania',
  'solomon islands': 'Australia/Oceania',
  sb: 'Australia/Oceania',
  vanuatu: 'Australia/Oceania',
  vu: 'Australia/Oceania',
  micronesia: 'Australia/Oceania',
  fm: 'Australia/Oceania',
  'marshall islands': 'Australia/Oceania',
  mh: 'Australia/Oceania',

  // Africa
  nigeria: 'Africa',
  ng: 'Africa',
  kenya: 'Africa',
  ke: 'Africa',
  egypt: 'Africa',
  eg: 'Africa',
  'south africa': 'Africa',
  za: 'Africa',
  ethiopia: 'Africa',
  et: 'Africa',
  ghana: 'Africa',
  gh: 'Africa',
  morocco: 'Africa',
  ma: 'Africa',
  algeria: 'Africa',
  dz: 'Africa',
  tunisia: 'Africa',
  tn: 'Africa',
  uganda: 'Africa',
  ug: 'Africa',
  tanzania: 'Africa',
  tz: 'Africa',
  zimbabwe: 'Africa',
  zw: 'Africa',
  namibia: 'Africa',
  na: 'Africa',
  botswana: 'Africa',
  bw: 'Africa',
  senegal: 'Africa',
  sn: 'Africa',
  cameroon: 'Africa',
  cm: 'Africa',
  'ivory coast': 'Africa',
  'côte d’ivoire': 'Africa',
  ci: 'Africa',
  rwanda: 'Africa',
  rw: 'Africa',
  sudan: 'Africa',
  sd: 'Africa',

  // South America
  brazil: 'South America',
  br: 'South America',
  argentina: 'South America',
  ar: 'South America',
  chile: 'South America',
  cl: 'South America',
  colombia: 'South America',
  co: 'South America',
  peru: 'South America',
  pe: 'South America',
  ecuador: 'South America',
  ec: 'South America',
  venezuela: 'South America',
  ve: 'South America',
  uruguay: 'South America',
  uy: 'South America',
  paraguay: 'South America',
  py: 'South America',
  bolivia: 'South America',
  bo: 'South America',
  guyana: 'South America',
  gy: 'South America',
  suriname: 'South America',
  sr: 'South America',
}

const getRegionFromLocation = (location: string): string => {
  const normalizedParts = location.toLowerCase().split(/[\s,]+/)

  for (const part of normalizedParts) {
    if (locationRegionMap[part]) {
      return locationRegionMap[part]
    }
  }

  return 'default'
}

export default function GreenInitiatives() {
  const locationContext = useLocation()
  const [initiatives, setInitiatives] = useState<Initiative[]>([])
  const [region, setRegion] = useState<string>('default')
  const [likedInitiatives, setLikedInitiatives] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (locationContext?.currentLocation) {
      const detectedRegion = getRegionFromLocation(locationContext.currentLocation)
      setRegion(detectedRegion)

      interface Initiative {
        id: string
        name: string
        description: string
        category: string
        location: string
        date?: string
        organizer: string
        contactInfo: string
        website?: string
        imageUrl?: string
      }

      // Dummy data for initiatives based on regions
      const initiativesByRegion: Record<string, Initiative[]> = {
        'North America': [
          {
            id: 'na-1',
            name: 'Urban and Community Forestry Program',
            description:
              'A U.S. Forest Service initiative dedicated to improving urban forests through tree planting and maintenance, enhancing community health and resilience.',
            category: 'Urban Forestry',
            location: 'United States',
            organizer: 'U.S. Forest Service',
            contactInfo: 'https://www.fs.usda.gov/contactus',
            website: 'https://www.fs.usda.gov/managing-land/urban-forests/ucf',
          },
          {
            id: 'na-2',
            name: 'One Tree Planted – North America Projects',
            description:
              'Reforestation projects across North America aiming to restore ecosystems, enhance biodiversity, and combat climate change through tree planting.',
            category: 'Reforestation',
            location: 'Canada, United States, Mexico',
            organizer: 'One Tree Planted',
            contactInfo: 'https://onetreeplanted.org/pages/contact-us',
            website: 'https://onetreeplanted.org/products/north-america',
          },
          {
            id: 'na-3',
            name: 'Enterprise Mobility Urban Tree Initiative',
            description:
              'Supports urban forestry by planting trees in communities lacking green spaces, enhancing environmental quality and community well-being.',
            category: 'Urban Forestry',
            location: 'North America',
            organizer: 'Enterprise Mobility',
            contactInfo: 'https://www.enterprisemobility.com/en/contact-us.html',
            website:
              'https://www.enterprisemobility.com/en/our-impact/community-giving/reforestation-urban-forestry.html',
          },
        ],
        Europe: [
          {
            id: 'eu-1',
            name: 'European Declaration on Cycling',
            description:
              'An EU initiative promoting cycling as a sustainable mode of transport, aiming to enhance cycling infrastructure and policies across member states.',
            category: 'Sustainable Transportation',
            location: 'European Union',
            organizer: 'European Commission',
            contactInfo: 'https://transport.ec.europa.eu/contact_en',
            website:
              'https://transport.ec.europa.eu/news-events/news/commission-proposes-list-principles-boost-cycling-across-europe-2023-10-04_en',
          },
          {
            id: 'eu-2',
            name: 'Bloomberg Initiative for Cycling Infrastructure (BICI)',
            description:
              'Provides funding and support to cities worldwide to develop safe and accessible cycling infrastructure, promoting sustainable urban mobility.',
            category: 'Urban Mobility',
            location: 'Various European Cities',
            organizer: 'Bloomberg Philanthropies',
            contactInfo: 'https://globaldesigningcities.org/contact/',
            website: 'https://globaldesigningcities.org/bici-launch/',
          },
          {
            id: 'eu-3',
            name: 'Italy’s National Cycling Plan',
            description:
              'A comprehensive plan investing €1.2 billion to create extensive cycling paths, promoting sustainable transportation and tourism.',
            category: 'Infrastructure Development',
            location: 'Italy',
            organizer: 'Italian Government',
            contactInfo: 'https://www.mit.gov.it/contatti',
            website:
              'https://www.welovecycling.com/wide/2023/07/27/pedal-progress-taking-a-look-at-europes-commitments-to-cycling-infrastructure-post-pandemic/',
          },
        ],
        Asia: [
          {
            id: 'as-1',
            name: 'Clean Rivers Bali',
            description:
              'A collaborative project focusing on cleaning and restoring Bali’s rivers, promoting environmental education and sustainable waste management.',
            category: 'Water Conservation',
            location: 'Bali, Indonesia',
            organizer: 'Akuo Energy & Sungai Watch',
            contactInfo: 'https://www.akuoenergy.com/en/contact',
            website:
              'https://www.akuoenergy.com/en/akuo-in-the-world/all-our-projects/clean-rivers-bali',
          },
          {
            id: 'as-2',
            name: 'Project STOP',
            description:
              'An initiative establishing circular waste management systems in Indonesia, aiming to reduce ocean plastic pollution and improve community health.',
            category: 'Waste Management',
            location: 'Indonesia',
            organizer: 'SYSTEMIQ',
            contactInfo: 'https://www.systemiq.earth/contact/',
            website: 'https://www.systemiq.earth/project-stop-clean-rivers/',
          },
          {
            id: 'as-3',
            name: 'Plastic Free Rivers and Seas for South Asia',
            description:
              'A regional project aiming to reduce plastic pollution in South Asian rivers and seas through policy development and community engagement.',
            category: 'Pollution Reduction',
            location: 'South Asia',
            organizer: 'SACEP & World Bank',
            contactInfo: 'https://www.sacep.org/contact',
            website: 'http://www.sacep.org/programmes/plastic-free-rivers-and-seas-for-south-asia',
          },
        ],
        'Australia/Oceania': [
          {
            id: 'au-1',
            name: 'South Australian Blue Carbon Ecosystem Restoration',
            description:
              'Restoring 12,400 hectares of coastal wetlands to enhance biodiversity, sequester carbon, and protect shorelines.',
            category: 'Ecosystem Restoration',
            location: 'South Australia',
            organizer: 'The Nature Conservancy Australia',
            contactInfo: 'https://www.natureaustralia.org.au/contact-us/',
            website:
              'https://www.natureaustralia.org.au/what-we-do/our-priorities/oceans/ocean-stories/sa-bluecarbon-ecosystem-restoration/',
          },
          {
            id: 'au-2',
            name: 'Australia’s Sustainable Ocean Plan',
            description:
              'A national commitment to sustainably manage 100% of Australia’s ocean territory, focusing on climate adaptation and biodiversity conservation.',
            category: 'Marine Conservation',
            location: 'Australia',
            organizer: 'Department of Climate Change, Energy, the Environment and Water',
            contactInfo: 'https://www.dcceew.gov.au/about/contact-us',
            website: 'https://www.dcceew.gov.au/environment/marine/ocean-climate-connection',
          },
          {
            id: 'au-3',
            name: 'Nature Repair Market',
            description:
              'A voluntary market facilitating private investment into ecological restoration projects across Australia.',
            category: 'Environmental Finance',
            location: 'Australia',
            organizer: 'Department of Climate Change, Energy, the Environment and Water',
            contactInfo: 'https://www.dcceew.gov.au/about/contact-us',
            website: 'https://www.sciencedirect.com/science/article/pii/S1462901124001424',
          },
        ],
        Africa: [
          {
            id: 'af-1',
            name: 'Global Initiative of Sustainable Agriculture and Environment',
            description:
              'Provides training programs on sustainable agriculture, soil health, and biodiversity to farmers across Africa.',
            category: 'Agricultural Training',
            location: 'Various African Countries',
            organizer: 'Global Initiative of Sustainable Agriculture and Environment',
            contactInfo: 'https://www.globalsustainableagriculture.org/contact/',
            website: 'https://www.globalsustainableagriculture.org/training-programs/',
          },
          {
            id: 'af-2',
            name: 'Ripple Effect – Sustainable Agriculture',
            description:
              'Works with rural African communities to implement sustainable farming practices, improving food security and livelihoods.',
            category: 'Community Development',
            location: 'Sub-Saharan Africa',
            organizer: 'Ripple Effect',
            contactInfo: 'https://rippleeffect.org/contact-us/',
            website: 'https://rippleeffect.org/about/what-we-do/sustainable-agriculture/',
          },
          {
            id: 'af-3',
            name: 'G20 Global Land Initiative – Resilient Agriculture Workshop',
            description:
              'A training workshop focusing on building resilient agricultural systems through sustainable land management in Africa.',
            category: 'Capacity Building',
            location: 'Senegal',
            organizer: 'G20 Global Land Initiative & AfricaRice',
            contactInfo: 'https://g20land.org/contact/',
            website:
              'https://g20land.org/training/building-resilient-agricultural-systems-sustainable-land-management-and-restoration-for-africas-agricultural-future/',
          },
        ],
        'South America': [
          {
            id: 'sa-1',
            name: 'Rainforest Alliance – South America Projects',
            description:
              'Supports sustainable farming and forest conservation projects across South America, benefiting thousands of farmers and vast hectares of land.',
            category: 'Sustainable Development',
            location: 'Ecuador, Peru, Brazil, Colombia',
            organizer: 'Rainforest Alliance',
            contactInfo: 'https://www.rainforest-alliance.org/contact/',
            website: 'https://www.rainforest-alliance.org/regions/south-america/',
          },
          {
            id: 'sa-2',
            name: 'Amazon Conservation',
            description:
              'Combines science, innovation, and community engagement to protect the Amazon rainforest and empower local populations.',
            category: 'Forest Conservation',
            location: 'Amazon Basin',
            organizer: 'Amazon Conservation',
            contactInfo: 'https://www.amazonconservation.org/contact/',
            website: 'https://www.amazonconservation.org/',
          },
          {
            id: 'sa-3',
            name: 'Amazon Watch',
            description:
              'Advocates for the protection of the Amazon rainforest and Indigenous rights through campaigns and partnerships.',
            category: 'Advocacy',
            location: 'Amazon Basin',
            organizer: 'Amazon Watch',
            contactInfo: 'https://amazonwatch.org/contact',
            website: 'https://amazonwatch.org/',
          },
        ],
        default: [
          {
            id: 'default-1',
            name: 'Global Climate Action Network',
            description:
              'An international network connecting climate activists and organizations to share resources and coordinate actions.',
            category: 'Climate Action',
            location: 'Global',
            organizer: 'Climate Action Network',
            contactInfo: 'https://climatenetwork.org/contact/',
            website: 'https://climatenetwork.org/',
          },
          {
            id: 'default-2',
            name: 'Plastic Pollution Reduction Campaign',
            description:
              'A global campaign aiming to reduce single-use plastics through education, policy advocacy, and business partnerships.',
            category: 'Pollution Reduction',
            location: 'Global',
            organizer: 'Plastic Free Future',
            contactInfo: 'https://plasticfreefuture.org/contact/',
            website: 'https://plasticfreefuture.org/',
          },
        ],
      }

      const mockData = initiativesByRegion[detectedRegion] || initiativesByRegion['default']
      setRegion(detectedRegion)
      setInitiatives(mockData)
      setLikedInitiatives(new Set())
    }
  }, [locationContext?.currentLocation])

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-3xl font-semibold text-sky-700 flex items-center gap-2">
          Green Initiatives Nearby
        </h3>
        <p className="text-muted-foreground text-base">
          Discover and participate in environmental actions happening in your community. Know a
          great initiative? Help us grow by submitting one!
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() =>
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSctmaXxDhQ1SHyBKnXY5jV5uviCOigvgtkX_FYM3dzcKZOtgA/viewform?usp=sharing',
                '_blank',
              )
            }
          >
            Submit an Initiative
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
          {region !== 'default' && (
            <Badge variant="outline" className="bg-sky-50 text-sky-700 border-sky-200">
              <MapPin className="mr-1 h-4 w-4" />
              Showing initiatives for {region}
            </Badge>
          )}
        </div>
      </div>

      <Separator className="my-2" />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:[grid-template-columns:repeat(auto-fit,minmax(200px,1fr))] gap-4 w-full">
        {initiatives.length > 0 ? (
          initiatives.map((initiative) => (
            <Card
              key={initiative.id}
              className="flex flex-col justify-between overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-sky-50 pb-2">
                <CardTitle className="text-lg text-emerald-700">{initiative.name}</CardTitle>

                <CardDescription className="text-sm text-gray-600">
                  {/* Optional: brief description here */}
                </CardDescription>

                <div className="flex items-center gap-1 text-sm text-gray-600 mt-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{initiative.location}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 flex-grow">
                <p className="text-sm text-gray-700">{initiative.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                  {initiative.date && (
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                      <span>{initiative.date}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <Users className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <span>{initiative.organizer}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 mt-auto">
                {initiative.website && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(initiative.website, '_blank')}
                    className="text-sky-600 hover:text-sky-700"
                  >
                    Learn more
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500 col-span-full">
            No green initiatives found in your region yet.
          </p>
        )}
      </div>
    </section>
  )
}
