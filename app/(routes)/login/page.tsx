import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm'
import PageContainer from '@/components/layout/PageContainer'

export default function LoginPage() {
  return (
    <PageContainer className="flex min-h-[calc(100vh-96px)] items-center py-8 sm:py-12">
      <AuthCard
        title="Login"
        description="Inicia sesion para revisar y gestionar tus reservaciones."
      >
        <LoginForm />
      </AuthCard>
    </PageContainer>
  )
}
