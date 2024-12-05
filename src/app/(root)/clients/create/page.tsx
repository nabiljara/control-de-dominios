import { getProviders } from '@/actions/provider-actions'
import { CreateClientForm } from '@/app/(root)/clients/create/_components/create-client-form'

export default async function CreateClientPage() {
  // const providers = await getProviders()
  const providers = [
    { id: 6, name: 'GoDaddy', url: 'www.godaddy.com' },
    { id: 5, name: 'DonWeb', url: 'www.donweb.com' },
    { id: 4, name: 'Hostinger', url: 'www.hostinger.com.ar' }
  ]
  return (
    <CreateClientForm providers={providers}/>
  )
}
