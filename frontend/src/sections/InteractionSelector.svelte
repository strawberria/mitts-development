<script lang="ts">
    import RadioInteraction from "../components/RadioInteraction.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectInteractionData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedStateID: string;
    export let selectedInteractionID: string | undefined;
    let customClass: string = "";
    export { customClass as class };

    let scrollingInteractionData: ScrollingRadioData[];
    function generateInteractionData(): ScrollingRadioData[] {
        return $projectStore.storage.states.data[selectedStateID].interactions.ordering
            .filter(id => id !== undefined).map((id) => {
                const interactionData = $projectStore.storage.states.data[selectedStateID].interactions.data[id];
                return {
                    key: interactionData.id,
                    component: RadioInteraction,
                    props: { interactionData: interactionData }
                }
            });
    }
    $: {
        if($projectStore.storage.states.data[selectedStateID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions;
            scrollingInteractionData = generateInteractionData();
        }
    }

    function addInteraction() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[selectedStateID].interactions.data[id] = {
            id: id,
            devName: "",
            action: "",
            components: ["", ""],
            criteria: {
                data: {},
                ordering: [],
            },
            results: {
                data: {},
                ordering: [],
            }
        }
        $projectStore.storage.states.data[selectedStateID].interactions.ordering.push(id);

        $projectStore.storage.states.data[selectedStateID].interactions = $projectStore.storage.states.data[selectedStateID].interactions;
    }

    function copyInteraction() {
        if(selectedInteractionID !== undefined) {
            const selectedInteractionData = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID];
            const copiedInteractionData: ProjectInteractionData = JSON.parse(JSON.stringify(selectedInteractionData));
            const copiedInteractionId = randomID(idLength);
            copiedInteractionData.id = copiedInteractionId;
            $projectStore.storage.states.data[selectedStateID].interactions.data[copiedInteractionId] = copiedInteractionData;
            $projectStore.storage.states.data[selectedStateID].interactions.ordering.push(copiedInteractionId);

            $projectStore.storage.states.data[selectedStateID].interactions = $projectStore.storage.states.data[selectedStateID].interactions;
        }
    }

    function deleteInteraction() {
        if(selectedInteractionID !== undefined) {
            const backupInteractionID = selectedInteractionID;
            selectedInteractionID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.ordering;
            const locationIndex = ordering.findIndex(id => id === backupInteractionID);
            for(let index = locationIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedInteractionID = ordering[locationIndex] ?? ordering[locationIndex-1];
            // Delete interaction data from project data
            delete $projectStore.storage.states.data[selectedStateID].interactions.data[backupInteractionID];

            $projectStore.storage.states.data[selectedStateID].interactions = $projectStore.storage.states.data[selectedStateID].interactions;
        }
    }

    function moveInteractionUp() {
        if(selectedInteractionID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.ordering;
            const interactionIndex = ordering.findIndex(id => id === selectedInteractionID);
            if(interactionIndex <= 0) { return; }
            const tempSwap = ordering[interactionIndex];
            ordering[interactionIndex] = ordering[interactionIndex - 1]
            ordering[interactionIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions = $projectStore.storage.states.data[selectedStateID].interactions;
        }
    }

    function moveInteractionDown() {
        if(selectedInteractionID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.ordering;
            const interactionIndex = ordering.findIndex(id => id === selectedInteractionID);
            if(interactionIndex === -1 || interactionIndex === $projectStore.storage.states.data[selectedStateID].interactions.ordering.length - 1) { return; }
            const tempSwap = ordering[interactionIndex];
            ordering[interactionIndex] = ordering[interactionIndex + 1]
            ordering[interactionIndex + 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions = $projectStore.storage.states.data[selectedStateID].interactions;
        }
    }
</script>

<FormGrouping class={`shrink
    w-full h-3/5 min-h-0
    ${customClass}`}
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Game Interactions</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addInteraction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyInteraction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteInteraction}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveInteractionUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveInteractionDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedInteractionID}
            deselectable={true}
            scrollingRadioData={scrollingInteractionData} />
    </svelte:fragment>
</FormGrouping>