import { getUserNotifications } from "@/actions/notifications-actions";
import { auth } from "@/auth";
import NotificationButton from "./notification-button";

export default async function Notifications() {
  const session = await auth();
  const userId = session?.user?.id;
  const notifications = await getUserNotifications(userId as string);

  if (!session) {
    return <p>Usuario no autentificado</p>;
  }
  return (
    <NotificationButton
      userNotifications={notifications}
      userId={userId as string}
    />
  );
}
