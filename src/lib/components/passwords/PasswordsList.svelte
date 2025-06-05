<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	type Passwords = { id: string; website: string; label: string | null }[];
	type Props = {
		passwords: Passwords;
	};

	let { passwords }: Props = $props();

	let askMasterPassword = $state(false);
	let askMasterPasswordErrorMessage = $state('');
	let actionType = $state('');
	let passwordId = $state('');
	let masterPassword = $state('');
	let showEditPasswordModal = $state(false);
	let editPasswordErrorMessage = $state('');
	let showDeleteModal = $state(false);
	let filteredPasswords = $state(passwords);
	let search = $state('');

	$effect(() => {
		if (!search) {
			filteredPasswords = passwords;
		}
	});

	const handleActionRequest = (e: Event, type: 'copy' | 'edit' | 'delete', pwdId: string): void => {
		e.preventDefault();

		askMasterPassword = true;
		actionType = type;
		passwordId = pwdId;
	};
	const handleAction = async (e: Event): Promise<void> => {
		e.preventDefault();

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

		if (data.error) {
			return (askMasterPasswordErrorMessage = data.message);
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

		const response = await fetch('/api/password/edit', {
			method: 'POST',
			body: JSON.stringify({ passwordId, password, masterPassword })
		});
		const data = await response.json();

		if (data.error) {
			return (editPasswordErrorMessage = data.message);
		}

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
	const handleFilterPasswordsByWebsite = (e: Event): void => {
		e.preventDefault();

		const input = e.target as HTMLInputElement;
		search = input.value.trim();

		if (search) {
			filteredPasswords = passwords.filter((pwd) =>
				pwd.website.toLocaleLowerCase().includes(search.toLowerCase())
			);
		} else {
			filteredPasswords = passwords;
		}
	};
	const handleCloseModal = (e: Event): void => {
		e.preventDefault();

		askMasterPassword = false;
		askMasterPasswordErrorMessage = '';
		showEditPasswordModal = false;
		editPasswordErrorMessage = '';
		showDeleteModal = false;
		masterPassword = '';
		actionType = '';
		passwordId = '';
	};
</script>

{#if askMasterPassword}
	<div class="modal">
		<div class="modal-content">
			<header>
				<h2>Authorization</h2>
				<p>Enter your master password to authorize {actionType} action on your password</p>
			</header>
			<div class="content">
				<form onsubmit={handleAction} autocomplete="off">
					<input
						type="password"
						name="masterPassword"
						placeholder="Master password"
						class="input input--text"
					/>
					<div class="btns-group">
						<button type="submit" class="btn btn--primary">Submit</button>
						<button class="btn btn--secondary" onclick={handleCloseModal}>Go back</button>
					</div>
					{#if askMasterPasswordErrorMessage}
						<div class="alert alert--error">
							<p aria-live="assertive">{askMasterPasswordErrorMessage}</p>
						</div>
					{/if}
				</form>
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
				<form onsubmit={handleEditPassword} autocomplete="off">
					<input type="text" name="password" placeholder="Password" class="input input--text" />
					<div class="btns-group">
						<button type="submit" class="btn btn--primary">Submit</button>
						<button class="btn btn--secondary" onclick={handleCloseModal}>Go back</button>
					</div>
					{#if editPasswordErrorMessage}
						<div class="alert alert--error">
							<p aria-live="assertive">{editPasswordErrorMessage}</p>
						</div>
					{/if}
				</form>
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
				<form onsubmit={handleDeletePassword} autocomplete="off">
					<div class="btns-group">
						<button type="submit" class="btn btn--primary">Yes</button>
						<button class="btn btn--secondary" onclick={handleCloseModal}>Go back</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}
<section>
	<header>
		<h2>My passwords</h2>
	</header>
	<div class="content">
		<div class="search-bar">
			<input
				class="input input--text"
				type="text"
				name="website"
				placeholder="Website, e.g. google.com, youtube.com, github.com, ..."
				autocomplete="off"
				oninput={handleFilterPasswordsByWebsite}
			/>
			<div class="icon" aria-hidden="true">
				<svg xmlns="http://www.w3.org/2000/svg" width="19.2" height="19.2" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
					/></svg
				>
			</div>
		</div>
		{#if filteredPasswords.length > 0}
			<table aria-label="My saved passwords">
				<thead>
					<tr>
						<th>Website</th>
						<th>Label</th>
						<th>Password</th>
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					{#each filteredPasswords as password (password.id)}
						<tr tabindex="0">
							<td data-label="Website" aria-label="Website">{password.website}</td>
							<td data-label="Label" aria-label="Label">{password.label ? password.label : '-'}</td>
							<td data-label="Password" aria-label="Password">
								<input
									type="password"
									disabled
									value="••••••••••••••••••"
									class="password-input"
									data-id={password.id}
									aria-label="Password placeholder"
								/>
							</td>
							<td data-label="Actions" aria-label="Actions">
								<div class="actions">
									<button
										tabindex="0"
										onclick={(e) => handleActionRequest(e, 'copy', password.id)}
										aria-label="Copy"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												d="M9 18q-.825 0-1.412-.587T7 16V4q0-.825.588-1.412T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.587 1.413T18 18zm-4 4q-.825 0-1.412-.587T3 20V6h2v14h11v2z"
											/></svg
										></button
									>
									<button
										tabindex="0"
										onclick={(e) => handleActionRequest(e, 'edit', password.id)}
										aria-label="Edit"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											><path
												fill="currentColor"
												d="M3 21v-4.25L16.2 3.575q.3-.275.663-.425t.762-.15t.775.15t.65.45L20.425 5q.3.275.438.65T21 6.4q0 .4-.137.763t-.438.662L7.25 21zM17.6 7.8L19 6.4L17.6 5l-1.4 1.4z"
											/></svg
										></button
									>
									<button
										tabindex="0"
										onclick={(e) => handleActionRequest(e, 'delete', password.id)}
										aria-label="Delete"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
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
				</tbody>
			</table>
		{:else}
			<div class="alert alert--error">
				<p aria-live="polite">No password was found</p>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	@use '../../styles/vars.scss' as *;

	.search-bar {
		width: 100%;
		position: relative;
		margin-bottom: 2rem;

		input {
			width: 100%;
		}
		.icon {
			position: absolute;
			top: 50%;
			right: 1px;
			transform: translateY(-40%);
			fill: $fg-grey;
			background: $bg-dark;
			padding: 0 0.625rem;
		}
	}
	table {
		width: 100%;
		table-layout: auto;

		@media screen and (max-width: 580px) {
			display: block;
			width: 100%;

			thead,
			tbody,
			th,
			td,
			tr {
				display: block;
				width: 100%;
			}

			thead {
				display: none;
			}
		}

		tr {
			border-bottom: $border;

			@media screen and (max-width: 580px) {
				border: none;
				margin-bottom: 1rem;
				border-radius: 8px;
				padding: 0.5rem;
				background: $bg;
			}
		}
		th,
		td {
			padding: 0.75rem 1rem;
			overflow: hidden;

			&:last-child,
			&:nth-child(3) {
				white-space: nowrap;
				width: 1%;

				@media screen and (max-width: 580px) {
					width: auto;
				}
			}
			&:nth-child(3) {
				@media screen and (max-width: 720px) {
					display: none;
				}
			}
		}
		th {
			font-weight: 600;
		}
		td {
			color: $fg-grey;

			@media screen and (max-width: 580px) {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0.5rem 0.5rem;

				&::before {
					content: attr(data-label);
					font-weight: 600;
					color: $fg;
				}
			}
		}
		.actions {
			opacity: 0;
			pointer-events: none;

			@media screen and (max-width: 580px) {
				opacity: 1;
				pointer-events: auto;
			}

			button {
				cursor: pointer;

				&:hover,
				&:focus {
					color: $primary;
				}
			}

			&:hover,
			&:focus-within {
				opacity: 1;
				pointer-events: auto;
			}
		}

		tbody {
			tr {
				transition: 0.2s ease-out;

				&:hover,
				&:focus {
					background: $bg-primary;

					td {
						color: $fg;
					}
					.actions {
						opacity: 1;
						pointer-events: auto;
					}
				}
			}
		}
	}
</style>
