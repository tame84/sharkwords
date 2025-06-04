<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	type Passwords = { id: string; website: string; label: string }[];
	type Props = {
		passwords: Passwords;
	};

	let { passwords }: Props = $props();

	let askMasterPassword = $state(false);
	let actionType = $state('');
	let passwordId = $state('');
	let masterPassword = $state('');
	let showEditPasswordModal = $state(false);
	let showDeleteModal = $state(false);
	let filteredPasswords = $state(passwords);

	const handleActionRequest = (e: Event, type: 'copy' | 'edit' | 'delete', pwdId: string): void => {
		e.preventDefault();

		askMasterPassword = true;
		actionType = type;
		passwordId = pwdId;
	};
	const handleAction = async (e: Event): Promise<void> => {
		if (!actionType) {
			return;
		}

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		masterPassword = formData.get('masterPassword') as string;

		const response = await fetch('/api/password/decrypt', {
			method: 'POST',
			body: JSON.stringify({ masterPassword, passwordId })
		});
		const data = await response.json();

		if (!response.ok || data.error) {
			return;
		}

		const password = data.data.password;

		switch (actionType) {
			case 'copy':
				await navigator.clipboard.writeText(password);
				masterPassword = '';
				askMasterPassword = false;
				break;
			case 'edit':
				askMasterPassword = false;
				showEditPasswordModal = true;
				break;
			case 'delete':
				askMasterPassword = false;
				showDeleteModal = true;
			default:
				return;
		}
	};
	const handleEditPassword = async (e: SubmitEvent): Promise<void> => {
		e.preventDefault();

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);
		const password = formData.get('password') as string;

		await fetch('/api/password/edit', {
			method: 'POST',
			body: JSON.stringify({ passwordId, password, masterPassword })
		});

		masterPassword = '';
		showEditPasswordModal = false;
		await invalidateAll();
	};
	const handleDeletePassword = async (e: SubmitEvent): Promise<void> => {
		e.preventDefault();

		await fetch('/api/password/delete', {
			method: 'POST',
			body: JSON.stringify({ passwordId })
		});

		masterPassword = '';
		showDeleteModal = false;
		await invalidateAll();
	};
	const handleFilterPasswordsByWebsite = (e: Event) => {
		e.preventDefault();

		const input = e.target as HTMLInputElement;
		const search = input.value.trim();

		if (search) {
			filteredPasswords = passwords.filter((pwd) =>
				pwd.website.toLocaleLowerCase().includes(search.toLowerCase())
			);
		} else {
			filteredPasswords = passwords;
		}
	};
</script>

{#if askMasterPassword}
	<div class="modal">
		<div class="modal-content">
			<header>
				<h2>Authorization</h2>
				<p>Enter your master password to authorize the action</p>
			</header>
			<div class="content">
				<form onsubmit={handleAction}>
					<input type="password" name="masterPassword" placeholder="Master password" />
					<button type="submit">Submit</button>
				</form>
				<button
					onclick={() => {
						askMasterPassword = false;
					}}>Go back</button
				>
			</div>
		</div>
	</div>
{/if}
{#if showEditPasswordModal}
	<div class="modal">
		<div class="modal-content">
			<header>
				<h2>Edit</h2>
				<p>Enter a new password to replace the old one</p>
			</header>
			<div class="content">
				<form onsubmit={handleEditPassword}>
					<input type="text" name="password" placeholder="Password" />
					<button type="submit">Submit</button>
				</form>
				<button
					onclick={() => {
						askMasterPassword = false;
					}}>Go back</button
				>
			</div>
		</div>
	</div>
{/if}
{#if showDeleteModal}
	<div class="modal">
		<div class="modal-content">
			<header>
				<h2>Delete</h2>
				<p>Are you sure to delete this password ?</p>
			</header>
			<div class="content">
				<form onsubmit={handleDeletePassword}>
					<button type="submit">Yes</button>
				</form>
				<button
					onclick={() => {
						askMasterPassword = false;
					}}>Go back</button
				>
			</div>
		</div>
	</div>
{/if}
<section>
	<header>
		<h2>My passwords</h2>
	</header>
	<div class="content">
		<form onsubmit={(e) => e.preventDefault()}>
			<input
				type="text"
				name="website"
				placeholder="Website, e.g. google.com, youtube.com, github.com, ..."
				oninput={handleFilterPasswordsByWebsite}
			/>
		</form>
		<table>
			<thead>
				<tr>
					<th>Website</th>
					<th>Label</th>
					<th>Password</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				{#if filteredPasswords.length > 0}
					{#each filteredPasswords as password (password.id)}
						<tr>
							<td>{password.website}</td>
							<td>{password.label ? password.label : '-'}</td>
							<td>
								<input
									type="password"
									disabled
									value="••••••••••••••••••"
									class="password-input"
									data-id={password.id}
								/>
							</td>
							<td>
								<div class="actions">
									<button
										onclick={(e) => handleActionRequest(e, 'copy', password.id)}
										aria-label="Copy"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="19.2"
											height="19.2"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z"
											/></svg
										></button
									>
									<button
										onclick={(e) => handleActionRequest(e, 'edit', password.id)}
										aria-label="Edit"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="19.2"
											height="19.2"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
											/></svg
										></button
									>
									<button
										onclick={(e) => handleActionRequest(e, 'delete', password.id)}
										aria-label="Delete"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="19.2"
											height="19.2"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z"
											/></svg
										></button
									>
								</div>
							</td>
						</tr>
					{/each}
				{:else}
					<tr>
						<td colspan="4">No password found</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</section>
