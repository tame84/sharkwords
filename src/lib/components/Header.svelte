<script lang="ts">
	import { goto } from '$app/navigation';

	let { username } = $props();

	const handleSignOut = async (e: SubmitEvent) => {
		e.preventDefault();

		const response = await fetch('/api/user/sign-out', {
			method: 'POST'
		});
		const data = await response.json();

		if (data.error) {
			return;
		}

		await goto(data.data.redirectUrl, { invalidateAll: true });
	};
</script>

<header>
	<h1>Sharkwords</h1>
	<div class="account">
		{#if username}
			<p>{username}</p>
			<form onsubmit={handleSignOut}>
				<button type="submit">Sign out</button>
			</form>
		{/if}
	</div>
</header>
