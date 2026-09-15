import SearchBar from "./SearchBar";

export default function Hero() {
  return (
    <section
      className="relative flex min-h-[430px] items-center justify-center bg-cover bg-center px-5"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative z-10 w-full text-center text-white">

        <h1 className="font-serif text-4xl font-bold md:text-6xl">
          Discover Your Next Adventure
        </h1>

        <p className="mt-3 text-sm md:text-base">
          Explore amazing destinations and plan unforgettable trips.
        </p>

        <div className="mt-8">
          <SearchBar />
        </div>

      </div>

    </section>
  );
}