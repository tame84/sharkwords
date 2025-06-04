<script lang="ts">
	import Header from '$lib/components/Header.svelte';

	let { children, data } = $props();
</script>

<Header username={data.session?.user.name} />

{@render children()}
