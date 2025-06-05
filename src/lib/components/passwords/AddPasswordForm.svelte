<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { generatePassword } from '$lib/utils/password';

	let passwordInput: HTMLInputElement;
	let errorMessage = $state('');
	let successMessage = $state('');

	const handleGeneratePassword = (e: Event): void => {
		e.preventDefault();
		passwordInput.value = generatePassword();
	};
	const clearMessage = (): void => {
		setTimeout(() => {
			errorMessage = '';
			successMessage = '';
		}, 3000);
	};
	const handleAddPassword = async (e: SubmitEvent): Promise<void> => {
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
			errorMessage = data.message;
			clearMessage();
			return;
		}

		successMessage = data.data.message;
		form.reset();
		await invalidateAll();
		clearMessage();
	};
</script>

<section>
	<header>
		<h2>Add new password</h2>
	</header>
	<div class="content">
		<form onsubmit={handleAddPassword} autocomplete="off">
			<div class="inputs-group">
				<input
					type="text"
					name="website"
					placeholder="Website, e.g. google.com, youtube.com, github.com, ..."
					class="input input--text"
				/>
				<input type="text" name="label" placeholder="Label" class="input input--text" />
			</div>
			<div class="inputs-group">
				<input
					type="text"
					name="password"
					placeholder="Password"
					class="input input--text"
					bind:this={passwordInput}
				/>
				<button type="button" class="btn btn--secondary" onclick={handleGeneratePassword}
					>Generate password</button
				>
			</div>
			<div class="inputs-group">
				<input
					type="password"
					name="masterPassword"
					placeholder="Master password"
					class="input input--text"
				/>
				<input
					type="password"
					name="masterPasswordConfirm"
					placeholder="Confirm master password"
					class="input input--text"
				/>
			</div>

			<div class="alert alert--warning">
				<p>
					Your master password is used to encrypt and decrypt all your passwords. Do not lose it; if
					you do, we will not be able to change it and all your password will be lost.
				</p>
			</div>
			<button type="submit" class="btn btn--primary">Submit</button>
			{#if errorMessage}
				<p class="alert alert--error">{errorMessage}</p>
			{:else if successMessage}
				<p class="alert alert--success">{successMessage}</p>
			{/if}
		</form>
	</div>
</section>
