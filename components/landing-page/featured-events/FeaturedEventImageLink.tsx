"use client";

import { useState, useRef } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tables } from "@/types/supabase";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type LinkWrapperProps = {
  children: React.ReactNode;
  href: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.HTMLAttributes<HTMLDivElement>;

const LinkWrapper: React.FC<LinkWrapperProps> = ({
  children,
  href,
  ...props
}) => {
  return href !== "#" ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <div {...props}>{children}</div>
  );
};

export default function FeaturedEventImageLink({
  event,
  publicUrl,
}: {
  event: Tables<"events">;
  publicUrl: string;
}) {
  const { push } = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>
  ) => {
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (
    e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>
  ) => {
    const xMovement = Math.abs(e.clientX - startPos.current.x);
    const yMovement = Math.abs(e.clientY - startPos.current.y);
    if (xMovement < 5 && yMovement < 5 && isDragging) {
      push(`/events/${event.cleaned_name}`);
    }
    setIsDragging(false);
  };

  return (
    <LinkWrapper
      href={isDragging ? "#" : `/events/${event.cleaned_name}`}
      onMouseDown={handleMouseDown}
      onMouseUp={(e) => handleMouseUp(e)}
    >
      <AspectRatio ratio={1}>
        <Image
          priority
          draggable="false"
          className="object-cover w-full h-full rounded-t-md"
          alt="image"
          src={publicUrl}
          width={800}
          height={800}
        />
      </AspectRatio>
      <div className="text-background p-2 md:p-4 border-t-[1px] h-fit md:group-hover:bg-tertiary/70 transition duration-300 rounded-b-md">
        <h4 className="md:text-xl text-xs font-semibold truncate">
          {event.name}
        </h4>
        <h4 className="text-xs md:text-lg truncate">{event.venue_name}</h4>
      </div>
    </LinkWrapper>
  );
}
