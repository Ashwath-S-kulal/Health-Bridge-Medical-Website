const OVERPASS_SERVERS = [
  "https://overpass-api.de/api/interpreter",
  "https://lz4.overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter"
];

async function fetchOverpassFastest(query) {
  // Create a proper form-encoded body string required by strict Overpass servers
  const bodyParams = new URLSearchParams();
  bodyParams.append('data', query);

  // Map each server to an active fetch promise running concurrently
  const fetchPromises = OVERPASS_SERVERS.map(async (server) => {
    // Add an internal timeout controller so a hanging server doesn't hold up your backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 second timeout

    try {
      const response = await fetch(server, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json",
          // The strict main servers reject empty or generic user agents with 406
          "User-Agent": "HealthCommandCenterApp/1.0 (Medical Emergency Fetcher)"
        },
        body: bodyParams.toString(),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log(`SERVER: ${server} | STATUS: ${response.status}`);

      if (!response.ok) {
        throw new Error(`Server ${server} responded with status ${response.status}`);
      }

      const data = await response.json();
      
      // Ensure the server returned actual map elements before declaring it the winner
      if (!data || !data.elements) {
        throw new Error(`Server ${server} returned an empty or malformed payload`);
      }

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(`Failure on mirror [${server}]:`, err.message);
      throw err; // Essential: must rethrow so Promise.any knows this individual runner failed
    }
  });

  // Race the servers! Promise.any resolves as soon as the first promise fulfills cleanly.
  try {
    return await Promise.any(fetchPromises);
  } catch (aggregateError) {
    throw new Error("All active public Overpass infrastructure endpoints are heavily loaded.");
  }
}

export default async function handler(req, res) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter string payload is required"
      });
    }

    // Call our fast parallel implementation
    const data = await fetchOverpassFastest(query);

    return res.status(200).json({
      success: true,
      elements: data.elements || []
    });

  } catch (err) {
    console.error("OVERPASS CORE EXCEPTION:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Failed to sync coordinate matrices via network array."
    });
  }
}