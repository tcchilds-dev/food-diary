<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { push } from 'svelte-spa-router';
	import type { ComponentProps } from "svelte";
	
	const id = $props.id();
	let { handleLogin, ...restProps }: ComponentProps<typeof Card.Root> & { handleLogin: () => void } = $props();
	
	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	
	function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		
		// Validation
		if (password.length < 8) {
			error = 'Password must be at least 8 characters long';
			return;
		}
		
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}
		
		// TODO: Add your actual signup API call here
		console.log('Sign up:', { name, email, password });
		handleLogin(); // Call this when signup succeeds
		push('/home'); // Navigate to home after signup
	}
</script>

<div class="flex items-center justify-center min-h-screen">
	<Card.Root {...restProps} class="w-full max-w-sm">
		<Card.Header>
			<Card.Title>Create an account</Card.Title>
			<Card.Description>Enter your information below to create your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={handleSubmit}>
				<Field.Group>
					{#if error}
						<div class="text-red-500 text-sm mb-2">{error}</div>
					{/if}
					<Field.Field>
						<Field.Label for="name-{id}">Full name</Field.Label>
						<Input 
							id="name-{id}" 
							type="text" 
							placeholder="John Doe"
							bind:value={name}
							required 
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="email-{id}">Email</Field.Label>
						<Input 
							id="email-{id}" 
							type="email" 
							placeholder="m@example.com"
							bind:value={email}
							required 
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="password-{id}">Password</Field.Label>
						<Input 
							id="password-{id}" 
							type="password"
							bind:value={password}
							required 
						/>
						<Field.Description>Must be at least 8 characters long.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Label for="confirm-password-{id}">Confirm password</Field.Label>
						<Input 
							id="confirm-password-{id}" 
							type="password"
							bind:value={confirmPassword}
							required 
						/>
						<Field.Description>Please confirm your password.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Button type="submit" class="w-full">Create account</Button>
						<Field.Description class="text-center mt-2">
							Already have an account? <a href="#/login" class="underline">Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>