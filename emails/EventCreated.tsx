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

export interface EventCreatedProps {
  eventName: string;
  posterUrl: string;
  cleanedEventName: string;
  hostName: string;
  hostUsername: string;
}

export default function TicketPurchased({
  eventName,
  posterUrl = "poster_coming_soon",
  cleanedEventName,
  hostName,
  hostUsername,
}: EventCreatedProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                Congrats On Listing Your Event!
              </Heading>
              <Text>
                Your event, <strong>{eventName}</strong>, is live on Treasure.
              </Text>
            </Section>

            <BodySection>
              <Img
                className="m-auto rounded-[.8rem]"
                src={`https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/${posterUrl}`}
                alt="event-poster"
                width="400"
                height="auto"
              />
              <Heading className="font-normal mt-6 text-left">
                {eventName}
              </Heading>
              <Button
                className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                href={`https://www.ontreasure.com/events/${cleanedEventName}`}
              >
                View Event
              </Button>
              <Heading className="text-foreground/80 font-normal" as="h5">
                Edit your event details{" "}
                <a
                  href={`https://www.ontreasure.com/host/events/${cleanedEventName}/edit`}
                >
                  here
                </a>
                , and see below for tips on how to manage your event
              </Heading>
            </BodySection>

            <BodySection>
              <Heading as="h4" className="text-left font-bold">
                Thanks for using Treasure, {hostName}
              </Heading>
              <Heading
                className="text-foreground/80 font-normal text-left"
                as="h5"
              >
                These steps can help to drive more people to your event:
              </Heading>
              <LineBreak />
              <Row>
                <Column className="bg-green-600 text-foreground font-normal w-[2rem] rounded-full p-0">
                  1
                </Column>
                <Column className="text-left w-60 pl-4 font-normal">
                  Share the{" "}
                  <a
                    href={`https://www.ontreasure.com/events/${cleanedEventName}`}
                  >
                    event page URL
                  </a>{" "}
                  on your social media and Instagram story
                </Column>
              </Row>
              <LineBreak />
              <Row>
                <Column className="bg-green-600 text-foreground font-normal w-[2rem] rounded-full p-0">
                  2
                </Column>
                <Column className="text-left w-60 pl-4 font-normal">
                  Update your{" "}
                  <a href={`https://www.ontreasure.com/u/${hostUsername}`}>
                    profile
                  </a>{" "}
                  on Treasure to include a profile picture, username, and bio
                </Column>
              </Row>
              <LineBreak />
              <Row>
                <Column className="bg-green-600 text-foreground font-normal w-[2rem] rounded-full p-0">
                  3
                </Column>
                <Column className="text-left w-60 pl-4 font-normal">
                  Add the{" "}
                  <a
                    href={`https://www.ontreasure.com/events/${cleanedEventName}`}
                  >
                    event page URL
                  </a>{" "}
                  to your "link in bio" and website
                </Column>
              </Row>
              <LineBreak />
              <Row>
                <Column className="bg-green-600 text-foreground font-normal w-[2rem] rounded-full p-0">
                  4
                </Column>
                <Column className="text-left w-60 pl-4 font-normal">
                  Make a post on social media to let people know they can get
                  tickets online
                </Column>
              </Row>
              <LineBreak />
              <Row className="mb-6">
                <Column className="bg-green-600 text-foreground font-normal w-[2rem] rounded-full p-0">
                  5
                </Column>
                <Column className="text-left w-60 pl-4 font-normal">
                  Set up your{" "}
                  <a href="https://www.ontreasure.com/host">payout info</a> so
                  you get paid for sales on Treasure.
                </Column>
              </Row>
              <Button
                className="bg-primary text-foreground font-normal rounded-sm px-6 py-4"
                href={`https://www.ontreasure.com/host/events/${cleanedEventName}`}
              >
                Manage Your Event Now
              </Button>
            </BodySection>

            <NeedHelp />
            <Footer />
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
