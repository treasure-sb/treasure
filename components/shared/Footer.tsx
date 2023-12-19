import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-20 mx-auto py-10">
      <div className="max-w-6xl m-auto flex justify-between">
        <Link className="landing-footer-link" href="/events">
          Create an Event
        </Link>
        <Link className="landing-footer-link" href="/events">
          Browse Events
        </Link>
        <Link className="landing-footer-link" href="/">
          Join Newsletter
        </Link>
        <Link className="landing-footer-link" href="/events">
          Contact Us
        </Link>
      </div>

      <div className="text-center mt-10 text-xs md:text-sm">
        <h1>Copyright &copy; 2023</h1>
        <h1>Treasure</h1>
      </div>
    </footer>
  );
}
