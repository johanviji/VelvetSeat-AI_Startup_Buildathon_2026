import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Salon } from "./Home";

export default function Compare() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [salonA, setSalonA] = useState("");
  const [salonB, setSalonB] = useState("");

  useEffect(() => {
    const fetchSalons = async () => {
      const { data } = await supabase
        .from("salons")
        .select("*");

      setSalons(data || []);
    };

    fetchSalons();
  }, []);

  const selectedA = salons.find(s => s.id === salonA);
  const selectedB = salons.find(s => s.id === salonB);
const scoreA =
  (selectedA?.rating > selectedB?.rating ? 1 : 0) +
  (selectedA?.review_count > selectedB?.review_count ? 1 : 0) +
  (selectedA?.price_tier < selectedB?.price_tier ? 1 : 0);

const scoreB =
  (selectedB?.rating > selectedA?.rating ? 1 : 0) +
  (selectedB?.review_count > selectedA?.review_count ? 1 : 0) +
  (selectedB?.price_tier < selectedA?.price_tier ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#1A0A0F] text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-[#C9A84C]">
        Compare Salons
      </h1>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <select
          value={salonA}
          onChange={(e) => setSalonA(e.target.value)}
          className="p-3 rounded bg-[#2D1B25]"
        >
          <option value="">Select Salon A</option>
          {salons.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.name}
            </option>
          ))}
        </select>

        <select
          value={salonB}
          onChange={(e) => setSalonB(e.target.value)}
          className="p-3 rounded bg-[#2D1B25]"
        >
          <option value="">Select Salon B</option>
          {salons.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.name}
            </option>
          ))}
        </select>
      </div>

      {selectedA && selectedB && (
        <>
  <div className="mb-6 text-center">
    {scoreA > scoreB && (
      <h2 className="text-2xl font-bold text-[#C9A84C]">
        🏆 {selectedA.name} Wins Overall
      </h2>
    )}

    {scoreB > scoreA && (
      <h2 className="text-2xl font-bold text-[#C9A84C]">
        🏆 {selectedB.name} Wins Overall
      </h2>
    )}

    {scoreA === scoreB && (
      <h2 className="text-2xl font-bold text-[#C9A84C]">
        🤝 It's a Tie
      </h2>
    )}
  </div>

  <div className="overflow-x-auto">
          <table className="w-full border border-[#C9A84C]">
            <thead>
              <tr>
                <th className="p-4 border">Feature</th>
                 <th className="p-4 border bg-[#C9A84C] text-black font-bold">
  {selectedA.name}
</th>

<th className="p-4 border bg-[#C9A84C] text-black font-bold">
  {selectedB.name}
</th>
              </tr>
            </thead>

            <tbody>
              <tr>
  <td className="p-4 border">Rating</td>

  <td
  className={`p-4 border ${
    selectedA.rating > selectedB.rating
      ? "bg-[#C9A84C]/20"
      : ""
  }`}
>
  {selectedA.rating}
  {selectedA.rating > selectedB.rating && " 🏆"}
</td>

  <td
  className={`p-4 border ${
    selectedB.rating > selectedA.rating
      ? "bg-[#C9A84C]/20"
      : ""
  }`}
>
  {selectedB.rating}
  {selectedB.rating > selectedA.rating && " 🏆"}
</td>
</tr>

              <tr>
  <td className="p-4 border">Reviews</td>

  <td
  className={`p-4 border ${
    selectedA.review_count > selectedB.review_count
      ? "bg-[#C9A84C]/20"
      : ""
  }`}
>
  {selectedA.review_count}
  {selectedA.review_count > selectedB.review_count && " 🏆"}
</td>

  <td
  className={`p-4 border ${
    selectedB.review_count > selectedA.review_count
      ? "bg-[#C9A84C]/20"
      : ""
  }`}
>
  {selectedB.review_count}
  {selectedB.review_count > selectedA.review_count && " 🏆"}
</td>
</tr>

              <tr>
  <td className="p-4 border">Price</td>

  <td
    className={`p-4 border ${
      selectedA.price_tier < selectedB.price_tier
        ? "bg-[#C9A84C]/20"
        : ""
    }`}
  >
    {"₹".repeat(Number(selectedA.price_tier))}
    {selectedA.price_tier < selectedB.price_tier && " 🏆"}
  </td>

  <td
    className={`p-4 border ${
      selectedB.price_tier < selectedA.price_tier
        ? "bg-[#C9A84C]/20"
        : ""
    }`}
  >
    {"₹".repeat(Number(selectedB.price_tier))}
    {selectedB.price_tier < selectedA.price_tier && " 🏆"}
  </td>
</tr>

              <tr>
                <td className="p-4 border">Neighborhood</td>
                <td className="p-4 border">{selectedA.neighborhood}</td>
                <td className="p-4 border">{selectedB.neighborhood}</td>
              </tr>

              <tr>
                <td className="p-4 border">AI Summary</td>
                <td className="p-4 border">{selectedA.ai_summary}</td>
                <td className="p-4 border">{selectedB.ai_summary}</td>
              </tr>
            </tbody>
          </table>
</div>
</>
)}
    </div>
  );
}