import Navbar from "@/components/home/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section className="flex min-h-screen items-center justify-center">
        <h1 className="text-6xl font-bold">
          TextLab
        </h1>
      </section>
    </main>
  );
}