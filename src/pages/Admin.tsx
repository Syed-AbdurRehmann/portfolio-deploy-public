import { useMemo, useState } from "react";
import { Lock, LogOut, PlusCircle, RefreshCw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { categories as fallbackCategories, type Video } from "@/data/videos";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminVideos, useCreateVideoMutation, useDeleteVideoMutation, useUpdateVideoMutation } from "@/hooks/useVideos";
import type { VideoInput } from "@/lib/video-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const buildInitialForm = (): VideoInput => ({
  title: "",
  category: fallbackCategories.find((item) => item !== "All") || "Anime Edits",
  googleDriveLink: "",
  isLatest: false,
  isVertical: true,
  description: "",
});

const toFormValues = (video: Video): VideoInput => ({
  title: video.title,
  category: video.category,
  googleDriveLink: video.googleDriveLink,
  isLatest: video.isLatest,
  isVertical: video.isVertical,
  description: video.description || "",
});

const Admin = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [form, setForm] = useState<VideoInput>(buildInitialForm());
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);

  const { isConfigured, hasAdmin, loading: authLoading, user, setup, login, logout, authError } = useAdminAuth();
  const { videos, isLoading, error, refetch } = useAdminVideos(Boolean(user) && isConfigured);

  const createMutation = useCreateVideoMutation();
  const updateMutation = useUpdateVideoMutation();
  const deleteMutation = useDeleteVideoMutation();

  const categoryOptions = useMemo(
    () => fallbackCategories.filter((category) => category !== "All"),
    [],
  );

  const mutationPending = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const resetForm = () => {
    setEditingVideoId(null);
    setForm(buildInitialForm());
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await login({ email: loginEmail.trim(), password: loginPassword });
      toast.success("Admin mode activated.");
      setLoginPassword("");
    } catch {
      toast.error("Unable to sign in. Check your credentials.");
    }
  };

  const handleSetup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await setup({
        email: loginEmail.trim(),
        password: loginPassword,
        setupKey: setupKey.trim() || undefined,
      });
      toast.success("Admin account created. Sign in now.");
      setLoginPassword("");
    } catch {
      toast.error("Unable to create admin account.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out from admin mode.");
      resetForm();
    } catch {
      toast.error("Unable to sign out.");
    }
  };

  const handleSubmitVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim() || !form.googleDriveLink.trim() || !form.category) {
      toast.error("Title, category, and Google Drive link are required.");
      return;
    }

    try {
      if (editingVideoId) {
        await updateMutation.mutateAsync({ id: editingVideoId, input: form });
        toast.success("Video updated.");
      } else {
        await createMutation.mutateAsync(form);
        toast.success("Video added.");
      }
      resetForm();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unable to save video.";
      toast.error(message);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideoId(video.id);
    setForm(toFormValues(video));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Delete "${title}"? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Video deleted.");
      if (editingVideoId === id) {
        resetForm();
      }
    } catch (deleteError) {
      const message = deleteError instanceof Error ? deleteError.message : "Unable to delete video.";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative z-10">
      <div className="container mx-auto max-w-6xl space-y-6">
        <Card className="border-primary/20 bg-card/60 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl font-display">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Admin Video Management
            </CardTitle>
            <CardDescription className="font-main text-base">
              Add, edit, and remove portfolio videos without redeploying the site.
            </CardDescription>
          </CardHeader>
        </Card>

        {!isConfigured && (
          <Card className="border-amber-400/30 bg-amber-500/10">
            <CardHeader>
              <CardTitle className="text-amber-200">Backend API not available</CardTitle>
              <CardDescription className="text-amber-100/90">
                Start the local API server and make sure /api endpoints are reachable.
              </CardDescription>
            </CardHeader>
            <CardContent className="font-mono text-sm text-amber-100/90 space-y-1">
              <p>1. Configure .env.server from .env.server.example</p>
              <p>2. Run npm run dev (starts API + web)</p>
              <p>3. Follow SQLITE_SETUP.md</p>
            </CardContent>
          </Card>
        )}

        {isConfigured && !hasAdmin && (
          <Card className="max-w-lg border-primary/30 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Create Admin Account
              </CardTitle>
              <CardDescription>
                First-time setup for your self-hosted backend.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSetup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="setup-email">Email</Label>
                  <Input
                    id="setup-email"
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setup-password">Password</Label>
                  <Input
                    id="setup-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setup-key">Setup Key (optional)</Label>
                  <Input
                    id="setup-key"
                    value={setupKey}
                    onChange={(event) => setSetupKey(event.target.value)}
                    placeholder="Only needed if ADMIN_SETUP_KEY is configured"
                  />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Creating account..." : "Create Admin"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isConfigured && hasAdmin && !user && (
          <Card className="max-w-lg border-primary/30 bg-card/70">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Admin Sign In
              </CardTitle>
              <CardDescription>Single-admin login powered by your self-hosted API.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                </div>
                {authError && <p className="text-sm text-destructive">{authError}</p>}
                <Button type="submit" className="w-full" disabled={authLoading}>
                  {authLoading ? "Signing in..." : "Enter Admin Mode"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {isConfigured && user && (
          <>
            <Card className="border-border/60 bg-card/60">
              <CardContent className="pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Signed in as</p>
                  <p className="font-medium text-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={() => refetch()} disabled={isLoading || mutationPending}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-display">
                  {editingVideoId ? "Edit Video" : "Add New Video"}
                </CardTitle>
                <CardDescription>
                  Required fields: title, category, drive link. Optional: description, latest, vertical.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitVideo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-title">Title</Label>
                      <Input
                        id="video-title"
                        value={form.title}
                        onChange={(event) => setForm((previous) => ({ ...previous, title: event.target.value }))}
                        placeholder="New viral edit"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="video-category">Category</Label>
                      <select
                        id="video-category"
                        value={form.category}
                        onChange={(event) => setForm((previous) => ({ ...previous, category: event.target.value }))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        required
                      >
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-link">Google Drive Link</Label>
                    <Input
                      id="video-link"
                      value={form.googleDriveLink}
                      onChange={(event) => setForm((previous) => ({ ...previous, googleDriveLink: event.target.value }))}
                      placeholder="https://drive.google.com/file/d/.../view"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea
                      id="video-description"
                      value={form.description}
                      onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))}
                      placeholder="Short summary of this video"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between rounded-md border border-border/70 p-3">
                      <div>
                        <Label htmlFor="video-latest">Latest Work</Label>
                        <p className="text-xs text-muted-foreground">Show on homepage featured section.</p>
                      </div>
                      <Switch
                        id="video-latest"
                        checked={form.isLatest}
                        onCheckedChange={(checked) => setForm((previous) => ({ ...previous, isLatest: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-border/70 p-3">
                      <div>
                        <Label htmlFor="video-vertical">Vertical Video</Label>
                        <p className="text-xs text-muted-foreground">Enable vertical card ratio styling.</p>
                      </div>
                      <Switch
                        id="video-vertical"
                        checked={form.isVertical}
                        onCheckedChange={(checked) => setForm((previous) => ({ ...previous, isVertical: checked }))}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={mutationPending}>
                      {editingVideoId ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Video
                        </>
                      )}
                    </Button>
                    {editingVideoId && (
                      <Button type="button" variant="outline" onClick={resetForm} disabled={mutationPending}>
                        Cancel Editing
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Videos ({videos.length})</CardTitle>
                <CardDescription>Manage your published portfolio library.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading && <p className="text-sm text-muted-foreground">Loading videos...</p>}
                {!!error && (
                  <p className="text-sm text-destructive">
                    {error instanceof Error ? error.message : "Unable to load videos."}
                  </p>
                )}
                {!isLoading && !videos.length && (
                  <p className="text-sm text-muted-foreground">
                    No videos in your SQLite database yet. Add your first video using the form above.
                  </p>
                )}
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="rounded-lg border border-border/70 p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.category}</p>
                      <a
                        href={video.googleDriveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline underline-offset-4 break-all"
                      >
                        {video.googleDriveLink}
                      </a>
                    </div>
                    <div className="flex gap-2 self-end md:self-auto">
                      <Button type="button" variant="outline" onClick={() => handleEdit(video)} disabled={mutationPending}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleDelete(video.id, video.title)}
                        disabled={mutationPending}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
