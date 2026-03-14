"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PlusIcon, MailIcon, Loader2Icon, BuildingIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

const createOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
});

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type CreateOrgValues = z.infer<typeof createOrgSchema>;
type InviteValues = z.infer<typeof inviteSchema>;

export function OrgManager() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs } = authClient.useListOrganizations();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const createForm = useForm<CreateOrgValues>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: { name: "", slug: "" },
  });

  const inviteForm = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { email: "" },
  });

  async function onCreateOrg(values: CreateOrgValues) {
    const { error } = await authClient.organization.create({
      name: values.name,
      slug: values.slug,
    });
    if (error) {
      createForm.setError("root", { message: error.message ?? "Failed to create organization." });
    } else {
      toast.success(`Organization "${values.name}" created.`);
      createForm.reset();
      setShowCreateForm(false);
    }
  }

  async function onInvite(values: InviteValues) {
    if (!activeOrg) {
      toast.error("Select an organization first.");
      return;
    }
    const { error } = await authClient.organization.inviteMember({
      organizationId: activeOrg.id,
      email: values.email,
      role: "member",
    });
    if (error) {
      inviteForm.setError("email", { message: error.message ?? "Failed to send invitation." });
    } else {
      toast.success(`Invitation sent to ${values.email}.`);
      inviteForm.reset();
    }
  }

  if (!orgs || orgs.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BuildingIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base">No organization yet</CardTitle>
            </div>
            <CardDescription>
              Create an organization to collaborate with your team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showCreateForm ? (
              <Button onClick={() => setShowCreateForm(true)} className="self-start">
                <PlusIcon data-icon="inline-start" />
                Create organization
              </Button>
            ) : (
              <CreateOrgForm form={createForm} onSubmit={onCreateOrg} onCancel={() => setShowCreateForm(false)} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Current org */}
      {activeOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BuildingIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base">{activeOrg.name}</CardTitle>
              {/* Status badge — raw colors intentional */}
              <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">Active</Badge>
            </div>
            <CardDescription>Slug: {activeOrg.slug}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">ID: {activeOrg.id}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Invite member */}
      {activeOrg && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MailIcon className="size-5 text-muted-foreground" aria-hidden="true" />
              <CardTitle className="text-base">Invite team member</CardTitle>
            </div>
            <CardDescription>
              Send an invitation email to add someone to your organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...inviteForm}>
              <form onSubmit={inviteForm.handleSubmit(onInvite)} className="flex gap-3">
                <FormField
                  control={inviteForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="sr-only">Email address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          inputMode="email"
                          placeholder="teammate@company.com"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={inviteForm.formState.isSubmitting}>
                  {inviteForm.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
                  Send invite
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Create another org */}
      <div>
        {!showCreateForm ? (
          <Button variant="outline" onClick={() => setShowCreateForm(true)}>
            <PlusIcon data-icon="inline-start" />
            Create another organization
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">New organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateOrgForm form={createForm} onSubmit={onCreateOrg} onCancel={() => setShowCreateForm(false)} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function CreateOrgForm({
  form,
  onSubmit,
  onCancel,
}: {
  form: ReturnType<typeof useForm<CreateOrgValues>>;
  onSubmit: (values: CreateOrgValues) => Promise<void>;
  onCancel: () => void;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="acme-inc" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        <div className="flex gap-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2Icon className="animate-spin" data-icon />}
            Create
          </Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
