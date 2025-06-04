<script lang="ts">
	import AddPasswordForm from '$lib/components/passwords/AddPasswordForm.svelte';
	import PasswordsList from '$lib/components/passwords/PasswordsList.svelte';

	let { data } = $props();
</script>

<main>
	<AddPasswordForm />
	<PasswordsList passwords={data.passwords ?? []} />
</main>
