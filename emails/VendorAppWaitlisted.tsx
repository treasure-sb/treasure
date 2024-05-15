import Footer from "./components/Footer";
import Header from "./components/Header";
import NeedHelp from "./components/NeedHelp";
import BodySection from "./components/Section";
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
  Link,
  Hr,
} from "@react-email/components";

export interface VendorAppAcceptedEmailProps {
  eventName: string;
  posterUrl: string;
  message: string;
  checkoutSessionId: string;
}

export default function VendorAppWaitlisted({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  message = "Unfortunately, we have received a large number of application and cannot accommodate everyone at this time. However, we have added you to our waitlist. If a spot becomes available, we will reach out to you with further instructions",
}: VendorAppAcceptedEmailProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="text-left font-normal">
                You've been waitlisted
              </Heading>
              <Text className="text-left">
                Hi there, thank you for your application to be a vendor at{" "}
                {eventName}. While we've currently filled our initial spots,
                we're excited to inform you that you've been placed on our
                waitlist.
              </Text>
            </Section>
            <BodySection>
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
              <Section>
                {message.length > 0 && (
                  <Section>
                    <Heading className="font-bold text-sm text-left">
                      Message from the event host:
                    </Heading>
                    <Text className="text-left">{message}</Text>
                  </Section>
                )}
                <Text className="text-left">
                  We appreciate your understanding and hope to see you at the
                  event, whether as a vendor or an attendee. Stay tuned for
                  further updates!
                </Text>
              </Section>
            </BodySection>
            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
