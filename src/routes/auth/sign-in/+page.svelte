<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="container">
	<header>
		<h2>Sign in</h2>
		<p>Enter your information to sign into your account</p>
	</header>
	<div class="content">
		<form use:enhance method="POST">
			<input type="email" name="email" placeholder="Email" />
			<input type="password" name="password" placeholder="Password" />
			<button type="submit">Submit</button>
			{#if form?.error}
				<p>{form.message}</p>
			{/if}
		</form>
		<a href="/auth/sign-up">Sign up instead</a>
	</div>
</div>
