import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Section,
  Text,
  Img,
  Hr,
  Link,
} from "@react-email/components";
import BodySection from "./components/Section";
import NeedHelp from "./components/NeedHelp";

export default function VendorAppReceived({
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  eventName = "Garden State Card Show",
  cleanedEventName = "garden-state-card-show",
}: {
  posterUrl: string;
  eventName: string;
  cleanedEventName: string;
}) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-left font-normal">
                You have a new vendor application
              </Heading>
              <Text>
                To see the application please click the link below. Note that
                the vendor will not be able to purchase any tables until you
                accept them.
              </Text>
            </Section>
            <BodySection>
              <Img
                className="m-auto rounded-[.8rem]"
                src={posterUrl}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <Heading className="font-normal mt-6 text-left">
                {eventName}
              </Heading>
              <Button
                className="bg-primary ml-auto p-4 px-6 rounded-full text-foreground"
                href={`https://ontreasure.xyz/host/events/${cleanedEventName}/vendors`}
              >
                View Application
              </Button>
            </BodySection>

            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
