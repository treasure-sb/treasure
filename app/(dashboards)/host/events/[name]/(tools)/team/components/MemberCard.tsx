import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TeamMember } from "./ListMembers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoleMapKey } from "./ListMembers";

type RoleMap = {
  [key in RoleMapKey]: string;
};

export default function MemberCard({ member }: { member: TeamMember }) {
  const roleMap: RoleMap = {
    HOST: "Host",
    COHOST: "Co-Host",
    STAFF: "Staff",
    SCANNER: "Scanner",
  };

  return (
    <Card className="w-full col-span-1">
      <CardHeader>
        <CardTitle>
          {member.firstName} {member.lastName}
        </CardTitle>
        <CardDescription>{roleMap[member.role]}</CardDescription>
        <div className="flex items-center justify-center w-full">
          <Avatar className="w-28 h-28 md:w-24 md:h-24 mx-auto md:mx-0">
            <AvatarImage src={member.publicProfileUrl} />
            <AvatarFallback />
          </Avatar>
        </div>
      </CardHeader>
    </Card>
  );
}
