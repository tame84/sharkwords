<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import '$lib/styles/app.scss';

	let { children, data } = $props();
</script>

<svelte:head>
	<title>Sharkwords • Password Manager</title>
	<meta name="description" content="Sharkwords is a password manager builded for learning." />
</svelte:head>

<Header username={data.session?.user.name} />
{@render children()}
<Footer />
