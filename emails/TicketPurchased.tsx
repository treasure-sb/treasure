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

export interface TicketPurchasedProps {
  eventName: string;
  posterUrl: string;
}

export default function TicketPurchased({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
}: TicketPurchasedProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Section className="text-center">
              <Heading>
                <Img
                  className="m-auto"
                  src="https://www.ontreasure.xyz/static/logo.png"
                  alt="logo"
                  width="170"
                  height="auto"
                />
              </Heading>
            </Section>
            <Hr />
            <Section>
              <Heading className="text-center font-normal">
                You've going to <strong>{eventName}</strong>!
              </Heading>
              <Text className="text-center">
                Your ticket is attached to this email. Please present this
                ticket at the event.
              </Text>
            </Section>
            <Section className="text-center mb-6 border-2">
              <Img
                className="m-auto rounded-md mt-6"
                src={posterUrl}
                alt="event-poster"
                width="180"
                height="auto"
              />
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
