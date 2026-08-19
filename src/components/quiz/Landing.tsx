import { useState, type FormEvent } from "react";
import { Clock, Mail, Sparkles, User } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroImage from "@/assets/hero-reto-cun.png";
import { quizSteps } from "@/data/questions";
import { useQuiz } from "@/context/quiz-context";
import { saveBrochureRequest } from "@/lib/quiz-api";
import { cn } from "@/lib/utils";

const brochureSchema = z.object({
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
});

type FieldName = keyof z.infer<typeof brochureSchema>;
type FieldErrors = Partial<Record<FieldName, string>>;

export function Landing() {
  const { start, setLead } = useQuiz();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({ fullName: "", email: "" });
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = brochureSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as FieldName;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      setTouched({ fullName: true, email: true });
      return;
    }
    // No se espera la respuesta del servidor a propósito: todavía no hay
    // envío de correo montado, y una llamada lenta o fallida no debe frenar
    // el arranque del reto.
    saveBrochureRequest(parsed.data).catch(() => undefined);
    setLead(parsed.data);
    setOpen(false);
    start();
  };

  return (
    <section className="mx-auto flex min-h-[85vh] max-w-2xl flex-col items-center justify-center gap-8 py-10 text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
        <Sparkles className="size-3.5" /> Semana CUN
      </span>

      <div className="space-y-4">
        <h1 className="font-display text-5xl leading-[1.05] text-accent sm:text-6xl">
          Descubre tu Especialización CUN
        </h1>
        <p className="text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
          {quizSteps.length} pasos rápidos, entre preguntas y juegos, para ver cuál de nuestras
          especializaciones encaja con tu forma de pensar y con lo que quieres lograr. Al final te
          decimos el porcentaje de afinidad y por qué.
        </p>
      </div>

      <img
        src={heroImage}
        alt="Ilustración de tres personas eligiendo entre tarjetas con íconos de gestión, datos, ideas y estudio"
        width={1024}
        height={1024}
        className="animate-float-slow w-56 sm:w-72"
      />

      <div className="w-full space-y-4">
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="h-14 w-full rounded-2xl bg-accent-gradient text-lg font-semibold text-accent-foreground shadow-soft transition-transform hover:scale-[1.02] hover:opacity-95"
        >
          Comenzar el reto
        </Button>
        <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="size-4" /> Toma menos de 5 minutos
        </p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl border-border/70 bg-card p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-accent">
              Antes de empezar
            </DialogTitle>
            <DialogDescription>
              Te mandamos a este correo un brochure con el detalle de las especializaciones.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-sm">
                Nombre completo
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={values.fullName}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, fullName: event.target.value }))
                  }
                  onBlur={() => setTouched((current) => ({ ...current, fullName: true }))}
                  placeholder="María Fernanda Torres"
                  maxLength={100}
                  className={cn(
                    "h-12 rounded-2xl border-border bg-secondary/70 pl-10 text-base placeholder:text-muted-foreground focus-visible:ring-accent",
                    touched.fullName && errors.fullName && "border-destructive/60",
                  )}
                />
              </div>
              {touched.fullName && errors.fullName ? (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm">
                Correo
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={values.email}
                  onChange={(event) =>
                    setValues((current) => ({ ...current, email: event.target.value }))
                  }
                  onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                  placeholder="tucorreo@ejemplo.com"
                  maxLength={255}
                  className={cn(
                    "h-12 rounded-2xl border-border bg-secondary/70 pl-10 text-base placeholder:text-muted-foreground focus-visible:ring-accent",
                    touched.email && errors.email && "border-destructive/60",
                  )}
                />
              </div>
              {touched.email && errors.email ? (
                <p className="text-xs text-destructive">{errors.email}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
            >
              Comenzar el reto
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
