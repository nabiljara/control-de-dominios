import { ContactWithRelations } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, Handshake, Tag, CalendarArrowUp, User } from "lucide-react"
import { sizeConfig, statusConfig } from "@/constants"
import { formatDate } from "@/lib/utils"


export function ContactInfoCard({
  contact
}: {
  contact: ContactWithRelations
}) {

  return (
    <Card className="bg-white shadow-md rounded-lg w-full overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex md:flex-row flex-col md:justify-between items-start gap-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="flex justify-between items-center gap-2 mb-2 font-bold text-3xl"><User className="w-8 h-8"/>{contact.name}</CardTitle>
            <div className='flex items-center gap-2'>
              <Tag className="w-4 h-4" />
              <span className="inline-flex items-center px-2.5 py-0.5 border rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-semibold text-xs transition-colors">
                {contact?.type}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarArrowUp className="w-4 h-4" />
              <span className="text-gray-600 text-sm">{formatDate(contact.createdAt)}</span>
            </div>
          </div>
          <Badge variant='outline' className={`${statusConfig[contact.status].color} w-fit`}>
            {contact.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <div className={`gap-6 grid grid-cols-1 ${contact.client && !contact.phone ? 'xl:grid-cols-2' : contact.client && contact.phone ? 'xl:grid-cols-3' : 'xl:grid-cols-1'}`} >
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-gray-400 shrink-0" />
            <span className="text-gray-600 text-lg">{contact.email}</span>
          </div>
          {contact.phone &&
            <div className="flex xl:justify-center items-center space-x-3">
              <Phone className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600 text-lg">{contact.phone}</span>
            </div>
          }
          {
            contact.client &&
            <div className="flex xl:justify-center items-center space-x-3">
              <Handshake className="w-6 h-6 text-gray-400" />
              <span className="text-gray-600 text-lg">{contact.client.name}</span>
              <Badge variant='outline' className={sizeConfig[contact.client.size].color}>{contact.client.size}</Badge>
            </div>
          }
        </div>
      </CardContent>
    </Card>
  )
}
