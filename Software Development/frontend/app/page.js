import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularDestinations from "@/components/PopularDestinations";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PopularDestinations />
      <Footer />
    </main>
  );
}