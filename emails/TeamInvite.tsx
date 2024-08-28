import { Button } from "@react-email/components";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NeedHelp from "./components/NeedHelp";
import BodySection from "./components/Section";
import TailwindConfig from "./config/TailwindConfig";
import {
  Body,
  Container,
  Heading,
  Html,
  Section,
  Text,
  Img,
} from "@react-email/components";

export interface TeamInviteProps {
  eventName: string;
  posterUrl: string;
  role: string;
  inviteToken: string;
}

export default function TeamInvite({
  eventName = "Garden State Card Show",
  posterUrl = "https://qkdlfshzugzeqlznyqfv.supabase.co/storage/v1/object/public/posters/posters1701495337087",
  role = "Co-Host",
  inviteToken = "1234567890",
}: TeamInviteProps) {
  return (
    <Html>
      <TailwindConfig>
        <Body className="bg-background font-sans text-foreground p-10">
          <Container className="bg-background border-2 max-w-lg px-10">
            <Header />
            <Section>
              <Heading className="font-normal">
                You've been invited to join {eventName}'s team!
              </Heading>
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
              <Text className="text-left whitespace-pre-line font-semibold">
                You've been invited to join the {role} team for {eventName}.
                Click the button below to accept the invitation.
              </Text>
              <Button
                href={`https://www.ontreasure.com/invite/team/${inviteToken}`}
                className="bg-primary ml-auto p-4 px-6 rounded-sm text-foreground"
              >
                View Invitation
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
