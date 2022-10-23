<script lang="ts">
    import RadioRestraintLocation from "../components/RadioRestraintLocation.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedLocationID: string | undefined;

    let scrollingLocationData: ScrollingRadioData[];
    function generateLocationData(): ScrollingRadioData[] {
        return $projectStore.data.restraintLocations.ordering
            .filter(id => id !== undefined).map((id) => {
                const locationData = $projectStore.data.restraintLocations.data[id];
                return {
                    key: locationData.id,
                    component: RadioRestraintLocation,
                    props: { locationData: locationData }
                }
            });
    }
    $: {
        $projectStore.data.restraintLocations;
        scrollingLocationData = generateLocationData();
    }

    function addLocation() {
        const id = randomID(idLength);
        $projectStore.data.restraintLocations.data[id] = {
            id: id,
            name: "",
            initial: "",
        }
        $projectStore.data.restraintLocations.ordering.push(id);

        $projectStore.data.restraintLocations = $projectStore.data.restraintLocations;
    }

    function deleteLocation() {
        if(selectedLocationID !== undefined) {
            const backupLocationID = selectedLocationID;
            selectedLocationID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.data.restraintLocations.ordering;
            const locationIndex = ordering.findIndex(id => id === backupLocationID);
            for(let index = locationIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedLocationID = ordering[locationIndex] ?? ordering[locationIndex-1];
            // Delete location data from project data
            delete $projectStore.data.restraintLocations.data[backupLocationID];

            $projectStore.data.restraintLocations = $projectStore.data.restraintLocations;
        }
    }

    function moveLocationUp() {
        if(selectedLocationID !== undefined && $projectStore.data.restraintLocations.ordering.length > 1) {
            const ordering = $projectStore.data.restraintLocations.ordering;
            const locationIndex = ordering.findIndex(id => id === selectedLocationID);
            if(locationIndex <= 0) { return; }
            const tempSwap = ordering[locationIndex];
            ordering[locationIndex] = ordering[locationIndex - 1]
            ordering[locationIndex - 1] = tempSwap;

            $projectStore.data.restraintLocations = $projectStore.data.restraintLocations;
        }
    }

    function moveLocationDown() {
        if(selectedLocationID !== undefined && $projectStore.data.restraintLocations.ordering.length > 1) {
            const ordering = $projectStore.data.restraintLocations.ordering;
            const locationIndex = ordering.findIndex(id => id === selectedLocationID);
            if(locationIndex === -1 || locationIndex === $projectStore.data.restraintLocations.ordering.length - 1) { return; }
            const tempSwap = ordering[locationIndex];
            ordering[locationIndex] = ordering[locationIndex + 1]
            ordering[locationIndex + 1] = tempSwap;

            $projectStore.data.restraintLocations = $projectStore.data.restraintLocations;
        }
    }
</script>

<FormGrouping class="shrink
    w-full h-3/5 min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Restraint Locations</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveLocationUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveLocationDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedLocationID}
            deselectable={true}
            scrollingRadioData={scrollingLocationData} />
    </svelte:fragment>
</FormGrouping>