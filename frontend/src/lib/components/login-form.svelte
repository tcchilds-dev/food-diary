<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
  } from "$lib/components/ui/field/index.js";

  import { push } from "svelte-spa-router";

  const id = $props.id();

  let { handleLogin } = $props();

  let email = $state("");
  let password = $state("");

  function handleSubmit(e: Event) {
    e.preventDefault();
    // TODO: add your actual login API call here
    console.log("Login:", email, password);
    handleLogin(); // Call this when login succeeds
    push("/home"); // Navigate to home after login
  }
</script>

<Card.Root class="mx-auto w-full max-w-sm">
  <Card.Header>
    <Card.Title class="text-2xl">Login</Card.Title>
    <Card.Description
      >Enter your email below to login to your account</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <form onsubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel for="email-{id}">Email</FieldLabel>
          <Input
            id="email-{id}"
            type="email"
            placeholder="m@example.com"
            bind:value={email}
            required
          />
        </Field>
        <Field>
          <div class="flex items-center">
            <FieldLabel for="password-{id}">Password</FieldLabel>
            <a
              href="#/forgot-password"
              class="ml-auto inline-block text-sm underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password-{id}"
            type="password"
            bind:value={password}
            required
          />
        </Field>
        <Field>
          <Button type="submit" class="w-full">Login</Button>
          <FieldDescription class="text-center">
            Don't have an account? <a href="#/signup">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  </Card.Content>
</Card.Root>
