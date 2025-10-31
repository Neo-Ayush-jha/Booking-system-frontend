'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TourDetailPage() {
  const params = useParams();
  const tourId = params.id as string;

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function fetchTour() {
      try {
        const res = await fetch(`http://localhost:5000/api/experiences/${tourId}`);
        if (!res.ok) throw new Error('Failed to fetch tour details');
        const data = await res.json();
        setTour(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (tourId) fetchTour();
  }, [tourId]);

  if (loading) return <div className="text-center py-20 text-gray-500">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!tour) return <div className="text-center py-20 text-gray-500">No experience found</div>;

  const totalPrice = tour.price * guests;

  return (
    <div className="min-h-screen bg-white">
      {/* ---------- Header ---------- */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MapPin className="w-6 h-6" />
            <div>
              <div className="font-bold text-lg leading-none">Highway</div>
              <div className="text-xs text-muted-foreground">INDIA</div>
            </div>
          </Link>

          <Button className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium">
            Contact
          </Button>
        </div>
      </header>

      {/* ---------- Main Content ---------- */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ---------- Left Section ---------- */}
          <div className="lg:col-span-2">
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#FDB913] text-black text-xs font-medium px-3 py-1 rounded">
                  {tour.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{tour.name}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {tour.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {tour.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {tour.groupSize}
                </div>
              </div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#FDB913] text-[#FDB913]" />
                  <span className="font-semibold">{tour.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({tour.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">About this experience</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {tour.longDescription}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {tour.description}
              </p>
            </div>

            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">What's included</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FDB913] rounded-full" />
                  Professional certified guide
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FDB913] rounded-full" />
                  All safety equipment
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FDB913] rounded-full" />
                  Small group experience
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FDB913] rounded-full" />
                  Insurance coverage
                </li>
              </ul>
            </div>
          </div>

          {/* ---------- Right Booking Section ---------- */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <div className="mb-6">
                <div className="text-sm text-muted-foreground mb-1">Price per person</div>
                <div className="text-3xl font-bold">₹{tour.price}</div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB913]"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Number of Guests</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={guests}
                      onChange={(e) =>
                        setGuests(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      min="1"
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB913]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">
                    ₹{tour.price} × {guests} guest{guests > 1 ? 's' : ''}
                  </span>
                  <span className="font-medium">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Service fee</span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">₹{totalPrice}</span>
                  </div>
                </div>
              </div>

              <Link href={`/booking/${tour.id}?guests=${guests}&date=${selectedDate}`}>
                <Button
                  className="w-full bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium h-12"
                  disabled={!selectedDate}
                >
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
