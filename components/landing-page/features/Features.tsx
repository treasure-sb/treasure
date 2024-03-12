"use client";
import Preview from "./Preview";
import Create from "./Create";
import Book from "./Book";
import LockIn from "./LockIn";

export default function Features() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6 w-full m-auto">
        <Preview />
        <Create />
        <LockIn />
        <Book />
      </div>
    </section>
  );
}
