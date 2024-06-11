import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getProfile } from "./lib/helpers/profiles";
import createSupabaseServerClient from "./utils/supabase/server";

async function isUserOrganzierOrAdmin(
  userId: string | undefined,
  eventName: string
) {
  const { profile } = await getProfile(userId);
  const supabase = await createSupabaseServerClient();
  const { data: event } = await supabase
    .from("events")
    .select("organizer_id")
    .eq("cleaned_name", eventName)
    .single();

  return event && (event.organizer_id === userId || profile.role === "admin");
}

// segment after split = ["", "host", "events", "[id]", "..."]
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
  // if so, check to see if the user is the organizer of the event or admin
  // if not, redirect to /host/events
  if (isOrganizerPage(pathname)) {
    const userId = session?.user.id;
    const eventName = request.nextUrl.pathname.split("/")[3];
    if (!(await isUserOrganzierOrAdmin(userId, eventName))) {
      return NextResponse.redirect(new URL("/host/events", request.url));
    }
  }
  return response;
}
