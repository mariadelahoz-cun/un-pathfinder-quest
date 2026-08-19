import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const title = "Panel del equipo | Reto Semana CUN";
const description =
  "Resultados del reto Descubre tu Especialización CUN: participantes, especializaciones más recomendadas y prospectos registrados.";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminPage,
});

type Stats = {
  completions: number;
  leads: number;
  top: { name: string; count: number }[];
  recentLeads: { full_name: string; city: string; created_at: string }[];
  brochureRequests: number;
  recentBrochureRequests: { full_name: string; email: string; created_at: string }[];
};

function AdminPage() {
  const [session, setSession] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setSession(Boolean(next));
      if (event === "SIGNED_OUT") {
        setIsAdmin(false);
        setStats(null);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let active = true;
    setLoading(true);
    (async () => {
      // La primera persona que entra queda registrada como administradora.
      const { data: claimed } = await supabase.rpc("claim_admin");
      if (!active) return;
      if (!claimed) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const [results, leads, brochureRequests] = await Promise.all([
        supabase.from("quiz_results").select("top_program_name, created_at"),
        supabase
          .from("quiz_leads")
          .select("full_name, city, created_at")
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("quiz_brochure_requests")
          .select("full_name, email, created_at")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      if (!active) return;

      const counts = new Map<string, number>();
      (results.data ?? []).forEach((row) => {
        counts.set(row.top_program_name, (counts.get(row.top_program_name) ?? 0) + 1);
      });

      setStats({
        completions: results.data?.length ?? 0,
        leads: leads.data?.length ?? 0,
        top: [...counts.entries()]
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count),
        recentLeads: leads.data ?? [],
        brochureRequests: brochureRequests.data?.length ?? 0,
        recentBrochureRequests: brochureRequests.data ?? [],
      });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [session]);

  if (session === null) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-accent" />
      </main>
    );
  }

  if (!session) return <SignIn />;

  return (
    <main className="bg-hero min-h-screen px-4 py-8">
      <div className="mx-auto w-full max-w-2xl space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-4xl text-accent">Panel del reto</h1>
            <p className="text-sm text-muted-foreground">Resultados de la Semana CUN</p>
          </div>
          <Button
            variant="outline"
            onClick={() => supabase.auth.signOut()}
            className="rounded-2xl border-border bg-transparent"
          >
            <LogOut className="size-4" /> Salir
          </Button>
        </header>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-accent" />
          </div>
        ) : !isAdmin ? (
          <div className="rounded-3xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
            Tu cuenta no tiene permisos de administrador para ver estos datos.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-accent/40 bg-accent/10 p-5">
                <p className="text-3xl font-bold text-accent">{stats?.completions ?? 0}</p>
                <p className="text-sm text-muted-foreground">Retos completados</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card p-5">
                <p className="text-3xl font-bold">{stats?.leads ?? 0}</p>
                <p className="text-sm text-muted-foreground">Prospectos registrados</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-card p-5">
                <p className="text-3xl font-bold">{stats?.brochureRequests ?? 0}</p>
                <p className="text-sm text-muted-foreground">Solicitudes de brochure</p>
              </div>
            </div>

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="mb-3 font-semibold">Especializaciones más recomendadas</h2>
              {stats?.top.length ? (
                <ul className="space-y-2.5">
                  {stats.top.map((row) => (
                    <li key={row.name} className="space-y-1">
                      <div className="flex justify-between gap-3 text-sm">
                        <span className="min-w-0 truncate">{row.name}</span>
                        <span className="font-semibold text-accent">{row.count}</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-accent-gradient"
                          style={{
                            width: `${(row.count / (stats.top[0]?.count ?? 1)) * 100}%`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Todavía no hay resultados.</p>
              )}
            </section>

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="mb-3 font-semibold">Últimas solicitudes de brochure</h2>
              {stats?.recentBrochureRequests.length ? (
                <ul className="divide-y divide-border/60 text-sm">
                  {stats.recentBrochureRequests.map((request) => (
                    <li
                      key={`${request.email}-${request.created_at}`}
                      className="flex justify-between gap-3 py-2.5"
                    >
                      <span className="min-w-0 truncate">{request.full_name}</span>
                      <span className="shrink-0 truncate text-muted-foreground">
                        {request.email}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Todavía no hay solicitudes de brochure.
                </p>
              )}
            </section>

            <section className="rounded-3xl border border-border/70 bg-card p-5">
              <h2 className="mb-3 font-semibold">Últimos prospectos</h2>
              {stats?.recentLeads.length ? (
                <ul className="divide-y divide-border/60 text-sm">
                  {stats.recentLeads.map((lead) => (
                    <li key={`${lead.full_name}-${lead.created_at}`} className="flex justify-between gap-3 py-2.5">
                      <span className="min-w-0 truncate">{lead.full_name}</span>
                      <span className="shrink-0 text-muted-foreground">{lead.city}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">Todavía no hay prospectos.</p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    const { error } = await action;
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (mode === "signup") toast.success("Cuenta creada. Revisa tu correo si se pide confirmación.");
  };

  return (
    <main className="bg-hero flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-3xl border border-border/70 bg-card p-6"
      >
        <div className="space-y-1">
          <ShieldCheck className="size-7 text-accent" />
          <h1 className="font-display text-3xl text-accent">Acceso equipo CUN</h1>
          <p className="text-sm text-muted-foreground">
            Solo para ver los resultados del reto durante y después del evento.
          </p>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Correo</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={255}
            className="h-12 rounded-2xl bg-secondary/70 focus-visible:ring-accent"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={72}
            className="h-12 rounded-2xl bg-secondary/70 focus-visible:ring-accent"
          />
        </div>
        <Button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-2xl bg-accent-gradient text-base font-semibold text-accent-foreground hover:opacity-95"
        >
          {busy ? (
            <Loader2 className="size-5 animate-spin" />
          ) : mode === "signin" ? (
            "Entrar"
          ) : (
            "Crear cuenta"
          )}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "signin" ? "Crear la primera cuenta del equipo" : "Ya tengo cuenta"}
        </button>
      </form>
    </main>
  );
}
