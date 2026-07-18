import SiteFooter from "@/components/guest/site-footer";
import { Phone, Mail, MapPin, Map, Clock } from "lucide-react";

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
  {
    icon: Clock,
    label: "Front Desk",
    value: "Open 24 hours, 7 days a week",
  },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-charcoal pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
            — Contact Us
          </p>
          <h1 className="mb-4 font-heading text-4xl font-light text-cream sm:text-5xl">
            We&apos;d Love to Hear from You
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-cream/60">
            Whether you have a question about bookings, services, or special
            requests, our team is here to help.
          </p>
        </div>
      </section>

      <section className="bg-cream py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact details */}
            <div>
              <h2 className="mb-8 font-heading text-2xl font-light text-charcoal">
                Get in Touch
              </h2>
              <div className="flex flex-col gap-6">
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
            </div>

            {/* Map placeholder */}
            <div>
              <h2 className="mb-8 font-heading text-2xl font-light text-charcoal">
                Find Us
              </h2>
              <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-charcoal/10 bg-charcoal/5">
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

      <SiteFooter />
    </>
  );
}
