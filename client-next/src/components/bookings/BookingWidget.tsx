"use client";
import React, { useState } from "react";
import { useCreateBookingMutation, useCheckAvailabilityQuery } from "@/store/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BookingWidget({ propertyId }: { propertyId: string }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const { data: availability, isFetching: isChecking } = useCheckAvailabilityQuery(
    { propertyId, startDate, endDate },
    { skip: !propertyId || !startDate || !endDate }
  );
  const router = useRouter();

  const handleSubmit = async () => {
    if (!startDate || !endDate) return alert('Select dates');
    if (availability && !availability.available) {
      alert("These dates are not available");
      return;
    }

    try {
      await createBooking({ propertyId, startDate, endDate, message }).unwrap();
      alert('Booking request sent');
      router.refresh();
    } catch (err: any) {
      if (err?.status === 401 || err?.data?.message === 'Unauthorized') {
        // redirect to login
        router.push('/auth/login');
        return;
      }
      console.error(err);
      alert('Failed to create booking');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 className="mb-2 font-semibold text-slate-900">Request booking</h4>
      <div className="flex gap-2 mb-2">
        <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-2 py-1" />
        <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="h-10 w-full rounded-md border border-slate-300 px-2 py-1" />
      </div>
      <textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Message (optional)" className="mb-2 w-full rounded-md border border-slate-300 px-2 py-1" />
      {startDate && endDate ? (
        <p className="mb-2 text-xs text-slate-500">
          {isChecking ? "Checking availability..." : availability?.available ? "Dates available" : "Dates unavailable"}
        </p>
      ) : null}
      <Button onClick={handleSubmit} disabled={isLoading || isChecking}>{isLoading? 'Sending...':'Request Booking'}</Button>
    </div>
  );
}
