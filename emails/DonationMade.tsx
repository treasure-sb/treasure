import ColumnLabel from "./components/ColumnLabel";
import Footer from "./components/Footer";
import Header from "./components/Header";
import LineBreak from "./components/LineBreak";
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
  Button,
  Row,
  Column,
} from "@react-email/components";

export interface DonationMadeProps {
  firstName: string;
  donationAmount: string;
}

export default function TicketPurchased({
  firstName,
  donationAmount,
}: DonationMadeProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Thank you for your donation, <strong>{firstName}</strong>!
              </Heading>
              <Text>
                Your donation of <strong>{donationAmount}</strong> is on its way
                to support the relief efforts for Hurricane Helene.
              </Text>
            </Section>

            <BodySection>
              <Img
                className="m-auto rounded-[.8rem]"
                src={`https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1727819077538.jpeg`}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <LineBreak />
              <Button
                className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                href={`https://www.ontreasure.com/events/appeal-for-support-relief-efforts-for-hurricane-helene-01012025`}
              >
                Click Here to Donate Again
              </Button>
              <Heading className="text-foreground/80 font-normal" as="h5">
                100% of donations go towards supporting the relief efforts for
                Hurricane Helene.
              </Heading>
            </BodySection>

            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
