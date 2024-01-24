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
} from "@react-email/components";

export default function VendorAppReceived() {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-secondary font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Section className="text-center">
              <Heading>Treasure</Heading>
            </Section>
            <Hr />
            <Section>
              <Heading className="text-center font-normal">
                Someone applied to your event!
              </Heading>
              <Text className="text-center">
                To see the application please click the link below. Note that
                the vendor will not be able to purchase any tables until you
                accept them.
              </Text>
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
