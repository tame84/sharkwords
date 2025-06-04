<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="container">
	<header>
		<h2>Sign up</h2>
		<p>Enter your information to create an account</p>
	</header>
	<div class="content">
		<form use:enhance method="POST">
			<input type="text" name="username" placeholder="Username" />
			<input type="email" name="email" placeholder="Email" />
			<input type="password" name="password" placeholder="Password" />
			<input type="password" name="passwordConfirm" placeholder="Confirm Password" />
			<button type="submit" class="btn btn--primary">Submit</button>
			{#if form?.error}
				<p>{form.message}</p>
			{/if}
		</form>
		<a href="/auth/sign-in">Sign in instead</a>
	</div>
</div>
