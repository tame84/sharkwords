<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<svelte:head>
	<title>Sharkwords • Sign In</title>
</svelte:head>

<main>
	<div class="container">
		<header>
			<h2>Sign in</h2>
			<p>Enter your information to sign into your account</p>
		</header>
		<div class="content">
			<form use:enhance method="POST">
				<div class="inputs-group">
					<input type="email" name="email" placeholder="Email" class="input input--text" />
					<input
						type="password"
						name="password"
						placeholder="Password"
						class="input input--text"
						autocomplete="off"
					/>
				</div>
				<button type="submit" class="btn btn--primary">Submit</button>
				{#if form?.error}
					<p class="alert alert--error" aria-live="assertive">{form.message}</p>
				{/if}
			</form>
			<a href="/auth/sign-up">Sign up instead</a>
		</div>
	</div>
</main>
