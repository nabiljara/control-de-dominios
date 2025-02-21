import React from 'react'
import CreateDomainForm from './_components/create-domain-form'
import { getProviders } from '@/actions/provider-actions'
import { getActiveClients } from '@/actions/client-actions'
import { getContactsByClientId } from '@/actions/contacts-actions'

export default async function DomainCreatePage() {
  const providers = await getProviders()
  const clients = await getActiveClients()
  const kernelContacts = await getContactsByClientId(1)

  return (
    <div className='p-8'>
      <CreateDomainForm providers={providers} clients={clients} kernelContacts={kernelContacts} />
    </div>
  )
}
