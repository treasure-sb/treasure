import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Container,
  Heading,
  Hr,
  Head,
  Html,
  Section,
  Text,
  Img,
  Button,
  Row,
  Column,
  Link,
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
              <Img
                className="m-auto"
                src="https://www.ontreasure.xyz/static/logo.png"
                alt="logo"
                width="170"
                height="auto"
              />
            </Section>
            <Section>
              <Heading className="font-normal">Great choice, John</Heading>
              <Text>
                You're going to <strong>{eventName}</strong>
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
              <Button
                className="bg-tertiary text-background font-normal rounded-lg px-6 py-4"
                href="/profile/tickets"
              >
                View Tickets
              </Button>
              <Heading className="text-foreground/40 font-normal" as="h5">
                Also attached below for offline access
              </Heading>
            </Section>
            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center text-lg">
              <Heading as="h2" className="font-normal text-left">
                Ticket Details
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Ticket Type
                </Column>
                <Column className="text-right">General Admission</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Quantity
                </Column>
                <Column className="text-right">1</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Location
                </Column>
                <Column className="text-right">Elks Lodge Queens</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row>
                <Column className="text-left text-foreground/40">
                  Date & Time
                </Column>
                <Column className="text-right">Sat, March 3</Column>
              </Row>
              <Hr className="border-foreground/40 my-6" />
              <Row className="mb-6">
                <Column className="text-left text-foreground/40">
                  Total Price
                </Column>
                <Column className="text-right">$3.00</Column>
              </Row>
            </Section>
            <Section className="mb-6 border-solid border-[1px] rounded-[2.5rem] border-foreground/40 p-4 w-full text-center text-lg">
              <Heading as="h2" className="font-normal text-left">
                Event Information
              </Heading>
              <Hr className="border-foreground/40 my-6" />
              <Text className="text-left text-foreground/40">
                Round 2 was the best one yet of our shows! They just get bigger
                and bigger and round 3 will be no exception. 3/3/24 will have
                free public street parking and food set up in the back of the
                show which includes bagel with cream cheese, butter, peanut
                butter and hot dogs for lunch at an affordable rate. We will
                have over 60 vendors showcasing the very best of their products
                including Pokemon, plush, one piece, yugioh and many more! Best
                place to spend your tax refund! The first show was inspired by
                corocoro mew and our tee shirt design was made and finalized.
                Round 3 is inspired by the world renowned classic game boy game
                where the Pokemon are battling each other. Choose your game boy
                color tee theme! We will have these shirts for sale with a $200
                credit giveaway until 5/1/24!It was non stop show of giveaways
                from the very best vendors and from the customers too! Thank you
                to everyone who made this a moment to remember. Round 3
                giveaways will be announced shortly!
              </Text>
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
            <Section>
              <Row>
                <Column className="text-left">
                  <Img
                    src="https://www.ontreasure.xyz/static/logo.png"
                    alt="logo"
                    width="120"
                    height="auto"
                  />
                </Column>
                <Column>
                  <Heading className="font-normal text-right" as="h4">
                    Brooklyn, NY &copy; 2024
                  </Heading>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </TailwindConfig>
    </Html>
  );
}
