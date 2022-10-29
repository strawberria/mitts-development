<script lang="ts">
    import NavigationBar from './components/NavigationBar.svelte'
    import NavigationTabs from './components/NavigationTabs.svelte';
    import { NavigationData, playStore, projectStore } from './miscellaneous';
    import Information from './tabs/Information.svelte';
    import States from './tabs/States.svelte';
    import Interactions from './tabs/Interactions.svelte';
    import Objects from './tabs/Objects.svelte';
    import Minimap from './tabs/Minimap.svelte';
    import Restraints from './tabs/Restraints.svelte';
    import GameRuntime from './GameRuntime.svelte';

    const navigationData: NavigationData = {
        "information": { display: "Information", component: Information },
        "states": { display: "States", component: States },
        "restraints": { display: "Restraints", component: Restraints },
        "objects": { display: "Objects", component: Objects },
        "interactions": { display: "Interactions", component: Interactions },
        "minimap": { display: "Minimap", component: Minimap },
    };

    let selectedWindow: string = Object.keys(navigationData)[0];
    let navigateTab: (navigationKey: string) => void; // NavigationWindows
    const navigationClickHandler = (navigationKey: string) => { navigateTab(navigationKey); }
    projectStore.subscribe(v => window["projectStore"] = v);

    let show: boolean = true;
</script>

<div class="absolute inset-0 flex flex-col h-full w-full">
    <NavigationBar navigationData={navigationData} 
        navigationClickHandler={navigationClickHandler}
        bind:selectedWindow={selectedWindow}
        bind:show={show} />
    {#if $playStore === true}
        <GameRuntime />
    {:else if show === true}
        <NavigationTabs navigationData={navigationData}
            bind:selectedWindow={selectedWindow}
            bind:navigateTab={navigateTab} />
    {/if}
</div>

<style>
    :global(html) {
        background-color: rgba(15, 23, 42, 1);
        box-sizing: border-box;
    }
</style>