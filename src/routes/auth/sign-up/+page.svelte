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
			<div class="alert alert--warning">
				<p>
					Being an education projet, it's not recommended to save your important passwords with this
					website.
				</p>
			</div>
			<div class="inputs-group">
				<input type="text" name="username" placeholder="Username" class="input input--text" />
				<input type="email" name="email" placeholder="Email" class="input input--text" />
			</div>
			<div class="inputs-group">
				<input type="password" name="password" placeholder="Password" class="input input--text" />
				<input
					type="password"
					name="passwordConfirm"
					placeholder="Confirm Password"
					class="input input--text"
				/>
			</div>
			<button type="submit" class="btn btn--primary">Submit</button>
			{#if form?.error}
				<p class="alert alert--error">{form.message}</p>
			{/if}
		</form>
		<a href="/auth/sign-in">Sign in instead</a>
	</div>
</div>
