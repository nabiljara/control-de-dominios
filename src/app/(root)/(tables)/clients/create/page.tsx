import { getLocalities } from '@/actions/locality-actions'
import { getProviders } from '@/actions/provider-actions'
import { CreateClientForm } from '@/app/(root)/(tables)/clients/create/_components/create-client-form'

export default async function CreateClientPage() {
  const providers = await getProviders()
  const localities = await getLocalities()

  return (
    <CreateClientForm providers={providers} localities={localities}/>
  )
}
