import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Salon } from "./Home";

export default function Search() {
  const [salons, setSalons] = useState<Salon[]>([]);
  const [locality, setLocality] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSalons = async () => {
      const { data } = await supabase
        .from("salons")
        .select("*");

      setSalons(data || []);
    };

    fetchSalons();
  }, []);

  const filteredSalons = salons.filter((salon) => {
  return (
    salon.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) &&
    (locality === "" ||
      salon.neighborhood === locality) &&
    salon.rating >= minRating &&
    salon.price_tier <= maxPrice
  );
});

 return (
  <div className="min-h-screen bg-[#1A0A0F] text-white p-8">
    <h1 className="text-5xl font-bold text-center text-[#C9A84C] mb-4">
      Smart Salon Search
    </h1>

    <p className="text-center text-[#C4847A] mb-12">
      Find the perfect salon by locality, rating and price.
    </p>

    <div className="max-w-6xl mx-auto bg-[#2D1B25] rounded-3xl p-8 border border-[#C9A84C]/20 mb-10">
    <input
    type="text"
    placeholder="🔍 Search salon name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full p-4 rounded-xl bg-[#1A0A0F] mb-6"
  />
      
      <div className="grid md:grid-cols-3 gap-4">

        {/* Locality */}
        <select
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="w-full p-3 rounded-xl bg-[#1A0A0F]"
        >
          <option value="">All Localities</option>

          {[...new Set(salons.map((s) => s.neighborhood))].map(
            (area) => (
              <option key={area} value={area}>
                {area}
              </option>
            )
          )}
        </select>

        {/* Rating */}
        <select
          value={minRating}
          onChange={(e) =>
            setMinRating(Number(e.target.value))
          }
          className="w-full p-3 rounded-xl bg-[#1A0A0F]"
        >
          <option value={0}>All Ratings</option>
          <option value={4}>4+</option>
          <option value={4.5}>4.5+</option>
        </select>

        {/* Price */}
        <select
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(Number(e.target.value))
          }
          className="w-full p-3 rounded-xl bg-[#1A0A0F]"
        >
          <option value={3}>Any Price</option>
          <option value={1}>₹</option>
          <option value={2}>₹₹</option>
          <option value={3}>₹₹₹</option>
        </select>

      </div>
    </div>

    <p className="text-center mb-8 text-[#C9A84C]">
      {filteredSalons.length} salons found
    </p>

    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {filteredSalons.map((salon) => (
        <div
          key={salon.id}
          className="bg-[#2D1B25] rounded-3xl p-6 border border-[#C9A84C]/20 hover:border-[#C9A84C] hover:-translate-y-1 transition-all duration-300"
        >
          <h3 className="text-xl font-bold text-[#C9A84C] mb-2">
            {salon.name}
          </h3>

          <p>{salon.neighborhood}</p>

          <p>⭐ {salon.rating}</p>

          <p>
            {"₹".repeat(Number(salon.price_tier))}
          </p>

          <p>{salon.review_count} reviews</p>
        </div>
      ))}
    </div>
  </div>
);
}