import Footer from "./components/Footer";
import Header from "./components/Header";
import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
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
              <Heading className="text-left font-normal">
                You were not selected to be a vendor
              </Heading>
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
              {message.length > 0 && (
                <Section className="my-6">
                  <Heading className="font-bold text-sm text-left">
                    Message from the event host:
                  </Heading>
                  <Text className="text-left">{message}</Text>
                </Section>
              )}
            </BodySection>

            <BodySection>
              <Heading as="h2" className="font-normal text-left">
                Need Help?
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Text className="text-left text-foreground/80">
                Visit our{" "}
                <Link
                  className="font-semibold text-foreground underline"
                  href="https://www.ontreasure.xyz"
                >
                  Help Center
                </Link>{" "}
                or for urgent help, contact us at{" "}
                <span className="text-foreground font-semibold">
                  george@ontreasure.xyz
                </span>
                .
              </Text>
            </BodySection>

            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
