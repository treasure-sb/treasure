import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getProfile } from "./lib/helpers/profiles";
import { getEventFromCleanedName } from "./lib/helpers/events";
import { RoleMapKey } from "./app/(dashboards)/host/events/[name]/(tools)/team/components/ListMembers";
import createSupabaseServerClient from "./utils/supabase/server";

async function isUserEventMemberOrAdmin(
  userId: string | undefined,
  eventName: string
): Promise<{ isAllowed: boolean; role: RoleMapKey | null }> {
  const supabase = await createSupabaseServerClient();
  const { profile } = await getProfile(userId);

  const { event } = await getEventFromCleanedName(eventName);
  const { data: teamData } = await supabase
    .from("event_roles")
    .select("role")
    .eq("event_id", event.id)
    .eq("user_id", userId)
    .eq("status", "ACTIVE")
    .single();

  const teamRole = teamData ? (teamData.role as RoleMapKey) : null;

  const isAllowed: boolean = Boolean(
    event &&
      (profile!.role === "admin" ||
        (teamRole &&
          (teamRole === "STAFF" ||
            teamRole === "HOST" ||
            teamRole === "COHOST")))
  );

  return { isAllowed, role: teamRole };
}

function isOrganizerPage(pathname: string) {
  const segments = pathname.split("/");
  return (
    segments.length >= 4 && segments[1] === "host" && segments[2] === "events"
  );
}

async function verifySignupInviteToken(token: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("signup_invite_tokens")
    .select("*")
    .eq("token", token)
    .single();
  return data;
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // if the user is logged in and the route is /login or /signup, redirect to /
  if (session && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!session && pathname == "/pricing/checkout") {
    return NextResponse.redirect(
      new URL("/login?redirect=/pricing/checkout", request.url)
    );
  }
  // if a signup invite token is preset and it is not valid, redirect to /signup
  if (
    pathname === "/signup" &&
    request.nextUrl.searchParams.get("signup_invite_token")
  ) {
    const token = request.nextUrl.searchParams.get("signup_invite_token");
    const verifyToken = await verifySignupInviteToken(token as string);
    if (!verifyToken) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  // if the user is not logged in and the route is /profile, redirect to /login
  if (
    !session &&
    (pathname.includes("/profile") ||
      pathname.includes("/vendor") ||
      pathname.includes("/host"))
  ) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  const { profile } = await getProfile(session?.user?.id);
  const profileIsAdmin = profile && profile.role === "admin";

  if ((!session || !profileIsAdmin) && pathname.includes("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // check to see if the route is /host/events/[id]/...
  // if so, check to see if the user is part of the Host, Co-Host, of Staff of the event or admin
  // if not, redirect to /host/events
  if (isOrganizerPage(pathname)) {
    const userId = session?.user.id;
    const eventName = request.nextUrl.pathname.split("/")[3];
    const { isAllowed, role } = await isUserEventMemberOrAdmin(
      userId,
      eventName
    );

    if (!isAllowed) {
      return NextResponse.redirect(new URL("/host/events", request.url));
    }

    // Check if the user is a SCANNER and trying to access a restricted page
    if (role === "SCANNER") {
      const pathSegments = request.nextUrl.pathname.split("/");
      const currentPath = pathSegments[4] ? `/${pathSegments[4]}` : "/";
      const allowedPaths = ["/attendees", "/team"];

      // If the current path is not in allowedPaths and is not the root event path
      if (!allowedPaths.includes(currentPath) && currentPath !== "/") {
        return NextResponse.redirect(
          new URL(`/host/events/${eventName}`, request.url)
        );
      }
    }
  }
  return response;
}
