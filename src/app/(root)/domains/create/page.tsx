import React from 'react'
import CreateDomainForm from './_components/create-domain-form'
import { getProviders } from '@/actions/provider-actions'
import { getActiveClients } from '@/actions/client-actions'

export default async function DomainCreatePage() {
  const providers = await getProviders()
  const clients = await getActiveClients()
  return (
    <div className='space-y-4 p-8'>
      <CreateDomainForm providers={providers} clients={clients} />
    </div>
  )
}
