import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Button,
  Container,
  Heading,
  Hr,
  Html,
  Section,
  Text,
} from "@react-email/components";

export default function Welcome({ firstName = "John" }: { firstName: string }) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-secondary font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Section className="text-center">
              <Heading>Treasure</Heading>
            </Section>
            <Hr />
            <Section>
              <Heading className="text-center font-normal">
                Welcome, <strong>{firstName}</strong>!
              </Heading>
              <Text className="text-center">
                Treasure lets you explore card and collectible events near you!
                You can now see all your favorite vendors and events in one
                place.
              </Text>
            </Section>
            <Section className="text-center my-6">
              <Button
                className="bg-primary ml-auto p-4 rounded-full text-foreground"
                href="https://ontreasure.xyz/events"
              >
                Explore Events
              </Button>
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
