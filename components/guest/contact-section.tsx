"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, Map } from "lucide-react";

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@grandrayahotel.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Grand Avenue, City Center, 10001",
  },
];

export default function ContactSection() {
  return (
    <section id="contact" className="bg-cream py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Contact Us
          </p>
          <h2 className="mb-3 font-heading text-3xl font-light text-charcoal sm:text-4xl">
            We&apos;d Love to Hear from You
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-charcoal/60">
            Whether you have a question about bookings, services, or special
            requests, our team is here to help.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-2xl border border-charcoal/10 bg-white p-6 sm:p-8">
            <form className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-charcoal/50">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    className="h-11 border-charcoal/15 bg-cream/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-charcoal/50">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 border-charcoal/15 bg-cream/50"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-charcoal/50">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="h-11 border-charcoal/15 bg-cream/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-charcoal/50">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="w-full rounded-lg border border-charcoal/15 bg-cream/50 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/30 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/20"
                />
              </div>
              <Button className="h-11 w-full bg-gold text-charcoal hover:bg-gold-light">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact details + map placeholder */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                    <item.icon className="size-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">
                      {item.label}
                    </p>
                    <p className="text-sm text-charcoal">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/5">
              {/* TODO: Replace with actual map embed */}
              <div className="flex flex-col items-center gap-2 text-charcoal/20">
                <Map className="size-8" />
                <span className="text-xs">Map Embed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
