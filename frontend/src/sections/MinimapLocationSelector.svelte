<script lang="ts">
    import RadioMinimapLocation from "../components/RadioMinimapLocation.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectMinimapLocationData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedStateID: string | undefined;
    export let selectedMinimapLocationID: string | undefined;
    $: selectedStateID, console.log(selectedStateID)

    let scrollingMinimapLocationData: ScrollingRadioData[];
    function generateMinimapLocationData(): ScrollingRadioData[] {
        return $projectStore.storage.states.data[selectedStateID].locations.ordering
            .filter(id => id !== undefined).map((id) => {
                const minimapLocationData = $projectStore.storage.states.data[selectedStateID].locations.data[id]
                return {
                    key: minimapLocationData.id,
                    component: RadioMinimapLocation,
                    props: { minimapLocationData: minimapLocationData }
                }
            });
    }
    $: {
        $projectStore.storage.states;
        $projectStore.storage.states.data[selectedStateID].locations;
        scrollingMinimapLocationData = generateMinimapLocationData();
    }

    function addMinimapLocation() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[selectedStateID].locations.data[id] = {
            id: id,
            name: "",
            minimapB64: "",
            minimapObjects: {
                data: {},
                ordering: []
            },
        }
        $projectStore.storage.states.data[selectedStateID].locations.ordering.push(id);

        $projectStore.storage.states.data[selectedStateID].locations = $projectStore.storage.states.data[selectedStateID].locations;
    }
    
    function copyMinimapLocation() {
        if(selectedMinimapLocationID !== undefined) {
            const selectedMinimapLocationData = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID];
            const copiedMinimapLocationData: ProjectMinimapLocationData = JSON.parse(JSON.stringify(selectedMinimapLocationData));
            const copiedMinimapLocationId = randomID(idLength);
            copiedMinimapLocationData.id = copiedMinimapLocationId;
            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID] = copiedMinimapLocationData;
            $projectStore.storage.states.data[selectedStateID].locations.ordering.push(copiedMinimapLocationId);

            $projectStore.storage.states.data[selectedStateID].locations = $projectStore.storage.states.data[selectedStateID].locations;
        }
    }

    function deleteMinimapLocation() {
        if(selectedMinimapLocationID !== undefined) {
            const backupMinimapLocationID = selectedMinimapLocationID;
            selectedMinimapLocationID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.ordering;
            const minimapLocationIndex = ordering.findIndex(id => id === backupMinimapLocationID);
            for(let index = minimapLocationIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedMinimapLocationID = ordering[minimapLocationIndex] ?? ordering[minimapLocationIndex-1];
            // Delete minimap object data from project data
            delete $projectStore.storage.states.data[selectedStateID].locations.data[backupMinimapLocationID];

            $projectStore.storage.states.data[selectedStateID].locations = $projectStore.storage.states.data[selectedStateID].locations;
        }
    }

    function moveMinimapLocationUp() {
        if(selectedMinimapLocationID !== undefined && $projectStore.storage.states.data[selectedStateID].locations.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.ordering;
            const minimapLocationIndex = ordering.findIndex(id => id === selectedMinimapLocationID);
            if(minimapLocationIndex <= 0) { return; }
            const tempSwap = ordering[minimapLocationIndex];
            ordering[minimapLocationIndex] = ordering[minimapLocationIndex - 1]
            ordering[minimapLocationIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].locations = $projectStore.storage.states.data[selectedStateID].locations;
        }
    }

    function moveMinimapLocationDown() {
        if(selectedMinimapLocationID !== undefined && $projectStore.storage.states.data[selectedStateID].locations.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.ordering;
            const minimapLocationIndex = ordering.findIndex(id => id === selectedMinimapLocationID);
            if(minimapLocationIndex === -1 || minimapLocationIndex === $projectStore.storage.states.data[selectedStateID].locations.ordering.length - 1) { return; }
            const tempSwap = ordering[minimapLocationIndex];
            ordering[minimapLocationIndex] = ordering[minimapLocationIndex + 1]
            ordering[minimapLocationIndex + 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].locations = $projectStore.storage.states.data[selectedStateID].locations;
        }
    }
</script>

<FormGrouping class="shrink
    w-full h-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Minimap Locations</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addMinimapLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyMinimapLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteMinimapLocation}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveMinimapLocationUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveMinimapLocationDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedMinimapLocationID}
            deselectable={true}
            scrollingRadioData={scrollingMinimapLocationData} />
    </svelte:fragment>
</FormGrouping>