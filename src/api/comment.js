export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, menu, location } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: `서울 중구 ${location}에 있는 "${name}"의 "${menu}" 메뉴를 점심으로 먹어야 하는 이유를 딱 한 문장으로, 재미있고 유머러스하게, 한국어로 설명해줘. 이모지 1~2개 포함. 20자~40자 사이로.`,
        }],
      }),
    });

    const data = await response.json();
    const comment = data.content?.[0]?.text?.trim() || "오늘 이 메뉴, 운명이에요! 🍀";
    res.status(200).json({ comment });
  } catch (err) {
    res.status(200).json({ comment: "지금 당신에게 가장 필요한 바로 그 맛! 🎯" });
  }
}
