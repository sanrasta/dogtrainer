import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarRange } from "lucide-react";
import Link from "next/link";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { formatEventDescription } from "@/lib/formatters";
import { CopyEventButton } from "@/components/CopyEventButton";
import { cn } from "@/lib/utils";

export default async function EventsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
    orderBy: ({ createdAt }, { desc }) => [desc(createdAt)],
  });

  return (
    <>
      <div className="flex gap-4 items-center">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
          Events
        </h1>
        <Button asChild>
          <Link href="/events/create">
            <CalendarPlus className="mr-4 size-6" /> New Event
          </Link>
        </Button>
      </div>
      {events.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} {...event} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <CalendarRange className="size-16 mx-auto" />
          <p>You Don't Have Any Events Yet. Create One to get started!</p>
          <Button size="lg" className="text-lg" asChild>
            <Link href="/events/create">
              <CalendarPlus className="mr-4 size-6" /> New Event
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}

type EventCardProps = {
  id: string;
  isActive: boolean;
  name: string;
  durationInMinutes: number;
  description: string | null;
  clerkUserId: string;
};

function EventCard({
  id,
  isActive,
  name,
  durationInMinutes,
  description,
  clerkUserId,
}: EventCardProps) {
  return (
    <Card className={cn("flex flex-col", !isActive && "opacity-80")}>
      <CardHeader className={cn(!isActive && "opacity-50")}>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description != null && (
        <CardContent className={cn(!isActive && "opacity-50")}>
          {description}
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        {isActive && (
          <CopyEventButton
            variant="outline"
            eventId={id}
            clerkUserId={clerkUserId}
          />
        )}
        <Button asChild>
          <Link href={`/events/${id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}