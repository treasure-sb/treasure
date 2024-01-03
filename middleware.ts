import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createSupabaseServerClient from "./utils/supabase/server";
import { getProfile } from "./lib/helpers/profiles";

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

function isOrganizerPage(pathname: string) {
  const segments = pathname.split("/");
  return (
    segments.length > 3 &&
    segments[1] === "profile" &&
    segments[2] === "events" &&
    segments[3] === "organizer"
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

  const session = await supabase.auth.getSession();
  const pathname = request.nextUrl.pathname;

  // if the user is logged in and the route is /login or /signup, redirect to /
  if (
    session.data.session &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    response = NextResponse.redirect(new URL("/", request.url));
  }

  // if a signup invite token is preset and it is not valid, redirect to /signup
  if (
    pathname === "/signup" &&
    request.nextUrl.searchParams.get("signup_invite_token")
  ) {
    const token = request.nextUrl.searchParams.get("signup_invite_token");
    const verifyToken = await verifySignupInviteToken(token as string);
    if (!verifyToken) {
      response = NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  // if the user is not logged in and the route is /profile, redirect to /login
  if (!session.data.session && pathname.includes("/profile")) {
    response = NextResponse.redirect(new URL("/login", request.url));
  }

  // check to see if the route is /profile/events/organizer/[id]/...
  // if so, check to see if the user is the organizer of the event or admin
  // if not, redirect to /profile/events
  if (isOrganizerPage(pathname)) {
    const userId = session.data.session?.user.id;
    const eventName = request.nextUrl.pathname.split("/")[4];
    if (!(await isUserOrganzierOrAdmin(userId, eventName))) {
      response = NextResponse.redirect(new URL("/profile/events", request.url));
    }
  }
  return response;
}
