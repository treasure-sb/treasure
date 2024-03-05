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

export interface VendorAppAcceptedEmailProps {
  eventName: string;
  posterUrl: string;
  message: string;
  checkoutSessionId: string;
}

export default function VendorAppAccepted({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  message = "Hey, thanks for applying as a vendor! We're excited to have you at the event.",
  checkoutSessionId,
}: VendorAppAcceptedEmailProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-center font-normal">
                You've been accepted to be a vendor at{" "}
                <strong>{eventName}</strong>!
              </Heading>
              <Text className="text-left">
                Click the link below to purchase your table! Once purchased,
                you'll appear as a vendor on the events page.
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
                href={`https://www.ontreasure.xyz/checkout/${checkoutSessionId}`}
                className="bg-primary ml-auto p-4 rounded-lg text-background"
              >
                Buy Table
              </Button>
              {message.length > 0 && (
                <Section className="mt-6">
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
