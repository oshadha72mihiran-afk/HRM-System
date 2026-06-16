import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <Card className="w-full space-y-6">
        <div>
          <p className="text-caption uppercase tracking-[0.2em] text-slate-400">Welcome back</p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-white">Sign in</h1>
        </div>
        <form className="space-y-4">
          <Input label="Email" type="email" placeholder="you@company.com" />
          <Input label="Password" type="password" placeholder="Enter your password" />
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Card>
    </main>
  );
}
