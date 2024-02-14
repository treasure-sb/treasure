import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Button,
  Container,
  Heading,
  Row,
  Column,
  Html,
  Img,
  Section,
  Text,
} from "@react-email/components";

export default function Welcome({ firstName = "John" }: { firstName: string }) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-center font-normal">
                Welcome, {firstName}!
              </Heading>
              <Text className="text-center">
                Treasure lets you explore card and collectible events near you!
                You can now see all your favorite vendors and events in one
                place.
              </Text>
            </Section>
            <Section className="text-center my-6">
              <Button
                className="bg-primary ml-auto p-4 rounded-full text-background"
                href="https://ontreasure.xyz/events"
              >
                Explore Events
              </Button>
            </Section>
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
