import LineBreak from "./LineBreak";
import { Heading, Text, Link, Section } from "@react-email/components";

export default function NeedHelp() {
  return (
    <Section
      className={`rounded-[1rem] border-foreground/80 p-4 w-full text-center mb-6 bg-foreground/10`}
    >
      <Heading as="h3" className="text-left font-bold">
        Need Help?
      </Heading>
      <LineBreak />
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
    </Section>
  );
}
