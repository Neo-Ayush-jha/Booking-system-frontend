"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Home() {
  const [tours, setTours] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:5000";
  // Fetch data from backend API
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/experiences`);
        const data = await res.json();
        setTours(data);
      } catch (err) {
        console.error("Error fetching experiences:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  // Filter tours by search
  const filteredTours = tours.filter(
    (tour) =>
      tour?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour?.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading experiences...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <div>
              <div className="font-bold text-lg leading-none">Highway</div>
              <div className="text-xs text-muted-foreground">INDIA</div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex items-center flex-1 max-w-lg mx-8">
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-4"
                />
              </div>
            </div>

            <Button className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium">
              Search
            </Button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-8">
        {filteredTours.length === 0 ? (
          <p className="text-center text-gray-500">No experiences found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{tour.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tour.location}
                      </p>
                    </div>
                    <span className="bg-[#FDB913] text-black text-xs font-medium px-2 py-1 rounded">
                      {tour.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {tour.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        From{" "}
                      </span>
                      <span className="font-bold text-lg">₹{tour.price}</span>
                    </div>
                    <Link href={`/tour/${tour.id}`}>
                      <Button
                        size="sm"
                        className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
