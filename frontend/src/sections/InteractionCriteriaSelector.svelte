<script lang="ts">
    import RadioInteractionCriteria from "../components/RadioInteractionCriteria.svelte";
    import FormGrouping from "../components/FormGrouping.svelte";
    import IconButton from "../components/IconButton.svelte";
    import ScrollingRadio from "../components/ScrollingRadio.svelte";
    import { idLength, ProjectInteractionCriteriaData, projectStore, randomID, ScrollingRadioData } from "../miscellaneous";

    export let selectedStateID: string;
    export let selectedInteractionID: string;
    export let selectedCriteriaID: string | undefined;
    let customClass: string = "";
    export { customClass as class };

    let scrollingCriteriaData: ScrollingRadioData[];
    function generateCriteriaData(): ScrollingRadioData[] {
        return $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering
            .filter(id => id !== undefined).map((id) => {
                const criteriaData = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[id];
                return {
                    key: criteriaData.id,
                    component: RadioInteractionCriteria,
                    props: { criteriaData: criteriaData }
                }
            });
    }
    $: {
        // $projectStore.storage.states.data[selectedStateID].interactions;
        if($projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID] !== undefined) {
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
            scrollingCriteriaData = generateCriteriaData();
        }
    }
    $: {
        // Reset criteria ID whenever interaction ID changed
        selectedInteractionID;
        selectedCriteriaID = undefined;
    }

    function addCriteria() {
        const id = randomID(idLength);
        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[id] = {
            id: id,
            devName: "",
            type: "flagEquals",
            args: [],
        }
        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering.push(id);

        $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
    }

    function copyCriteria() {
        if(selectedCriteriaID !== undefined) {
            const selectedCriteriaData = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[selectedCriteriaID];
            const copiedCriteriaData: ProjectInteractionCriteriaData = JSON.parse(JSON.stringify(selectedCriteriaData));
            const copiedCriteriaID = randomID(idLength);
            copiedCriteriaData.id = copiedCriteriaID;
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[copiedCriteriaID] = copiedCriteriaData;
            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering.push(copiedCriteriaID);

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
        }
    }

    function deleteCriteria() {
        if(selectedCriteriaID !== undefined) {
            const backupCriteriaID = selectedCriteriaID;
            selectedCriteriaID = undefined;

            // Modify ordering in-place (without "setting")
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering;
            const criteriaIndex = ordering.findIndex(id => id === backupCriteriaID);
            for(let index = criteriaIndex; index < ordering.length - 1; index++) {
                ordering[index] = ordering[index + 1] ?? undefined;
            }
            ordering.pop();
            selectedCriteriaID = ordering[criteriaIndex] ?? ordering[criteriaIndex-1];
            // Delete criteria data from project data
            delete $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.data[backupCriteriaID];

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
        }
    }

    function moveCriteriaUp() {
        if(selectedCriteriaID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering;
            const criteriaIndex = ordering.findIndex(id => id === selectedCriteriaID);
            if(criteriaIndex <= 0) { return; }
            const tempSwap = ordering[criteriaIndex];
            ordering[criteriaIndex] = ordering[criteriaIndex - 1]
            ordering[criteriaIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
        }
    }

    function moveCriteriaDown() {
        if(selectedCriteriaID !== undefined && $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering.length > 1) {
            const ordering = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering;
            const criteriaIndex = ordering.findIndex(id => id === selectedCriteriaID);
            if(criteriaIndex === -1 || criteriaIndex === $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria.ordering.length - 1) { return; }
            const tempSwap = ordering[criteriaIndex];
            ordering[criteriaIndex] = ordering[criteriaIndex - 1]
            ordering[criteriaIndex - 1] = tempSwap;

            $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria = $projectStore.storage.states.data[selectedStateID].interactions.data[selectedInteractionID].criteria;
        }
    }
</script>

<FormGrouping class={`shrink
    w-full min-h-0
    ${customClass}`}
    contentClass="scrollbar-thin scrollbar-thumb-slate-600 hover:scrollbar-thumb-rounded overflow-x-hidden
        pr-4 mr-1">
    <svelte:fragment slot="header">
        <p class="text-slate-300 text-xl align-middle">Interaction Criteria</p>
        <div class="flex flex-row space-x-4">
            <div class="flex flex-row space-x-1">
                <IconButton onclick={addCriteria}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </IconButton>
                <IconButton onclick={copyCriteria}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                </IconButton>
                <IconButton onclick={deleteCriteria}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </IconButton>
            </div>
            <div class="flex flex-row space-x-1">
                <IconButton onclick={moveCriteriaUp}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </IconButton>
                <IconButton onclick={moveCriteriaDown}>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </IconButton>
            </div>
        </div>
    </svelte:fragment>
    <svelte:fragment slot="content">
        <ScrollingRadio bind:selectedID={selectedCriteriaID}
            deselectable={true}
            scrollingRadioData={scrollingCriteriaData} />
    </svelte:fragment>
</FormGrouping>