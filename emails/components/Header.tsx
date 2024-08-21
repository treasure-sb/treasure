import { Img, Section } from "@react-email/components";

export default function Header() {
  return (
    <Section>
      <Img
        className="mx-auto"
        src="https://www.ontreasure.xyz/static/logo.png"
        alt="logo"
        width="180"
        height="auto"
      />
    </Section>
  );
}
