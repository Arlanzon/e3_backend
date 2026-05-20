import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterForm() {
  return (
    <form className="space-y-5" action="#" method="post">
      <Input
        id="name"
        name="name"
        type="text"
        label="Nombre"
        placeholder="Tu nombre completo"
        autoComplete="name"
        required
      />

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
        autoComplete="new-password"
        required
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirmar contrasena"
        placeholder="********"
        autoComplete="new-password"
        required
      />

      <Button type="submit" className="w-full" size="lg">
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-[#6B6B6B]">
        Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#1A3A2A] transition hover:text-[#C4622D]"
        >
          Iniciar sesion
        </Link>
      </p>
    </form>
  )
}
