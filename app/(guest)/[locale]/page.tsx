import HeroSection from "@/components/guest/hero-section";
import AmenitiesSection from "@/components/guest/amenities-section";
import RoomsSection from "@/components/guest/rooms-section";
import DiningSection from "@/components/guest/dining-section";
import AboutSection from "@/components/guest/about-section";
import GallerySection from "@/components/guest/gallery-section";
import ContactSection from "@/components/guest/contact-section";
import SiteFooter from "@/components/guest/site-footer";

export default function GuestHomePage() {
  return (
    <>
      <HeroSection />
      <AmenitiesSection />
      <RoomsSection />
      <DiningSection />
      <AboutSection />
      <GallerySection />
      <ContactSection />
      <SiteFooter />
    </>
  );
}
