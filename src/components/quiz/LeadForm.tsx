import { useMemo, useState } from "react";
import { Building2, Check, Loader2, Mail, MapPin, Phone, Sparkles, User } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveLead } from "@/lib/quiz-api";
import type { Specialization } from "@/data/specializations";
import { cn } from "@/lib/utils";
import { SpecializationAvatar } from "./SpecializationAvatar";

const leadSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, { message: "Escribe tu nombre completo" })
    .max(100, { message: "Máximo 100 caracteres" }),
  email: z
    .string()
    .trim()
    .email({ message: "Ese correo no parece válido" })
    .max(255, { message: "Máximo 255 caracteres" }),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,20}$/, { message: "Escribe un celular válido" }),
  city: z
    .string()
    .trim()
    .min(2, { message: "Escribe tu ciudad" })
    .max(80, { message: "Máximo 80 caracteres" }),
});

type FieldName = keyof z.infer<typeof leadSchema>;
type FieldErrors = Partial<Record<FieldName, string>>;

const FIELDS: {
  name: FieldName;
  label: string;
  icon: typeof User;
  props: React.InputHTMLAttributes<HTMLInputElement>;
}[] = [
  {
    name: "fullName",
    label: "Nombre completo",
    icon: User,
    props: { placeholder: "María Fernanda Torres", maxLength: 100 },
  },
  {
    name: "email",
    label: "Correo",
    icon: Mail,
    props: { type: "email", placeholder: "tucorreo@ejemplo.com", maxLength: 255 },
  },
  {
    name: "phone",
    label: "Celular",
    icon: Phone,
    props: { type: "tel", placeholder: "300 123 4567", maxLength: 20 },
  },
  {
    name: "city",
    label: "Ciudad",
    icon: MapPin,
    props: { placeholder: "Barranquilla", maxLength: 80 },
  },
];

export function LeadForm({
  resultId,
  specialization,
  affinity,
  onDone,
}: {
  resultId: string | null;
  specialization: Specialization | undefined;
  affinity: number | undefined;
  onDone: () => void;
}) {
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", city: "" });
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const validity = useMemo(() => {
    const entries = FIELDS.map(({ name }) => {
      const result = leadSchema.shape[name].safeParse(values[name]);
      return [name, result.success] as const;
    });
    return Object.fromEntries(entries) as Record<FieldName, boolean>;
  }, [values]);

  const completedCount = FIELDS.filter(({ name }) => validity[name]).length;
  const progress = Math.round((completedCount / FIELDS.length) * 100);
  const allValid = completedCount === FIELDS.length;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as FieldName;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setTouched({ fullName: true, email: true, phone: true, city: true });
      return;
    }
    setErrors({});
    setSending(true);
    try {
      await saveLead({ resultId, ...parsed.data });
      setSent(true);
      onDone();
    } catch {
      toast.error("No pudimos guardar tus datos. Intenta de nuevo.");
    } finally {
      setSending(false);
    }
  };

  const programName = specialization?.name ?? "tu especialización";

  if (sent) {
    return (
      <div className="animate-step-in space-y-5 rounded-3xl border border-accent/50 bg-accent/10 p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          ¡Avatar desbloqueado!
        </p>
        {specialization ? (
          <div className="flex justify-center">
            <SpecializationAvatar
              specialization={specialization}
              affinity={affinity}
              size="lg"
              className="animate-pop"
            />
          </div>
        ) : null}
        <h2 className="font-display text-3xl text-accent">Listo, quedaste registrado</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Un asesor académico te va a contactar para contarte más sobre{" "}
          <strong className="text-foreground">{programName}</strong>: fechas de inicio, costos,
          becas y cómo se cursa. También te llega el resultado detallado a tu correo.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="relative space-y-5 overflow-hidden rounded-3xl border border-accent/40 bg-card p-5 shadow-soft"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent-gradient opacity-15 blur-2xl animate-float-slow"
        aria-hidden
      />

      <div className="relative flex items-center gap-4">
        {specialization ? (
          <SpecializationAvatar
            specialization={specialization}
            affinity={affinity}
            size="md"
            locked={!allValid}
            className={allValid ? "animate-pop" : undefined}
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-1">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            <Sparkles className="size-3.5" /> Último paso
          </p>
          <h2 className="font-display text-3xl leading-none text-accent">
            {allValid ? "Desbloquea tu avatar" : "Casi desbloqueas tu avatar"}
          </h2>
        </div>
      </div>

      <p className="relative text-sm text-muted-foreground">
        Completa tus datos para desbloquear tu avatar de especialista y recibir el detalle de{" "}
        <strong className="text-foreground">{programName}</strong>. Nada de spam.
      </p>

      <div className="relative space-y-1.5">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">Progreso</span>
          <span className="text-accent">
            {completedCount}/{FIELDS.length} completado
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-accent-gradient transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative space-y-4">
        {FIELDS.map(({ name, label, icon: Icon, props }) => {
          const isValid = validity[name];
          const showError = touched[name] && !isValid;
          return (
            <div key={name} className="space-y-1.5">
              <Label htmlFor={name} className="text-sm">
                {label}
              </Label>
              <div className="relative">
                <Icon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id={name}
                  value={values[name]}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, [name]: event.target.value }))
                  }
                  onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
                  className={cn(
                    "h-12 rounded-2xl border-border bg-secondary/70 pl-10 pr-10 text-base placeholder:text-muted-foreground transition-colors focus-visible:ring-accent",
                    isValid && "border-accent/60",
                    showError && "border-destructive/60",
                  )}
                  {...props}
                />
                {isValid ? (
                  <span className="animate-pop absolute right-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                ) : null}
              </div>
              {showError && errors[name] ? (
                <p className="text-xs text-destructive">{errors[name]}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      <Button
        type="submit"
        disabled={sending}
        className={cn(
          "relative h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground transition-all hover:opacity-95",
          allValid && !sending && "shadow-glow",
        )}
      >
        {sending ? (
          <Loader2 className="size-5 animate-spin" />
        ) : allValid ? (
          <>
            <Building2 className="size-4" /> Quiero que me contacten
          </>
        ) : (
          `Completa tus datos (${completedCount}/${FIELDS.length})`
        )}
      </Button>
      <p className="relative text-xs leading-relaxed text-muted-foreground">
        Al enviar autorizas a la CUN a contactarte con información de admisiones sobre este
        programa.
      </p>
    </form>
  );
}
