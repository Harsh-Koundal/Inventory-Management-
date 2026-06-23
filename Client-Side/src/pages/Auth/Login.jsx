import { ArrowRight, Package, RefreshCw, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import { APP_NAME, DEMO_CREDENTIALS } from "../../constants/appConstants";
import { useInventory } from "../../hooks/useInventory";

const featureItems = [
  "Track products, stock, orders, and history in one workspace.",
  "Low-stock visibility and order activity stay in sync across modules.",
  "Protected access with persisted demo session support.",
];

export default function Login() {
  const { login } = useInventory();
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      const result = await login(email, password);

      if (!result.ok) {
        setError(result.message);
      }

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex flex-col justify-between border-b border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
          <div>
            <div className="mb-10 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200">
                <Package size={22} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900">{APP_NAME}</p>
                <p className="text-sm text-slate-500">Inventory Management System</p>
              </div>
            </div>

            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                <ShieldCheck size={14} />
                Operational Workspace
              </div>
              <h1 className="max-w-lg text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to manage inventory activity with a larger, focused workspace.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                This demo matches the rest of the client: quiet surfaces, dense information, and workflows built for day-to-day stock and order operations.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {featureItems.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 h-2 w-12 rounded-full bg-indigo-600" />
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Enter your credentials to continue to the dashboard.
              </p>
            </div>

            {error ? (
              <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <XCircle size={16} className="flex-shrink-0 text-red-500" />
                <p>{error}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="py-3 text-base"
              />
              <InputField
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="py-3 text-base"
              />

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-base font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Default admin credentials
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                    {DEMO_CREDENTIALS.email}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-xs text-slate-500">Password</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                    {DEMO_CREDENTIALS.password}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
