import { useState, useEffect } from "react";

const restaurants = [
  { name: "한식광비집", menu: "한우 숯불구이", category: "한식", location: "명동", rating: 5.0, emoji: "🥩" },
  { name: "몽블리 명동점", menu: "무한리필 삼겹살", category: "한식", location: "명동", rating: 4.9, emoji: "🐷" },
  { name: "은주정", menu: "김치찌개", category: "한식", location: "을지로", rating: 4.2, emoji: "🍲" },
  { name: "숙성도 을지로점", menu: "제주 흑돼지 구이", category: "한식", location: "을지로", rating: 4.8, emoji: "🔥" },
  { name: "명동하우스 감자탕", menu: "감자탕", category: "한식", location: "명동", rating: 4.7, emoji: "🦴" },
  { name: "가야성", menu: "짬뽕", category: "중식", location: "을지로", rating: 4.0, emoji: "🦑" },
  { name: "일일향", menu: "탕수육 + 짜장면", category: "중식", location: "을지로", rating: 4.8, emoji: "🥡" },
  { name: "타이24", menu: "팟타이", category: "태국", location: "명동", rating: 4.9, emoji: "🍜" },
  { name: "충무로 한양집", menu: "굴 안주 + 해장국", category: "한식", location: "충무로", rating: 5.0, emoji: "🦪" },
  { name: "너애하누", menu: "한우 특선세트", category: "한식", location: "을지로", rating: 5.0, emoji: "🐄" },
  { name: "스시 다이이치", menu: "점심 오마카세", category: "일식", location: "서울역", rating: 4.4, emoji: "🍣" },
  { name: "항가람", menu: "갈비찜 + 장어구이", category: "한식", location: "남대문", rating: 4.5, emoji: "🍱" },
];

const categoryColors = {
  한식: { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  중식: { bg: "#E3F2FD", text: "#1565C0", border: "#90CAF9" },
  일식: { bg: "#F3E5F5", text: "#6A1B9A", border: "#CE93D8" },
  태국: { bg: "#E8F5E9", text: "#2E7D32", border: "#A5D6A7" },
};

function StarRating({ rating }) {
  return (
    <span style={{ color: "#F59E0B", fontSize: "12px", fontWeight: 700 }}>
      {"★".repeat(Math.floor(rating))}{rating % 1 >= 0.5 ? "½" : ""} {rating}
    </span>
  );
}

function MenuCard({ item, index, spinCount }) {
  const [aiComment, setAiComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const cat = categoryColors[item.category] || categoryColors["한식"];

  useEffect(() => {
    setAiComment(null);
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: item.name, menu: item.menu, location: item.location }),
        });
        const data = await res.json();
        setAiComment(data.comment || "오늘 이 메뉴, 운명이에요! 🍀");
      } catch {
        setAiComment("지금 당신에게 가장 필요한 바로 그 맛! 🎯");
      }
      setLoading(false);
    }, index * 300 + 400);
    return () => clearTimeout(timer);
  }, [spinCount]);

  return (
    <div style={{
      background: "#fff", borderRadius: "20px", padding: "18px 20px", marginBottom: "12px",
      boxShadow: index === 0 ? "0 8px 30px rgba(0,0,0,0.12)" : "0 2px 12px rgba(0,0,0,0.06)",
      border: index === 0 ? "2px solid #FF6B35" : "1.5px solid #f0f0f0",
      animation: "slideIn 0.5s ease forwards", animationDelay: `${index * 0.08}s`, opacity: 0,
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: cat.bg, border: `2px solid ${cat.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "26px", position: "relative",
          }}>
            {item.emoji}
            <div style={{
              position: "absolute", top: "-8px", right: "-8px",
              width: "20px", height: "20px", borderRadius: "50%",
              background: "#FF6B35", color: "#fff", fontSize: "11px",
              fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{index + 1}</div>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "17px", fontWeight: 800, color: "#1a1a1a", marginBottom: "4px" }}>
            {item.menu}
          </div>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#888" }}>{item.name} · {item.location}</span>
            <span style={{
              padding: "2px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
              background: cat.bg, color: cat.text, border: `1px solid ${cat.border}`,
            }}>{item.category}</span>
          </div>
          <StarRating rating={item.rating} />
          <div style={{
            marginTop: "10px", padding: "10px 14px", borderRadius: "12px",
            background: loading ? "#fafafa" : "linear-gradient(135deg, #FFF8F5 0%, #FFF3EE 100%)",
            border: "1.5px solid #FFD4C2", minHeight: "36px",
            display: "flex", alignItems: "center",
          }}>
            {loading ? (
              <span style={{ fontSize: "12px", color: "#ccc", animation: "pulse 1s ease-in-out infinite" }}>
                AI가 한마디 고르는 중...
              </span>
            ) : (
              <span style={{ fontSize: "13px", color: "#C0392B", fontWeight: 600, lineHeight: 1.5 }}>
                💬 {aiComment}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [picks, setPicks] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setPicks([]);
    await new Promise(r => setTimeout(r, 900));
    const shuffled = [...restaurants].sort(() => Math.random() - 0.5);
    setPicks(shuffled.slice(0, 5));
    setSpinCount(c => c + 1);
    setSpinning(false);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF5F0 0%, #FFF9F5 50%, #FFFBF9 100%)",
      fontFamily: "'Noto Sans KR', sans-serif",
      maxWidth: "480px", margin: "0 auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;600;700;800;900&family=Black+Han+Sans&display=swap');
        @keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform:translateY(0px) rotate(-3deg); } 50% { transform:translateY(-8px) rotate(3deg); } }
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        * { box-sizing:border-box; }
      `}</style>

      <div style={{ padding: "36px 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
          <span style={{ fontSize: "36px", animation: "float 3s ease-in-out infinite", display: "inline-block" }}>🍽️</span>
          <div style={{ fontSize: "22px", fontWeight: 900, color: "#1a1a1a", fontFamily: "'Black Han Sans', sans-serif", lineHeight: 1.1 }}>
            오늘 점심<br /><span style={{ color: "#FF6B35" }}>뭐 먹지?</span>
          </div>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#999", fontWeight: 500 }}>
          📍 서울 중구 실제 맛집 기반 · AI 코멘트 포함
        </p>
      </div>

      <div style={{ padding: "0 24px 28px" }}>
        <button onClick={spin} disabled={spinning} style={{
          width: "100%", padding: "18px", borderRadius: "20px", border: "none",
          cursor: spinning ? "not-allowed" : "pointer",
          background: spinning ? "#ccc" : "linear-gradient(135deg, #FF6B35 0%, #F7452A 50%, #FF6B35 100%)",
          backgroundSize: "200% auto",
          animation: spinning ? "none" : "shimmer 3s linear infinite",
          color: "#fff", fontSize: "17px", fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          boxShadow: spinning ? "none" : "0 8px 30px rgba(255,107,53,0.4)",
          transition: "all 0.2s", fontFamily: "'Noto Sans KR', sans-serif",
        }}>
          {spinning ? "🎰 고르는 중..." : spinCount === 0 ? "오늘의 점심 5곳 뽑기 🎲" : "다시 뽑기 🔄"}
        </button>
        {spinCount > 0 && !spinning && (
          <p style={{ textAlign: "center", marginTop: "10px", fontSize: "12px", color: "#bbb" }}>
            {spinCount}번째 뽑기 완료!
          </p>
        )}
      </div>

      {picks.length === 0 && !spinning && spinCount === 0 && (
        <div style={{ padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px", animation: "float 3s ease-in-out infinite" }}>🎯</div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#555", marginBottom: "6px" }}>버튼을 눌러보세요!</p>
          <p style={{ fontSize: "13px", color: "#aaa" }}>중구 맛집 {restaurants.length}곳 중<br />딱 5곳을 AI가 골라드려요</p>
        </div>
      )}

      {spinning && (
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: "56px", animation: "spin 0.5s linear infinite", display: "inline-block", marginBottom: "20px" }}>🎰</div>
          <p style={{ fontSize: "16px", fontWeight: 700, color: "#FF6B35", animation: "pulse 0.8s ease-in-out infinite" }}>
            오늘의 점심을 고르는 중...
          </p>
        </div>
      )}

      {picks.length > 0 && (
        <div style={{ padding: "0 16px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", padding: "0 8px" }}>
            <span style={{ fontSize: "18px" }}>✨</span>
            <span style={{ fontSize: "15px", fontWeight: 800, color: "#1a1a1a" }}>오늘의 점심 추천</span>
            <span style={{
              marginLeft: "auto", fontSize: "12px", color: "#FF6B35", fontWeight: 700,
              background: "#FFF3EE", padding: "3px 10px", borderRadius: "20px", border: "1px solid #FFD4C2",
            }}>5곳 선정 완료</span>
          </div>
          {picks.map((item, index) => (
            <MenuCard key={`${spinCount}-${index}`} item={item} index={index} spinCount={spinCount} />
          ))}
          <div style={{
            marginTop: "8px", padding: "14px 16px", borderRadius: "16px",
            background: "rgba(255,107,53,0.06)", border: "1px dashed #FFCC99", textAlign: "center",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#CC7A40", lineHeight: 1.6 }}>
              🗺️ 모두 서울 중구 실제 인기 맛집이에요<br />
              AI 한줄평은 Claude가 재미로 붙여드리는 거예요 😄
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
