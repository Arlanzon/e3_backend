import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginForm() {
  return (
    <form className="space-y-5" action="#" method="post">
      <Input
        id="email"
        name="email"
        type="email"
        label="Correo electronico"
        placeholder="tu@correo.com"
        autoComplete="email"
        required
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Contrasena"
        placeholder="********"
        autoComplete="current-password"
        required
      />

      <Button type="submit" className="w-full" size="lg">
        Iniciar sesion
      </Button>

      <p className="rounded-lg border border-[#E8E4DE] bg-[#FAFAF7] px-4 py-3 text-sm text-[#6B6B6B]">
        Este acceso es visual y mock. La autenticacion real se conectara en una
        fase posterior.
      </p>

      <p className="text-center text-sm text-[#6B6B6B]">
        No tienes cuenta?{' '}
        <Link
          href="/registro"
          className="font-semibold text-[#1A3A2A] transition hover:text-[#C4622D]"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  )
}
