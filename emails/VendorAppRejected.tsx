import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Container,
  Heading,
  Hr,
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
        <Body className="bg-secondary font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Section className="text-center">
              <Heading>
                <Img
                  className="m-auto"
                  src="https://www.ontreasure.xyz/static/logo.png"
                  alt="event-poster"
                  width="170"
                  height="auto"
                />
              </Heading>
            </Section>
            <Hr />
            <Section>
              <Heading className="text-center font-normal">
                You've been not been selected to be a vendor at{" "}
                <strong>{eventName}</strong>
              </Heading>
            </Section>
            <Section className="text-center mb-6 border-2">
              {message.length > 0 && (
                <Section className="my-6">
                  <Heading className="font-bold text-sm text-left">
                    Message from the event host:
                  </Heading>
                  <Text className="text-left">{message}</Text>
                </Section>
              )}
              <Img
                className="m-auto rounded-md mt-6"
                src={posterUrl}
                alt="event-poster"
                width="220"
                height="auto"
              />
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
