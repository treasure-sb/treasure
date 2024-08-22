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

export interface TicketPurchasedProps {
  eventName: string;
  posterUrl: string;
  ticketType: string;
  quantity: number;
  location: string;
  date: string;
  guestName: string;
  totalPrice: string;
  eventInfo: string;
  dinnerSelection?: string;
  fees_paid?: number | null;
}

export default function TicketPurchased({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  ticketType = "General Admission",
  quantity = 1,
  location = "8868 1st St, Los Angeles, CA 90048 United States of America",
  date = "Sat, March 3",
  guestName = "John Ventura",
  totalPrice = "$3.00",
  eventInfo = "Round 2 was the best one yet of our shows! They just get bigger and bigger and round 3 will be no exception. 3/3/24 will have free public street parking and food set up in the back of the show which includes bagel with cream cheese, butter, peanut butter and hot dogs for lunch at an affordable rate. We will have over 60 vendors showcasing the very best of their products including Pokemon, plush, one piece, yugioh and many more! Best place to spend your tax refund! The first show was inspired by corocoro mew and our tee shirt design was made and finalized. Round 3 is inspired by the world renowned classic game",
  dinnerSelection,
  fees_paid = null,
}: TicketPurchasedProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Great choice, {guestName.split(" ")[0]}
              </Heading>
              <Text>
                You're going to <strong>{eventName}</strong>
              </Text>
            </Section>

            <BodySection>
              <Img
                className="m-auto rounded-[.8rem]"
                src={posterUrl}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <Heading className="font-normal mt-6 text-left">
                {eventName}
              </Heading>
              <Button
                className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                href="https://www.ontreasure.xyz/profile/tickets"
              >
                View Tickets
              </Button>
              <Heading className="text-foreground/80 font-normal" as="h5">
                Also attached below for offline access
              </Heading>
            </BodySection>

            <BodySection>
              <Heading as="h3" className="text-left font-bold">
                Ticket Details
              </Heading>
              <LineBreak />
              <Row>
                <ColumnLabel>Ticket Type</ColumnLabel>
                <Column className="text-right">{ticketType}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Quantity</ColumnLabel>
                <Column className="text-right">{quantity}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Location</ColumnLabel>
                <Column className="text-right w-60">{location}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Date</ColumnLabel>
                <Column className="text-right">{date}</Column>
              </Row>
              <LineBreak />
              <Row className="mb-6">
                <ColumnLabel>Total Price</ColumnLabel>
                <Column className="text-right">{totalPrice}</Column>
              </Row>
              {eventName === "Sampaguita Soirée" && (
                <>
                  <LineBreak />
                  <Row className="mb-6">
                    <ColumnLabel>Dinner Selection</ColumnLabel>
                    <Column className="text-right">{dinnerSelection}</Column>
                  </Row>
                </>
              )}
            </BodySection>

            <BodySection>
              <Heading as="h3" className="text-left font-bold">
                Event Information
              </Heading>
              <LineBreak />
              <Text className="text-left text-foreground/80">{eventInfo}</Text>
            </BodySection>

            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
