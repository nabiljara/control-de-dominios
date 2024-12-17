import React from 'react'
import CreateDomainForm from './_components/create-domain-form'
import { getProviders } from '@/actions/provider-actions'
import { getActiveClients } from '@/actions/client-actions'

export default async function DomainCreatePage() {
  const providers = await getProviders()
  const clients = await getActiveClients()
  return (
    <CreateDomainForm providers={providers} clients={clients} />
  )
}
