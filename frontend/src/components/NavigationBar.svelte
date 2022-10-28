<script lang="ts">
    import { transpileFuncs } from "../transpile";
	import { ExportProject, ImportProject } from "../../wailsjs/go/main/Bridge";
	import { MouseClickEvent, NavigationData, playStore, ProjectData, projectStore, sleep, version } from "../miscellaneous";
	import IconButton from "./IconButton.svelte";

	export let navigationData: NavigationData;
	export let navigationClickHandler: (navigationKey: string) => void;
	export let selectedWindow: string;
	export let show: boolean; // Held false for a bit when reloading

	async function importClick() {
		// Run transpilation for older versions
		const serialized = await ImportProject();
		let transpiledProjectData = JSON.parse(serialized);
		for(const transpileFunc of transpileFuncs) {
			transpiledProjectData = await transpileFunc(transpiledProjectData);
		}
		show = false; await sleep(50); 
		projectStore.set(transpiledProjectData as ProjectData);
		await sleep(50); 
		show = true; 
	}

	async function exportClick() {
		// Dumb way: remove stray image references by brute force checking
		const usedImageHashes: Set<string> = new Set();
		for(const stateData of Object.values($projectStore.storage.states.data)) {
			usedImageHashes.add(stateData.imageHash);
			for(const minimapLocationData of Object.values(stateData.locations.data)) {
				usedImageHashes.add(minimapLocationData.minimapHash);
			}
		}
		usedImageHashes.delete(""); // Means unused

		// Iterate over stored images and delete unused ones
		for(const imageHash of Object.keys($projectStore.storage.images)) {
			if(usedImageHashes.has(imageHash) === false) {
				console.log(`Deleting unused image hash [${imageHash}]`)
				delete $projectStore.storage.images[imageHash];
			}
		}

		const serialized = JSON.stringify($projectStore);
		await ExportProject(serialized);
	}

	async function playGame() {
		const openingStates = Object.entries($projectStore.storage.states.data)
        	.filter(([id, data]) => data.type === "opening");
		const startingStates = Object.entries($projectStore.storage.states.data)
        	.filter(([id, data]) => data.type === "starting");
		if(openingStates.length === 0) { 
			alert("Error initializing playtesting: couldn't find opening state");
		} else if(startingStates.length === 0) {
			alert("Error initializing playtesting: couldn't find starting state");
		} else {
			$playStore = true;
		}
	}

	async function stopGame() {
		$playStore = false;
	}

	function navigationClick(mouseEvent: MouseClickEvent<HTMLAnchorElement>) {
		const clickedElement = mouseEvent.currentTarget;
		const navigationKey = clickedElement.getAttribute("aria-label") as string;
		navigationClickHandler(navigationKey);
	}
</script>

<nav class="bg-slate-800 text-slate-400">
	<div class="flex flex-row justify-between items-stretch 
		px-4">
		<div class="flex flex-row 
			space-x-4 py-3">
			<div class="flex flex-row 
				space-x-2.5">
				{#if $playStore === false}
					<IconButton label={"Import"}
						onclick={importClick}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
						</svg>
					</IconButton>
					<IconButton label={"Export"}
						onclick={exportClick}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
						</svg>
					</IconButton>
					<IconButton label={"Play"}
						onclick={playGame}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</IconButton>
				{:else}
					<IconButton label={"Stop"}
						onclick={stopGame}>
						<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
							<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
						</svg>
					</IconButton>
				{/if}
			</div>
			<div class="flex items-center">
				<div class="flex flex-row items-end space-x-2">
					<span class="font-medium text-2xl">Mitts-Development</span>
					<span class="text-xl">v{version}</span>
				</div>
			</div>
		</div>
	  	<div class="flex items-center 
		  	space-x-1 pr-2">
			<ul class="flex flex-row text-xl 
				space-x-8">
				{#if $playStore === false}
					{#each Object.entries(navigationData) as [navigationKey, navigationData]}
						<li class="h-full py-2.5">
							<a class={`cursor-pointer select-none ${navigationKey === selectedWindow
									? "text-slate-200"
									: "hover:text-slate-300 focus:text-slate-200"}`}
								aria-label={navigationKey}
								on:click={navigationClick}>
								{navigationData.display}
							</a>
						</li>
					{/each}
				{:else}
					<p class="text-xl text-slate-300">Check console for debug information</p>
				{/if}
			</ul>
		</div>
	</div>
</nav>