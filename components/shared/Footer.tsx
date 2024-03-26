import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-4 mt-20">
      <div className="max-w-6xl m-auto flex justify-between">
        <Link className="landing-footer-link" href="/events">
          Browse Events
        </Link>
        <Link
          className="landing-footer-link"
          href="mailto: george@ontreasure.xyz"
        >
          Contact
        </Link>
        <Link className="landing-footer-link" href="/">
          FAQ
        </Link>
        <Link className="landing-footer-link" href="/">
          Privacy
        </Link>
        <Link className="landing-footer-link" href="/profile/create-event">
          Create Event
        </Link>
      </div>

      <div className="text-center mt-10 text-xs md:text-sm">
        <h1 className="font-semibold text-xl">Treasure</h1>
        <h1>Copyright &copy; 2024</h1>
      </div>
    </footer>
  );
}
