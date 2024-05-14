import { Heading, Row, Column, Img, Section } from "@react-email/components";

export default function Footer() {
  return (
    <Section>
      <Row>
        <Column className="text-left">
          <Img
            src="https://www.ontreasure.xyz/static/logo.png"
            alt="logo"
            width="120"
            height="auto"
          />
        </Column>
        <Column>
          <Heading className="font-normal text-right" as="h4">
            Brooklyn, NY &copy; 2024
          </Heading>
        </Column>
      </Row>
    </Section>
  );
}
