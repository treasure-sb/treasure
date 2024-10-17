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
import {
  UsersIcon,
  BadgeDollarSign,
  Star,
  MessageCircle,
  AppWindowIcon,
  ArrowUpRight,
} from "lucide-react";

export interface HostTablePurchasedProps {
  customerName: string;
  eventName: string;
  posterUrl: string;
  cleanedEventName: string;
  tableType: string;
  quantity: number;
  location: string;
  date: string;
  numberOfVendors: number;
  businessName: string;
}

export default function HostTablePurchased({
  customerName,
  eventName,
  posterUrl,
  cleanedEventName,
  tableType,
  quantity,
  location,
  date,
  numberOfVendors,
  businessName,
}: HostTablePurchasedProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal mt-6 text-left">
                Good news! {customerName} just submitted their table payment for{" "}
                <strong>{eventName}</strong>.
              </Heading>
              <Text>See details of the purchase below:</Text>
            </Section>

            <BodySection>
              <Img
                className="m-auto rounded-[.8rem]"
                src={posterUrl}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <Heading as="h3" className="text-left font-bold">
                Purchase Details
              </Heading>
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
                <ColumnLabel>Vendor Name</ColumnLabel>
                <Column className="text-right">{customerName}</Column>
              </Row>
              <LineBreak />
              <Row>
                <ColumnLabel>Business Name</ColumnLabel>
                <Column className="text-right">{businessName || "N/A"}</Column>
              </Row>
              <LineBreak />
              <Row>
                <Column className="text-left">
                  <Button
                    className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                    href={`https://www.ontreasure.com/host/events/${cleanedEventName}/vendors`}
                  >
                    View All Vendors
                  </Button>
                </Column>
                <Column className="text-right">
                  <Button
                    className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                    href={`https://www.ontreasure.com/host/events/${cleanedEventName}`}
                  >
                    Event Tools
                  </Button>
                </Column>
              </Row>
              <Heading className="text-foreground/80 font-normal" as="h5">
                To edit your event details or see other analytics for your
                event, click event tools
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
