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

export default function VendorAppReceived({
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  eventName = "your Event",
}: {
  posterUrl: string;
  eventName: string;
}) {
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
                Someone applied to <strong>{eventName}</strong>!
              </Heading>
              <Text className="text-center">
                To see the application please click the link below. Note that
                the vendor will not be able to purchase any tables until you
                accept them.
              </Text>
              <Img
                className="m-auto rounded-md"
                src={posterUrl}
                alt="event-poster"
                width="300"
                height="auto"
              />
            </Section>
            <Section className="text-center my-6">
              <Button
                className="bg-primary ml-auto p-4 rounded-full text-foreground"
                href="https://ontreasure.xyz/host"
              >
                View Application
              </Button>
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
