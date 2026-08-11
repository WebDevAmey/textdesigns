import Navbar from "@/components/home/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedAnimations from "@/components/home/FeaturedAnimations";
import AnimatedCTA from "@/components/home/AnimatedCTA";
import Footer from "@/components/home/Footer";



export default function Home() {
  return (
    <main className="bg-white text-black">
      <Navbar />
      <Hero />
      <FeaturedAnimations/>
      <AnimatedCTA/>
      <Footer />
    </main>
  );
}