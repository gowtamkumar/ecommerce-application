import { authOptions } from '@/lib/authOption'
import NextAuth from 'next-auth'
import { CredentialInput, CredentialsConfig } from 'next-auth/providers/index';


const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
