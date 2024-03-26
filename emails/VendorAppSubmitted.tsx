import Footer from "./components/Footer";
import Header from "./components/Header";
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

export interface VendorAppSubmittedEmailProps {
  eventName: string;
  posterUrl: string;
  ticketType: string;
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

const testEmailValues = {
  eventName: "Garden State Card Show",
  posterUrl:
    "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  ticketType: "General Admission",
  quantity: 1,
  location: "8868 1st St, Los Angeles, CA 90048 United States of America",
  date: "Sat, March 3",
  guestName: "John Ventura",
  businessName: "John's Cards",
  itemInventory: "Pokemon, Yu-Gi-Oh, Magic the Gathering",
  totalPrice: "$3.00",
  numberOfVendors: 2,
  eventInfo:
    "Round 2 was the best one yet of our shows! They just get bigger and bigger and round 3 will be no exception. 3/3/24 will have free public street parking and food set up in the back of the show which includes bagel with cream cheese, butter, peanut butter and hot dogs for lunch at an affordable rate. We will have over 60 vendors showcasing the very best of their products including Pokemon, plush, one piece, yugioh and many more! Best place to spend your tax refund! The first show was inspired by corocoro mew and our tee shirt design was made and finalized. Round 3 is inspired by the world renowned classic game",
};

export default function VendorAppSubmitted({
  eventName = testEmailValues.eventName,
  posterUrl = testEmailValues.posterUrl,
  ticketType = testEmailValues.ticketType,
  quantity = testEmailValues.quantity,
  location = testEmailValues.location,
  date = testEmailValues.date,
  guestName = testEmailValues.guestName,
  businessName = testEmailValues.businessName,
  itemInventory = testEmailValues.itemInventory,
  totalPrice = testEmailValues.totalPrice,
  numberOfVendors = testEmailValues.numberOfVendors,
  eventInfo = testEmailValues.eventInfo,
}: VendorAppSubmittedEmailProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Thank you, {guestName.split(" ")[0]}. Your registration has been
                submitted
              </Heading>
              <Text>
                The event host will reach out shortly to confirm your table
                status and payment
              </Text>
            </Section>
            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center">
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
              <Section className="bg-foreground/20 text-foreground font-normal rounded-lg p-2 px-4 w-fit">
                Vendor Status Pending
              </Section>
              <Heading className="text-foreground/40 font-normal" as="h5">
                Need Help or Have Questions?
              </Heading>
              <Link
                href="mailto:george@ontreasure.xyz"
                className="underline text-foreground text-xs"
              >
                Get in Touch
              </Link>
            </Section>

            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center text-lg">
              <Heading as="h2" className="font-normal text-left">
                Vendor Registration Details
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Vendor Name
                </Column>
                <Column className="text-right">{guestName}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Business Name
                </Column>
                <Column className="text-right">{businessName || "N/A"}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Table Type
                </Column>
                <Column className="text-right">{ticketType}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Quantity
                </Column>
                <Column className="text-right">{quantity}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Item Inventory
                </Column>
                <Column className="text-right">{itemInventory}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Number of Vendors
                </Column>
                <Column className="text-right">{numberOfVendors}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Location
                </Column>
                <Column className="text-right w-60">{location}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">Date</Column>
                <Column className="text-right">{date}</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row className="mb-6">
                <Column className="text-left text-foreground/40">
                  Total Due on Approval
                </Column>
                <Column className="text-right">
                  <Text className="font-bold text-tertiary">{totalPrice}</Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center text-lg">
              <Heading as="h2" className="font-normal text-left">
                Event Information
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Text className="text-left text-foreground/40">{eventInfo}</Text>
            </Section>
            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center text-lg">
              <Heading as="h2" className="font-normal text-left">
                Need Help?
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Text className="text-left text-foreground/40">
                Visit our{" "}
                <Link
                  className="font-semibold text-foreground underline"
                  href="https://www.ontreasure.xyz/faq"
                >
                  Help Center
                </Link>{" "}
                or for urgent help, contact us at{" "}
                <span className="text-foreground font-semibold">
                  george@ontreasure.xyz
                </span>
                .
              </Text>
            </Section>
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
