import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SearchableSelect() {
  return (
    <div className="w-[600px]">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            Select user...
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-2 border-b pb-4">
              <Input placeholder="Buscar" className="flex-1" />
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {/* Usuario 1 */}
              <div className="group rounded-lg border p-4 hover:bg-accent">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Lucca Mansilla</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Rol</div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Software Developer
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      LinkedIn URL
                      <span className="ml-2">https://www.linkedin.com/example1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Area</div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Desarrollo
                      </Badge>
                    </div>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Lucca Mansilla" />
                    <AvatarFallback>LM</AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Usuario 2 */}
              <div className="group rounded-lg border p-4 hover:bg-accent">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="font-medium">Nabil Jara</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Rol</div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Software Developer
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      LinkedIn URL
                      <span className="ml-2">www.linkedin.com/in/example2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">Area</div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Desarrollo
                      </Badge>
                    </div>
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Nabil Jara" />
                    <AvatarFallback>NJ</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}