import AuthCard from '@/components/auth/AuthCard'
import RegisterForm from '@/components/auth/RegisterForm'
import PageContainer from '@/components/layout/PageContainer'

export default function RegistroPage() {
  return (
    <PageContainer className="flex min-h-[calc(100vh-96px)] items-center py-12">
      <AuthCard
        eyebrow="Cuenta"
        title="Registro"
        description="Crea una cuenta para gestionar tus reservaciones favoritas."
      >
        <RegisterForm />
      </AuthCard>
    </PageContainer>
  )
}
