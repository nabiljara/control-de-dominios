import { notificationStatusConfig } from "@/constants";
import { Notification } from "@/db/schema";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";
import { Badge } from "./ui/badge";
import { formatDate } from "@/lib/utils";

export function NotificationCard(
  { notification,
    setOpen,
    isUnread
  }:
    {
      notification: Notification,
      setOpen: Dispatch<SetStateAction<boolean>>,
      isUnread: boolean
    }
) {
  const { domainId, message, status, createdAt } = notification;
  const { border, badge, iconClassName, text, icon } = notificationStatusConfig[status];
  return (
    notification.status !== 'Simple' ? (
      <Link
        href={`/domains/${domainId}`}
        className={`group block bg-background hover:bg-muted hover:shadow-md p-4 border rounded-lg transition-all mb-3 ${border}`}
        onClick={() => setOpen(false)}
      >
        <div className="relative flex flex-col items-start gap-3">
          {!isUnread && <span className="-top-2 -right-2 absolute bg-blue-500 rounded-full w-2 h-2"></span>}
          <div className="flex items-center gap-2 mb-1.5 w-full">
            {React.createElement(icon, { className: iconClassName })}
            <Badge variant="outline" className={badge}>
              {status}
            </Badge>
            <span className="flex-1 justify-end text-muted-foreground text-sm text-end">{formatDate(createdAt)}</span>
          </div>
          <p className={`text-sm font-medium ${text} mb-1`}>{message} {`Id de notificación: ${notification.id}`}</p>
        </div>
      </Link>
    ) : (
      <div
        className={`group block bg-background hover:bg-muted hover:shadow-md p-4 border rounded-lg transition-all mb-3 ${border}`}
      >
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 mb-1.5 w-full">
            {React.createElement(icon, { className: iconClassName })}
            <Badge variant="outline" className={badge}>
              {status}
            </Badge>
            <span className="flex-1 justify-end text-muted-foreground text-sm text-end">{formatDate(createdAt)}</span>
          </div>
          <p className={`text-sm font-medium ${text} mb-1`}>{message}</p>
        </div>
      </div>
    )
  )
}
