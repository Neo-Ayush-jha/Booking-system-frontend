"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

// Use NEXT_PUBLIC_API_BASE_URL for client-side API base (fallback to localhost for dev)
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:5000";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const tourId = params.id as string;
  const guests = parseInt(searchParams.get("guests") || "1");
  const date = searchParams.get("date") || "";

  const [tour, setTour] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    promo: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/experiences/${tourId}`)
      .then((res) => setTour(res.data))
      .catch((err) => console.error("Error fetching tour:", err));
  }, [tourId]);

  if (!tour) return <div className="text-center py-20">Loading...</div>;

  const subtotal = tour.price * guests;
  const serviceFee = 0;
  const total = subtotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const bookingData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      bookingDate: date,
      experienceId: tour.id,
      quantity: guests,
      specialRequests: formData.specialRequests,
      promo: formData.promo || "HOLIDAY2025",
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
    };

    try {
      const res = await axios.post(
        `${API_BASE}/api/bookings`,
        bookingData
      );
      const bookingId = res.data?.data?.id || res.data?.bookingId;
      console.log("Booking successful, ID:", bookingId);
      router.push(`/confirmation?tourId=${tour.id}&bookingId=${bookingId}`);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Something went wrong! Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
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

      <main className="container mx-auto px-4 py-8">
        <Link
          href={`/tour/${tour.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tour details
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold mb-6">Confirm and Pay</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Info */}
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Your Details</h2>
                <div className="space-y-4">
                  <Input
                    name="name"
                    placeholder="Full Name"
                    required
                    onChange={handleChange}
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    onChange={handleChange}
                  />
                  <Input
                    name="phone"
                    placeholder="Phone"
                    required
                    onChange={handleChange}
                  />
                  <textarea
                    name="specialRequests"
                    placeholder="Any special requests?"
                    onChange={handleChange}
                    className="w-full border p-2 rounded-md focus:ring-2 focus:ring-[#FDB913]"
                    rows={3}
                  />
                </div>
              </div>

              {/* Payment Info */}
              <div className="border rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
                <div className="space-y-4">
                  <Input
                    name="cardNumber"
                    placeholder="Card Number"
                    required
                    onChange={handleChange}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                      onChange={handleChange}
                    />
                    <Input
                      name="cvv"
                      placeholder="CVV"
                      required
                      onChange={handleChange}
                    />
                  </div>
                  <Input
                    name="promo"
                    placeholder="Promo Code (Optional)"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium h-12"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Pay and Confirm"}
              </Button>
            </form>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

              <div className="flex gap-4 mb-6 border-b pb-6">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-20 h-20 rounded object-cover"
                />
                <div>
                  <h3 className="font-semibold">{tour.title}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {tour.location}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="flex justify-between text-sm">
                  <span>
                    ₹{tour.price} × {guests}
                  </span>{" "}
                  <span>₹{subtotal}</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span>Service Fee</span> <span>₹{serviceFee}</span>
                </p>
                <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                  <span>Total</span> <span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
