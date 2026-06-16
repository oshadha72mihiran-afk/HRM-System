import { Button } from './Button';

export function FileUpload() {
  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-sm text-slate-300">
      <div>
        <p className="font-medium text-white">Upload documents</p>
        <p className="mt-1 text-slate-400">PDF, JPG, JPEG, and PNG files up to 5 MB each.</p>
      </div>
      <label className="block cursor-pointer rounded-xl border border-white/10 bg-surface/90 p-4 text-center transition hover:border-primary/50">
        <input className="hidden" multiple type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" />
        <span className="text-slate-200">Choose files or drag them here</span>
      </label>
      <Button type="button" variant="secondary" className="w-full">Attach documents</Button>
    </div>
  );
}
