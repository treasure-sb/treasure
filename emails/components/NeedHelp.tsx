import BodySection from "./Section";
import { Heading, Hr, Text, Link } from "@react-email/components";

export default function NeedHelp() {
  return (
    <BodySection>
      <Heading as="h2" className="font-normal text-left">
        Need Help?
      </Heading>
      <Hr className="border-foreground/40 my-6" />
      <Text className="text-left text-foreground/80">
        Visit our{" "}
        <Link
          className="font-semibold text-foreground underline"
          href="https://app.formbricks.com/s/cls9piboz4960sted3d1snwj2"
        >
          Help Center
        </Link>{" "}
        or for urgent help, contact us at{" "}
        <span className="text-foreground font-semibold">
          george@ontreasure.xyz
        </span>
        .
      </Text>
    </BodySection>
  );
}
