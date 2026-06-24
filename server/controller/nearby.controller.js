

export default async function handler(req, res) {
    console.log("ghjkl")
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { query } = req.body;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `data=${encodeURIComponent(query)}`
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Overpass returned ${response.status}`
      });
    }

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}