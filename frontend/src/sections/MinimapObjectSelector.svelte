<script lang="ts">
    import RadioMinimapObject from "../components/RadioMinimapObject.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectMinimapObjectData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedStateID: string | undefined;
    export let selectedMinimapLocationID: string | undefined;
    export let selectedMinimapObjectID: string | undefined;

    let scrollingMinimapObjectData: ScrollingRadioData[];
    $: {
        $projectStore.storage.states;
        $projectStore.storage.states.data[selectedStateID].locations;
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;
        scrollingMinimapObjectData = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering
            .filter(id => id !== undefined).map((id) => {
                const minimapObjectData = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[id];
                return {
                    key: minimapObjectData.id,
                    component: RadioMinimapObject,
                    props: { minimapObjectData: minimapObjectData }
                }
            });;
    }

    function addMinimapObject() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[id] = {
            id: id,
            devName: "",
            type: "circle",
            args: [],
            dialog: "",
            object: "",
            interaction: "",
        }
        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.push(id);

        $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;
    }

    function copyMinimapObject() {
        if(selectedMinimapObjectID !== undefined) {
            const existingMinimapObjectIndex = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.indexOf(selectedMinimapObjectID);
            const selectedMinimapObjectData = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[selectedMinimapObjectID];
            const copiedMinimapObjectData: ProjectMinimapObjectData = JSON.parse(JSON.stringify(selectedMinimapObjectData));
            const copiedMinimapObjectID = randomID(idLength);
            copiedMinimapObjectData.id = copiedMinimapObjectID;
            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[copiedMinimapObjectID] = copiedMinimapObjectData;
            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.splice(existingMinimapObjectIndex + 1, 0, copiedMinimapObjectID);
            // $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.push(copiedMinimapObjectId);

            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;

            selectedMinimapObjectID = copiedMinimapObjectID
        }
    }

    function deleteMinimapObject() {
        if(selectedMinimapObjectID !== undefined) {
            const backupMinimapObjectID = selectedMinimapObjectID;
            selectedMinimapObjectID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering;
            const minimapObjectIndex = ordering.findIndex(id => id === backupMinimapObjectID);
            for(let index = minimapObjectIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedMinimapObjectID = ordering[minimapObjectIndex] ?? ordering[minimapObjectIndex-1];
            // Delete minimap object data from project data
            delete $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.data[backupMinimapObjectID];

            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;
        }
    }

    function moveMinimapObjectUp() {
        if(selectedMinimapObjectID !== undefined && $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering;
            const minimapObjectIndex = ordering.findIndex(id => id === selectedMinimapObjectID);
            if(minimapObjectIndex <= 0) { return; }
            const tempSwap = ordering[minimapObjectIndex];
            ordering[minimapObjectIndex] = ordering[minimapObjectIndex - 1]
            ordering[minimapObjectIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;
        }
    }

    function moveMinimapObjectDown() {
        if(selectedMinimapObjectID !== undefined && $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering;
            const minimapObjectIndex = ordering.findIndex(id => id === selectedMinimapObjectID);
            if(minimapObjectIndex === -1 || minimapObjectIndex === $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects.ordering.length - 1) { return; }
            const tempSwap = ordering[minimapObjectIndex];
            ordering[minimapObjectIndex] = ordering[minimapObjectIndex + 1]
            ordering[minimapObjectIndex + 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects = $projectStore.storage.states.data[selectedStateID].locations.data[selectedMinimapLocationID].minimapObjects;
        }
    }
</script>

<FormGrouping class="shrink
    w-full h-full min-h-0"
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Minimap Objects</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addMinimapObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyMinimapObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteMinimapObject}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveMinimapObjectUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveMinimapObjectDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedMinimapObjectID}
            deselectable={true}
            scrollingRadioData={scrollingMinimapObjectData} />
    </svelte:fragment>
</FormGrouping>