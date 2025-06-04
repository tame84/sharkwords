<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/app.scss';

	let { children, data } = $props();
</script>

<Header username={data.session?.user.name} />
{@render children()}
<Footer />
