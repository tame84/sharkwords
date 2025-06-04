<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { generatePassword } from '$lib/utils/password';

	let passwordInput: HTMLInputElement;
	let resultMessage = $state('');

	const handleGeneratePassword = (e: Event): void => {
		e.preventDefault();
		passwordInput.value = generatePassword();
	};
	const handleAddPassword = async (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const website = formData.get('website') as string;
		const label = formData.get('label') as string;
		let password = formData.get('password') as string;
		const masterPassword = formData.get('masterPassword') as string;
		const masterPasswordConfirm = formData.get('masterPasswordConfirm') as string;

		const response = await fetch('/api/password/add', {
			method: 'POST',
			body: JSON.stringify({ website, label, password, masterPassword, masterPasswordConfirm })
		});

		const data = await response.json();

		if (!response.ok || data.error) {
			resultMessage = data.message;
			return;
		}

		resultMessage = data.data.message;
		form.reset();
		await invalidateAll();
	};
</script>

<section>
	<header>
		<h2>Add new password</h2>
	</header>
	<div class="content">
		<form onsubmit={handleAddPassword}>
			<input
				type="text"
				name="website"
				placeholder="Website, e.g. google.com, youtube.com, github.com, ..."
			/>
			<input type="text" name="label" placeholder="Label" />
			<div>
				<input type="text" name="password" placeholder="Password" bind:this={passwordInput} />
				<button type="button" onclick={handleGeneratePassword}>Generate password</button>
			</div>
			<div class="warning">
				<p>
					Your master password is used to encrypt and decrypt all your passwords. Do not lose it; if
					you do, we will not be able to change it and all your password will be lost.
				</p>
			</div>
			<input type="password" name="masterPassword" placeholder="Master password" />
			<input type="password" name="masterPasswordConfirm" placeholder="Confirm master password" />
			<button type="submit">Submit</button>
			{#if resultMessage}
				<p class={resultMessage ? 'error' : 'success'}>{resultMessage}</p>
			{/if}
		</form>
	</div>
</section>
