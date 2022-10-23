<script lang="ts">
    import RadioInteractionResult from "../components/RadioInteractionResult.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectInteractionResultData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedStateID: string;
    export let selectedInteractionID: string;
    export let selectedResultID: string | undefined;
    let customClass: string = "";
    export { customClass as class };

    let scrollingResultData: ScrollingRadioData[];
    function generateResultData(): ScrollingRadioData[] {
        return $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering
            .filter(id => id !== undefined).map((id) => {
                const resultData = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[id];
                return {
                    key: resultData.id,
                    component: RadioInteractionResult,
                    props: { resultData: resultData }
                }
            });
    }
    $: {
        // $projectStore.storage.states.data[selectedStateID].interactions;
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
            scrollingResultData = generateResultData();
        }
    }
    $: {
        // Reset result ID whenever interaction ID changed
        selectedInteractionID;
        selectedResultID = undefined;
    }

    function addResult() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[id] = {
            id: id,
            devName: "",
            type: "setFlag",
            args: [],
        }
        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering.push(id);

        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
    }

    function copyResult() {
        if(selectedResultID !== undefined) {
            const selectedResultData = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[selectedResultID];
            const copiedResultData: ProjectInteractionResultData = JSON.parse(JSON.stringify(selectedResultData));
            const copiedResultID = randomID(idLength);
            copiedResultData.id = copiedResultID;
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[copiedResultID] = copiedResultData;
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering.push(copiedResultID);

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
        }
    }

    function deleteResult() {
        if(selectedResultID !== undefined) {
            const backupResultID = selectedResultID;
            selectedResultID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering;
            const resultIndex = ordering.findIndex(id => id === backupResultID);
            for(let index = resultIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedResultID = ordering[resultIndex] ?? ordering[resultIndex-1];
            // Delete result data from project data
            delete $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.data[backupResultID];

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
        }
    }

    function moveResultUp() {
        if(selectedResultID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering;
            const resultIndex = ordering.findIndex(id => id === selectedResultID);
            if(resultIndex <= 0) { return; }
            const tempSwap = ordering[resultIndex];
            ordering[resultIndex] = ordering[resultIndex - 1]
            ordering[resultIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
        }
    }

    function moveResultDown() {
        if(selectedResultID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering;
            const resultIndex = ordering.findIndex(id => id === selectedResultID);
            if(resultIndex === -1 || resultIndex === $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results.ordering.length - 1) { return; }
            const tempSwap = ordering[resultIndex];
            ordering[resultIndex] = ordering[resultIndex - 1]
            ordering[resultIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].results;
        }
    }
</script>

<FormGrouping class={`shrink
    w-full min-h-0
    ${customClass}`}
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Interaction Results</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addResult}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyResult}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteResult}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveResultUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveResultDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedResultID}
            deselectable={true}
            scrollingRadioData={scrollingResultData} />
    </svelte:fragment>
</FormGrouping>