import Footer from "./components/Footer";
import Header from "./components/Header";
import NeedHelp from "./components/NeedHelp";
import BodySection from "./components/Section";
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
  Link,
} from "@react-email/components";

export interface HostMessageProps {
  eventName: string;
  hostName: string;
  posterUrl: string;
  message: string;
}

export default function HostMessage({
  eventName = "Garden State Card Show",
  hostName = "Mochito",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  message = "Due to the snowstorm, our show will be postponed from 10am to 11am. Vendor set up has been postponed from 8am to 9am. Sorry for any inconvenience this may cause.",
}: HostMessageProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Hey, {hostName} just sent you a message for {eventName}
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
                <Section className="mt-6">
                  <Heading className="font-bold text-sm text-left">
                    Message from the event host:
                  </Heading>
                  <Text className="text-left whitespace-pre-line">
                    {message}
                  </Text>
                </Section>
              )}
            </BodySection>
            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
