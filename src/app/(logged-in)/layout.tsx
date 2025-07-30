import UpgradeRequired from '@/components/common/upgrade-required';
import { getSubscriptionStatus } from '@/lib/user';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'

const DashboardLayout = async ({children} : {children: React.ReactNode}) => {
    const user = await currentUser();

    if(!user){
        redirect('/sign-in');
    }

    const hasActiveSubscription = await getSubscriptionStatus(user);

    // if(!hasActiveSubscription){
    if(hasActiveSubscription){
        return <UpgradeRequired />
    }
  return (
    <div>{children}</div>
  )
}

export default DashboardLayout