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
  Img,
} from "@react-email/components";

export interface VendorAppAcceptedEmailProps {
  eventName: string;
  posterUrl: string;
  stripePriceId: string;
  vendorId: string;
  eventId: string;
  tableId: string;
  quantity: string;
  message: string;
}

export default function VendorAppAccepted({
  eventName = "SuperCon NYC",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  message = "Hey, thanks for applying as a vendor! We're excited to have you at the event.",
  stripePriceId,
  vendorId,
  eventId,
  tableId,
  quantity,
}: VendorAppAcceptedEmailProps) {
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
                You've been accepted to be a vendor at{" "}
                <strong>{eventName}</strong>!
              </Heading>
              <Text className="text-center">
                Click the link below to purchase your table! Once purchased,
                you'll appear as a vendor on the events page.
              </Text>
            </Section>
            <Section className="text-center my-2 mb-6 border-2">
              <Button
                href={`https://www.ontreasure.xyz/checkout?price_id=${stripePriceId}&user_id=${vendorId}&event_id=${eventId}&ticket_id=${tableId}&quantity=${quantity}`}
                className="bg-primary ml-auto p-4 rounded-full text-foreground"
              >
                Buy Table
              </Button>
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
