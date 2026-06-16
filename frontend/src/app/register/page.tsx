import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <Card className="w-full space-y-6">
        <div>
          <p className="text-caption uppercase tracking-[0.2em] text-slate-400">Create account</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white">Register</h1>
        </div>
        <form className="space-y-4">
          <Input label="Full name" placeholder="Jane Doe" />
          <Input label="Email" type="email" placeholder="jane@company.com" />
          <Input label="Password" type="password" placeholder="Create a password" />
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </Card>
    </main>
  );
}
