import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Container,
  Heading,
  Row,
  Column,
  Html,
  Section,
  Text,
  Img,
} from "@react-email/components";

export interface VendorAppRejectedEmailProps {
  eventName: string;
  posterUrl: string;
  message: string;
}

export default function VendorAppRejected({
  eventName = "SuperCon NYC",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  message = "Unfortunately, we've decided to reject your vendor application. We look for vendors that have a strong social media presence and a large following. We hope you understand and we hope to see you at the event!",
}: VendorAppRejectedEmailProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-center font-normal">
                You were not selected to be a vendor at{" "}
                <strong>{eventName}</strong>
              </Heading>
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
              {message.length > 0 && (
                <Section className="my-6">
                  <Heading className="font-bold text-sm text-left">
                    Message from the event host:
                  </Heading>
                  <Text className="text-left">{message}</Text>
                </Section>
              )}
            </Section>
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
