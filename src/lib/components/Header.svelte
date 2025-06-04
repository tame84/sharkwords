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
	<div class="content">
		<h1>Sharkwords</h1>
		<div class="account">
			{#if username}
				<p>{username}</p>
				<form onsubmit={handleSignOut}>
					<button type="submit" class="btn btn--primary">Sign out</button>
				</form>
			{/if}
		</div>
	</div>
</header>

<style lang="scss">
	@use '../styles/vars.scss' as *;

	header {
		height: 80px;
		border-bottom: $border;
		margin-bottom: 4rem;
		display: grid;
		place-items: center;
	}
	.content {
		width: 100%;
		max-width: $max-width;
		position: relative;
		display: grid;
	}
	h1 {
		text-align: center;
	}
	.account {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		right: 0;
	}
</style>
