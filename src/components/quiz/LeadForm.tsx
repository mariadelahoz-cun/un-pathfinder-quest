import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveLead } from "@/lib/quiz-api";

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

type FieldErrors = Partial<Record<keyof z.infer<typeof leadSchema>, string>>;

export function LeadForm({
  resultId,
  programName,
  onDone,
}: {
  resultId: string | null;
  programName: string;
  onDone: () => void;
}) {
  const [values, setValues] = useState({ fullName: "", email: "", phone: "", city: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
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

  if (sent) {
    return (
      <div className="animate-step-in space-y-4 rounded-3xl border border-accent/50 bg-accent/10 p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-accent" />
        <h2 className="font-display text-3xl text-accent">Listo, quedaste registrado</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Un asesor académico te va a contactar para contarte más sobre{" "}
          <strong className="text-foreground">{programName}</strong>: fechas de inicio, costos,
          becas y cómo se cursa. También te llega el resultado detallado a tu correo.
        </p>
      </div>
    );
  }

  const field = (
    name: keyof typeof values,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm">
        {label}
      </Label>
      <Input
        id={name}
        value={values[name]}
        onChange={(event) => setValues((current) => ({ ...current, [name]: event.target.value }))}
        className="h-12 rounded-2xl border-border bg-secondary/70 text-base placeholder:text-muted-foreground focus-visible:ring-accent"
        {...props}
      />
      {errors[name] ? <p className="text-xs text-destructive">{errors[name]}</p> : null}
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-border/70 bg-card p-5">
      <div className="space-y-1">
        <h2 className="font-display text-3xl text-accent">Recibe el resultado completo</h2>
        <p className="text-sm text-muted-foreground">
          Te enviamos el detalle del programa y un asesor de admisiones te escribe para resolver
          dudas concretas. Nada de spam.
        </p>
      </div>
      {field("fullName", "Nombre completo", { placeholder: "María Fernanda Torres", maxLength: 100 })}
      {field("email", "Correo", {
        type: "email",
        placeholder: "tucorreo@ejemplo.com",
        maxLength: 255,
      })}
      {field("phone", "Celular", { type: "tel", placeholder: "300 123 4567", maxLength: 20 })}
      {field("city", "Ciudad", { placeholder: "Barranquilla", maxLength: 80 })}
      <Button
        type="submit"
        disabled={sending}
        className="h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
      >
        {sending ? <Loader2 className="size-5 animate-spin" /> : "Quiero que me contacten"}
      </Button>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Al enviar autorizas a la CUN a contactarte con información de admisiones sobre este
        programa.
      </p>
    </form>
  );
}
