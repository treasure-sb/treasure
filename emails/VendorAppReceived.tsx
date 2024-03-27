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
} from "@react-email/components";

export default function VendorAppReceived({
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  eventName = "Garden State Card Show",
}: {
  posterUrl: string;
  eventName: string;
}) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-center font-normal">
                Someone applied to <strong>{eventName}</strong>!
              </Heading>
              <Text>
                To see the application please click the link below. Note that
                the vendor will not be able to purchase any tables until you
                accept them.
              </Text>
            </Section>
            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center">
              <Img
                className="m-auto rounded-[2.5rem]"
                src={posterUrl}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <Heading className="font-normal mt-6 text-left">
                {eventName}
              </Heading>
              <Button
                className="bg-primary ml-auto p-4 rounded-lg text-background"
                href="https://ontreasure.xyz/host"
              >
                View Application
              </Button>
            </Section>
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
