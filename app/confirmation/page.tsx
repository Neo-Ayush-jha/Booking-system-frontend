"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  CheckCircle2,
  Calendar,
  Users,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Experience {
  name: string;
  location: string;
  price: number;
}

interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
  bookingDate: string;
  quantity: number;
  total: number;
  status: string;
  refId: string;
  Experience: Experience;
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const API_BASE =
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) || "http://localhost:5000";

  useEffect(() => {
    const fetchLatestBooking = async () => {
      if (!tourId) return;

      try {
        const res = await fetch(`${API_BASE}/api/bookings/${tourId}`);
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
        setTimeout(() => setIsVisible(true), 150);
      }
    };

    fetchLatestBooking();
  }, [tourId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-600">
        Loading booking details...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-600">
        <p>Booking not found </p>
        <Link href="/">
          <Button className="mt-4 bg-[#FDB913] hover:bg-[#FDB913]/90 text-black">
            Go Home
          </Button>
        </Link>
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

          <Button className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium">
            Contact
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto px-4 py-16">
        <div
          className={`max-w-2xl mx-auto transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your booking <b>{booking.refId}</b> has been successfully
              confirmed. A confirmation email has been sent to{" "}
              <b>{booking.email}</b>.
            </p>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6 pb-6 border-b">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Booking Ref
                </div>
                <div className="font-mono font-semibold text-lg">
                  {booking.refId}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">
                  Booking Date
                </div>
                <div className="font-semibold">
                  {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="font-semibold mb-2">Experience Details</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="font-semibold text-lg mb-1">
                    {booking.Experience?.name}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {booking.Experience?.location}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    Tour Date
                  </div>
                  <div className="font-semibold">
                    {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="w-4 h-4" />
                    Guests
                  </div>
                  <div className="font-semibold">
                    {booking.quantity} guest(s)
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Total Amount Paid
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ₹{booking.total}
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 mb-6 bg-blue-50">
            <h2 className="font-semibold mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                <span>
                  You’ll receive your e-ticket and voucher shortly via email.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                <span>
                  Our team will contact you 24 hours before your trip.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                <span>Please arrive 15 minutes before the scheduled time.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                <span>Carry a valid ID and booking confirmation.</span>
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 mb-6">
            <h2 className="font-semibold mb-3">Need Help?</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email us</div>
                  <div className="font-medium">ayush.kumar9334@gmai.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Call us</div>
                  <div className="font-medium">+91 91176 85337</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                Back to Home
              </Button>
            </Link>
            <Button
              className="flex-1 bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-medium h-12"
              onClick={() => window.print()}
            >
              Download Receipt
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
