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
  Link,
} from "@react-email/components";

export interface TablePurchasedProps {
  eventName: string;
  posterUrl: string;
  tableType: string;
  quantity: number;
  location: string;
  date: string;
  guestName: string;
  businessName: string | null;
  itemInventory: string;
  totalPrice: string;
  numberOfVendors: number;
  eventInfo: string;
}

export default function TablePurchased({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087?width=200&height=200",
  tableType = "General Admission",
  quantity = 1,
  location = "8868 1st St, Los Angeles, CA 90048 United States of America",
  date = "Sat, March 3",
  guestName = "John Ventura",
  businessName = null,
  itemInventory = "Pokemon, Yu-Gi-Oh, Magic the Gathering",
  totalPrice = "$3.00",
  numberOfVendors = 2,
  eventInfo = "Round 2 was the best one yet of our shows! They just get bigger and bigger and round 3 will be no exception. 3/3/24 will have free public street parking and food set up in the back of the show which includes bagel with cream cheese, butter, peanut butter and hot dogs for lunch at an affordable rate. We will have over 60 vendors showcasing the very best of their products including Pokemon, plush, one piece, yugioh and many more! Best place to spend your tax refund! The first show was inspired by corocoro mew and our tee shirt design was made and finalized. Round 3 is inspired by the world renowned classic game",
}: TablePurchasedProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Congrats {guestName.split(" ")[0]}, your table is confirmed
              </Heading>
              <Text>
                Thank you for submitting your payment for{" "}
                <strong>{eventName}</strong>. Your table registration is
                complete.
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
                href="https://www.ontreasure.com/profile/tickets"
              >
                View Vendor Tickets
              </Button>
            </BodySection>

            <BodySection>
              <Heading as="h3" className="text-left font-bold">
                Vendor Registration Details
              </Heading>
              <LineBreak />
              <Row>
                <ColumnLabel>Vendor Name</ColumnLabel>
                <Column className="text-right">{guestName}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Business Name</ColumnLabel>
                <Column className="text-right">{businessName || "N/A"}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Table Type</ColumnLabel>
                <Column className="text-right">{tableType}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Quantity</ColumnLabel>
                <Column className="text-right">{quantity}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Item Inventory</ColumnLabel>
                <Column className="text-right">{itemInventory}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Number of Vendors</ColumnLabel>
                <Column className="text-right">{numberOfVendors}</Column>
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
              <Row>
                <ColumnLabel>Total Price</ColumnLabel>
                <Column className="text-right">
                  <Text className="font-bold text-tertiary">{totalPrice}</Text>
                </Column>
              </Row>
            </BodySection>

            <BodySection>
              <Heading as="h3" className="text-left font-bold">
                Event Details
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
