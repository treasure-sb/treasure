type CityInfo = {
  label: string;
  latitude: number;
  longitude: number;
};

const cityMap: Record<string, CityInfo> = {
  "new-york-ny": {
    label: "New York, NY",
    latitude: 40.7128,
    longitude: -74.006,
  },
  "washington-dc": {
    label: "Washington, DC",
    latitude: 38.9072,
    longitude: -77.0369,
  },
  "boston-ma": {
    label: "Boston, MA",
    latitude: 42.3601,
    longitude: -71.0589,
  },
  "chicago-il": {
    label: "Chicago, IL",
    latitude: 41.8781,
    longitude: -87.6298,
  },
  "los-angeles-ca": {
    label: "Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
  },
  "san-francisco-ca": {
    label: "San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
  },
  "seattle-wa": {
    label: "Seattle, WA",
    latitude: 47.6062,
    longitude: -122.3321,
  },
  "austin-tx": {
    label: "Austin, TX",
    latitude: 30.2672,
    longitude: -97.7431,
  },
  "denver-co": {
    label: "Denver, CO",
    latitude: 39.7392,
    longitude: -104.9903,
  },
  "dallas-tx": {
    label: "Dallas, TX",
    latitude: 32.7767,
    longitude: -96.797,
  },
  "houston-tx": {
    label: "Houston, TX",
    latitude: 29.7604,
    longitude: -95.3698,
  },
  "miami-fl": {
    label: "Miami, FL",
    latitude: 25.7617,
    longitude: -80.1918,
  },
  "atlanta-ga": {
    label: "Atlanta, GA",
    latitude: 33.749,
    longitude: -84.388,
  },
  "philadelphia-pa": {
    label: "Philadelphia, PA",
    latitude: 39.9526,
    longitude: -75.1652,
  },
  "phoenix-pa": {
    label: "Phoenix, AZ",
    latitude: 33.4484,
    longitude: -112.074,
  },
  "san-diego-ca": {
    label: "San Diego, CA",
    latitude: 32.7157,
    longitude: -117.1611,
  },
  "minneapolis-mn": {
    label: "Minneapolis, MN",
    latitude: 44.9778,
    longitude: -93.265,
  },
  "portland-or": {
    label: "Portland, OR",
    latitude: 45.5051,
    longitude: -122.675,
  },
  "detroit-mi": {
    label: "Detroit, MI",
    latitude: 42.3314,
    longitude: -83.0458,
  },
  "salt-lake-city-ut": {
    label: "Salt Lake City, UT",
    latitude: 40.7608,
    longitude: -111.891,
  },
  "las-vegas-nv": {
    label: "Las Vegas, NV",
    latitude: 36.1699,
    longitude: -115.1398,
  },
  "charlotte-nc": {
    label: "Charlotte, NC",
    latitude: 35.2271,
    longitude: -80.8431,
  },
  "raleigh-nc": {
    label: "Raleigh, NC",
    latitude: 35.7796,
    longitude: -78.6382,
  },
  "nashville-tn": {
    label: "Nashville, TN",
    latitude: 36.1627,
    longitude: -86.7816,
  },
  "new-orleans-la": {
    label: "New Orleans, LA",
    latitude: 29.9511,
    longitude: -90.0715,
  },
  "pittsburgh-pa": {
    label: "Pittsburgh, PA",
    latitude: 40.4406,
    longitude: -79.9959,
  },
  "indianapolis-in": {
    label: "Indianapolis, IN",
    latitude: 39.7684,
    longitude: -86.1581,
  },
  "columbus-oh": {
    label: "Columbus, OH",
    latitude: 39.9612,
    longitude: -82.9988,
  },
  "milwaukee-wi": {
    label: "Milwaukee, WI",
    latitude: 43.0389,
    longitude: -87.9065,
  },
  "st-louis-mo": {
    label: "St. Louis, MO",
    latitude: 38.627,
    longitude: -90.1994,
  },
  "kansas-city-mo": {
    label: "Kansas City, MO",
    latitude: 39.0997,
    longitude: -94.5786,
  },
  "oklahoma-city-ok": {
    label: "Oklahoma City, OK",
    latitude: 35.4676,
    longitude: -97.5164,
  },
};

export { cityMap };
