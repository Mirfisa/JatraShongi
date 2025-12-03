const routeString = "- Sadarghat (সদরঘাট) - Ray Saheb Bazar (রায় সাহেব বাজার) - Naya Bazar (নয়া বাজার) - Golap Shah Mazar (গোলাপ শাহ মাজার) - GPO (জিপিও) - Paltan (পল্টন) - Kakrail (কাকরাইল) - Shantinagar (শান্তিনগর) - Malibaag Moor (মালিবাগ মোড়) - Mouchak (মৌচাক) - Malibagh Railgate (মালিবাগ রেলগেট) - Hazipara (হাজীপাড়া) - Rampura Bazar (রামপুরা বাজার) - Rampura Bridge (রামপুরা ব্রিজ) - Merul Badda (মেরুল বাড্ডা) - Badda (বাড্ডা) - Shahjadpur (শাহজাদপুর) - Bashtola (বাঁশতলা) - Notun Bazar (নতুন বাজার) - Nadda (নদ্দা) - Bashundhara (বসুন্ধরা) - Jamuna Future Park (যমুনা ফিউচার পার্ক) - Kuril Bishwa Road (কুড়িল বিশ্ব রোড)";

const parseRouteStops = (routeString) => {
  if (!routeString) return [];
  const cleanString = routeString.trim().startsWith("-")
    ? routeString.trim().substring(1)
    : routeString;

  return cleanString
    .split("-")
    .map((part) => {
      const match = part.trim().match(/^([^(]+)/);
      return match ? match[1].trim() : part.trim();
    })
    .filter((stop) => stop.length > 0);
};

const stops = parseRouteStops(routeString);
console.log("Stops:", stops);

const from = "Rampura Bazar";
const to = "Jamuna Future Park";

const normalizedFrom = from.toLowerCase();
const normalizedTo = to.toLowerCase();

const fromMatch = stops.some(stop => stop.toLowerCase().includes(normalizedFrom));
const toMatch = stops.some(stop => stop.toLowerCase().includes(normalizedTo));

console.log(`From '${from}' found:`, fromMatch);
console.log(`To '${to}' found:`, toMatch);

const startIndex = stops.findIndex(stop => stop.toLowerCase().includes(normalizedFrom));
const endIndex = stops.findIndex(stop => stop.toLowerCase().includes(normalizedTo));

console.log("Start Index:", startIndex);
console.log("End Index:", endIndex);
console.log("Direction correct (Start < End):", startIndex < endIndex);
